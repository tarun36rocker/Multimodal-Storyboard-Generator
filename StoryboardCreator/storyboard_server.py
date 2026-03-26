"""
Storyboard Creator FastAPI Server
Provides endpoints for generating storyboards for product presentations.
Uses SDXL or similar image generation for creating visual narratives.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import torch
import numpy as np
import os
import gc
import time
import base64
import random
import re
from io import BytesIO
from datetime import datetime
from pathlib import Path
import subprocess
import sys
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
from diffusers import (
    DPMSolverMultistepScheduler,
    EulerDiscreteScheduler,
    EulerAncestralDiscreteScheduler,
    DDIMScheduler,
    PNDMScheduler,
)
from PIL import Image as PILImage, ImageDraw, ImageFont


# ============================================
# User Paths (from ContextUI environment variables)
# ============================================
def get_models_path() -> Path:
    """Get models path from env var or fallback to default."""
    env_path = os.environ.get('CONTEXTUI_MODELS_PATH')
    if env_path:
        return Path(env_path) / "StoryboardCreator"
    # Fallback: relative to script location
    return Path(__file__).parent.parent / "models" / "StoryboardCreator"


def get_generated_storyboards_path() -> Path:
    """Get generated storyboards path from env var or fallback to default."""
    env_path = os.environ.get('CONTEXTUI_GENERATED_STORYBOARDS_PATH')
    if env_path:
        return Path(env_path) / "StoryboardCreator"
    # Fallback: relative to script location
    return Path(__file__).parent.parent / "generated_storyboards"


app = FastAPI(title="Storyboard Creator Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
pipeline = None
model_id = ""
model_ready = False
model_loading = False
loading_progress = 0.0
last_error = None
generated_storyboards: List[Dict[str, Any]] = []
generating = False
generation_progress = 0.0
current_scene_num = 0
total_scenes = 0
generation_status = ""
stop_generation_flag = False
generation_log: List[str] = []
latest_composite: Optional[Dict[str, Any]] = None

# Guardrail LLM state (GGUF via llama-cpp-python)
guardrail_models: List[Dict[str, Any]] = [
    {
        "id": "llama3.1",
        "name": "Llama 3.1",
        "params": "8B",
        "repo": "bartowski/Meta-Llama-3.1-8B-Instruct-GGUF",
        "gguf_file": None,
        "notes": "Strong all-round instruction following.",
        "installed": False,
    },
    {
        "id": "qwen2.5",
        "name": "Qwen 2.5",
        "params": "7B",
        "repo": "bartowski/Qwen2.5-7B-Instruct-GGUF",
        "gguf_file": None,
        "notes": "Good multilingual coverage and precision.",
        "installed": False,
    },
]
selected_guardrail_model_id: str = ""
guardrail_llm = None
guardrail_llm_id = ""
guardrail_llm_path = ""

# Thread pool for running blocking operations
executor = ThreadPoolExecutor(max_workers=1)


def _get_scheduler_map():
    """Get mapping of scheduler names to scheduler classes."""
    return {
        "DPM++ 2M": DPMSolverMultistepScheduler,
        "Euler": EulerDiscreteScheduler,
        "Euler A": EulerAncestralDiscreteScheduler,
        "DDIM": DDIMScheduler,
        "PNDM": PNDMScheduler,
    }


def _guardrails_dir() -> Path:
    base_dir = get_models_path() / "guardrails"
    base_dir.mkdir(parents=True, exist_ok=True)
    return base_dir


def _guardrails_manifest_path() -> Path:
    return _guardrails_dir() / "guardrails_manifest.json"


def _load_guardrails_manifest() -> Dict[str, Any]:
    path = _guardrails_manifest_path()
    if not path.exists():
        return {}
    try:
        with open(path, "r") as f:
            data = json.load(f)
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    return {}


def _save_guardrails_manifest(data: Dict[str, Any]):
    path = _guardrails_manifest_path()
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def _refresh_guardrail_models() -> List[Dict[str, Any]]:
    """Refresh installed status for guardrail models based on local manifest."""
    manifest = _load_guardrails_manifest()
    for model in guardrail_models:
        entry = manifest.get(model["id"])
        model_path = entry.get("path") if isinstance(entry, dict) else None
        model["installed"] = bool(model_path and Path(model_path).exists())
    return guardrail_models


def _extract_json_block(text: str) -> Optional[str]:
    """Extract JSON object or array from text."""
    if not text:
        return None
    cleaned = re.sub(r"```(?:json)?", "", text, flags=re.IGNORECASE).replace("```", "").strip()
    obj_start = cleaned.find("{")
    arr_start = cleaned.find("[")
    if obj_start == -1 and arr_start == -1:
        return None
    if obj_start != -1 and (arr_start == -1 or obj_start < arr_start):
        start = obj_start
        end = cleaned.rfind("}")
    else:
        start = arr_start
        end = cleaned.rfind("]")
    if start == -1 or end == -1 or end <= start:
        return None
    return cleaned[start:end + 1]


def _parse_guardrail_response(text: str) -> Optional[Dict[str, Any]]:
    """Parse guardrail JSON response. Returns None if invalid."""
    json_block = _extract_json_block(text)
    if not json_block:
        return None
    try:
        data = json.loads(json_block)
    except Exception:
        return None
    if "allowed" not in data or "reason" not in data:
        return None
    if not isinstance(data["allowed"], bool) or not isinstance(data["reason"], str):
        return None
    if data["allowed"]:
        data["reason"] = "Allowed"
    return data


def _get_guardrail_model_entry(model_id: str) -> Optional[Dict[str, Any]]:
    return next((m for m in guardrail_models if m["id"] == model_id), None)


def _get_guardrail_model_path(model_id: str) -> Optional[str]:
    manifest = _load_guardrails_manifest()
    entry = manifest.get(model_id)
    if isinstance(entry, dict):
        path = entry.get("path")
        if path and Path(path).exists():
            return path
    return None


def _load_guardrail_llm(model_id: str) -> Optional[str]:
    """Load guardrail LLM into memory. Returns error string if failed."""
    global guardrail_llm, guardrail_llm_id, guardrail_llm_path

    model_path = _get_guardrail_model_path(model_id)
    if not model_path:
        return "LLM unavailable"

    if guardrail_llm is not None and guardrail_llm_id == model_id and guardrail_llm_path == model_path:
        return None

    try:
        from llama_cpp import Llama
    except Exception:
        return "LLM runtime not installed"

    try:
        guardrail_llm = Llama(
            model_path=model_path,
            n_ctx=2048,
            n_gpu_layers=0,
            verbose=False,
        )
        guardrail_llm_id = model_id
        guardrail_llm_path = model_path
        return None
    except Exception:
        guardrail_llm = None
        guardrail_llm_id = ""
        guardrail_llm_path = ""
        return "LLM unavailable"


def _run_guardrail_check_sync(text: str) -> Dict[str, Any]:
    """Run guardrail check using the selected LLM. Fail closed on errors."""
    if not selected_guardrail_model_id:
        return {"allowed": False, "reason": "No LLM selected"}

    _refresh_guardrail_models()
    selected = _get_guardrail_model_entry(selected_guardrail_model_id)
    if not selected or not selected.get("installed"):
        return {"allowed": False, "reason": "LLM unavailable"}

    load_error = _load_guardrail_llm(selected_guardrail_model_id)
    if load_error:
        return {"allowed": False, "reason": load_error}

    system_prompt = (
        "You are a strict content safety gate. "
        "Return JSON only with keys allowed (boolean) and reason (string). "
        "If the text is acceptable, respond exactly: "
        "{\"allowed\": true, \"reason\": \"Allowed\"}. "
        "If not acceptable, respond with: "
        "{\"allowed\": false, \"reason\": \"<brief reason>\"}. "
        "No extra text."
    )

    try:
        content = ""
        try:
            response = guardrail_llm.create_chat_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Text: {text}"},
                ],
                temperature=0,
                max_tokens=96,
            )
            content = response["choices"][0]["message"]["content"]
        except Exception:
            prompt = (
                f"{system_prompt}\n\nUser text: {text}\n\nResponse:\n"
            )
            response = guardrail_llm(
                prompt,
                temperature=0,
                max_tokens=96,
                stop=["\n\n"],
            )
            content = response["choices"][0]["text"]

        parsed = _parse_guardrail_response(content)
        if not parsed:
            return {"allowed": False, "reason": "LLM unavailable"}
        if parsed["allowed"]:
            return {"allowed": True, "reason": "Allowed"}
        return {"allowed": False, "reason": parsed.get("reason", "Blocked")}
    except Exception:
        return {"allowed": False, "reason": "LLM unavailable"}


async def _run_guardrail_check(text: str) -> Dict[str, Any]:
    return await asyncio.to_thread(_run_guardrail_check_sync, text)


def _derive_scene_text(scene_description: str) -> Dict[str, str]:
    """Derive a short title and one-sentence caption from a scene description."""
    cleaned = (scene_description or "").strip()
    if not cleaned:
        return {"title": "Scene", "caption": "Scene description unavailable."}

    words = cleaned.split()
    if len(words) <= 5:
        title_words = words
    else:
        title_words = words[:min(8, len(words))]
    title = " ".join(title_words).strip().strip(",.;:!-")

    caption = cleaned
    if not caption.endswith((".", "!", "?")):
        caption += "."
    caption = caption[0].upper() + caption[1:] if caption else caption

    return {"title": title, "caption": caption}


def _fallback_auto_scenes(idea: str, num_scenes: int) -> List[str]:
    """Deterministic fallback scenes if LLM output is incomplete."""
    base_beats = ["Setup", "Problem", "Discovery", "Feature", "Benefit", "Closing"]
    expandable = ["Discovery", "Feature", "Benefit"]
    count = max(1, min(12, int(num_scenes)))

    beats: List[str] = []
    if count <= len(base_beats):
        beats = base_beats[:count]
    else:
        beats = base_beats[:-1]
        extra = count - len(base_beats)
        for i in range(extra):
            beats.append(expandable[i % len(expandable)])
        beats.append("Closing")

    templates = {
        "Setup": f"Setup: Introduce the context for {idea}.",
        "Problem": f"Problem: Show the pain point that {idea} addresses.",
        "Discovery": f"Discovery: Reveal {idea} as the solution.",
        "Feature": f"Feature: Highlight a key feature of {idea} in action.",
        "Benefit": f"Benefit: Show the positive outcome from using {idea}.",
        "Closing": f"Closing: End with a confident wrap-up for {idea}.",
    }
    return [templates.get(b, f"{b}: {idea}.") for b in beats]


def _create_composite_storyboard(images: List, scenes_data: List[Dict], width: int, height: int) -> PILImage.Image:
    """
    Create a composite storyboard image showing all scenes in a grid or horizontal layout.
    
    Args:
        images: List of PIL Image objects
        scenes_data: List of scene dictionaries with description and scene_number
        width: Individual scene width
        height: Individual scene height
    
    Returns:
        PIL Image object of the composite
    """
    if not images:
        return None
    
    num_scenes = len(images)
    
    # Determine layout: horizontal strip for <=4 scenes, 2-row grid for more
    if num_scenes <= 4:
        cols = num_scenes
        rows = 1
    else:
        cols = (num_scenes + 1) // 2  # Ceil division
        rows = 2
    
    # Resize scenes for composite (smaller than originals to fit)
    scene_width = width // 2
    scene_height = height // 2
    resized_images = [img.resize((scene_width, scene_height), PILImage.Resampling.LANCZOS) for img in images]
    
    # Create composite with padding
    padding = 10
    label_height = 80
    total_width = cols * (scene_width + padding) + padding
    total_height = rows * (scene_height + label_height + padding) + padding
    
    composite = PILImage.new('RGB', (total_width, total_height), color=(20, 24, 82))  # slate-900
    draw = ImageDraw.Draw(composite)
    
    # Try to use a basic font, fall back to default if not available
    try:
        title_font = ImageFont.truetype("arial.ttf", 14)
        caption_font = ImageFont.truetype("arial.ttf", 12)
    except:
        title_font = ImageFont.load_default()
        caption_font = ImageFont.load_default()

    def _wrap_text(text: str, max_chars: int, max_lines: int) -> List[str]:
        words = (text or "").split()
        lines = []
        current = ""
        for word in words:
            candidate = f"{current} {word}".strip()
            if len(candidate) <= max_chars:
                current = candidate
            else:
                if current:
                    lines.append(current)
                current = word
                if len(lines) >= max_lines:
                    break
        if current and len(lines) < max_lines:
            lines.append(current)
        return lines[:max_lines]
    
    # Place each scene with label
    for idx, (img, scene_data) in enumerate(zip(resized_images, scenes_data)):
        row = idx // cols
        col = idx % cols
        
        x = padding + col * (scene_width + padding)
        y = padding + row * (scene_height + label_height + padding)
        
        # Paste image
        composite.paste(img, (x, y))
        
        # Draw border
        border_color = (34, 197, 94)  # emerald-500
        draw.rectangle([x, y, x + scene_width - 1, y + scene_height - 1], outline=border_color, width=2)
        
        # Draw title and caption
        label_y = y + scene_height + 5
        scene_num = scene_data.get("scene_number", idx + 1)
        title_text = scene_data.get("title") or f"Scene {scene_num}"
        caption_text = scene_data.get("caption") or scene_data.get("description", "")

        max_chars = max(20, scene_width // 8)
        title_line = _wrap_text(f"Scene {scene_num}: {title_text}", max_chars, 1)
        caption_lines = _wrap_text(caption_text, max_chars, 2)

        draw.text((x + 5, label_y), title_line[0] if title_line else f"Scene {scene_num}", fill=(34, 211, 238), font=title_font)
        caption_y = label_y + 18
        for line in caption_lines:
            draw.text((x + 5, caption_y), line, fill=(148, 163, 184), font=caption_font)
            caption_y += 14
    
    return composite


class ModelConfig(BaseModel):
    model_id: str = "stabilityai/stable-diffusion-xl-base-1.0"
    use_cpu_offload: bool = True
    use_fp16: bool = True
    enable_attention_slicing: bool = True
    enable_vae_tiling: bool = False


class SceneRequest(BaseModel):
    description: str
    product_context: str = ""
    style: str = "professional marketing"
    model_id: str = "stabilityai/stable-diffusion-xl-base-1.0"
    negative_prompt: str = "watermark, text, low quality, blurry, inconsistent style, distorted composition"
    width: int = 512
    height: int = 512
    steps: int = 12
    cfg_scale: float = 5.0
    seed: int = -1
    scheduler: str = "Euler"


class StoryboardRequest(BaseModel):
    product_name: str
    product_description: str
    scenes: List[str]
    overall_style: str = "professional marketing presentation"
    num_scenes: int = 0  # Will be len(scenes) if not specified
    model_id: str = "stabilityai/stable-diffusion-xl-base-1.0"
    negative_prompt: str = "watermark, text, low quality, blurry, inconsistent style, distorted composition"
    steps: int = 12
    cfg_scale: float = 5.0
    width: int = 512
    height: int = 512
    seed: int = -1
    scheduler: str = "Euler"
    output_format: str = "png"
    jpg_quality: int = 95
    auto_save: bool = True
    save_metadata: bool = True


class GuardrailCheckRequest(BaseModel):
    text: str


class GuardrailModelSelectRequest(BaseModel):
    id: str


class GuardrailModelInstallRequest(BaseModel):
    id: str


class AutoScenesRequest(BaseModel):
    idea: str
    num_scenes: int


def clear_cuda():
    """Best-effort VRAM release."""
    if not torch.cuda.is_available():
        return

    try:
        for i in range(torch.cuda.device_count()):
            with torch.cuda.device(i):
                torch.cuda.synchronize()
    except Exception:
        pass

    for _ in range(5):
        gc.collect()

    try:
        for device_id in range(torch.cuda.device_count()):
            with torch.cuda.device(device_id):
                torch.cuda.empty_cache()
                torch.cuda.ipc_collect()
    except Exception as e:
        print(f"Warning during CUDA cleanup: {e}")


def aggressive_memory_cleanup():
    """Aggressive memory cleanup for low VRAM."""
    import gc
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        try:
            torch.cuda.ipc_collect()
        except:
            pass


def get_vram_stats():
    """Get VRAM statistics."""
    if not torch.cuda.is_available():
        return None
    try:
        device = torch.cuda.current_device()
        free, total = torch.cuda.mem_get_info()
        allocated = torch.cuda.memory_allocated(device)
        return {
            "total": total,
            "free": free,
            "allocated": allocated,
            "used": total - free,
        }
    except Exception:
        return None


def add_log(message: str, verbose: bool = False):
    """Add timestamped entry to generation log."""
    global generation_log
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = f"[{timestamp}] {message}"
    generation_log.append(entry)
    # Keep only last 100 entries
    if len(generation_log) > 100:
        generation_log = generation_log[-100:]
    # Only print important messages to reduce terminal noise
    if not verbose:
        print(entry)


@app.get("/")
async def root():
    return {"status": "online", "service": "Storyboard Creator Server"}


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_ready": model_ready,
        "model_loading": model_loading,
        "model_id": model_id,
        "cuda_available": torch.cuda.is_available(),
    }


@app.get("/status")
async def status():
    global model_ready, model_loading, model_id, last_error, generating
    global generation_progress, current_scene_num, total_scenes, generation_status

    vram = get_vram_stats()

    return {
        "model_ready": model_ready,
        "model_loading": model_loading,
        "loading_progress": loading_progress,
        "model_id": model_id,
        "cuda_available": torch.cuda.is_available(),
        "vram": vram,
        "error": last_error,
        "generating": generating,
        "generation_progress": generation_progress,
        "current_scene": current_scene_num,
        "total_scenes": total_scenes,
        "generation_status": generation_status,
        "has_storyboards": len(generated_storyboards) > 0,
        "num_storyboards": len(generated_storyboards),
    }


@app.get("/models")
async def get_models():
    """Get available models optimized for NVIDIA GeForce MX450 (2GB VRAM)."""
    return [
        {"id": "stabilityai/stable-diffusion-xl-base-1.0", "name": "SDXL Base 1.0", "type": "huggingface", "vram_gb": 6.5, "notes": "[WARNING] Best quality. Requires 512x512, steps <=15, cfg <=6.0"},
        {"id": "SG161222/RealVisXL_V5.0", "name": "RealVisXL V5.0", "type": "huggingface", "vram_gb": 7.0, "notes": "[INFO] Photorealistic. Use 512x512, steps <=12, cfg <=5.0"},
        {"id": "runwayml/stable-diffusion-v1-5", "name": "SD v1.5", "type": "huggingface", "vram_gb": 3.5, "notes": "[OK] Best for MX450. Fast, reliable. Can use up to 20 steps with cfg <=6.0"},
    ]


@app.get("/guardrails/models")
async def get_guardrail_models():
    models = _refresh_guardrail_models()
    return {"models": models, "selected_id": selected_guardrail_model_id}


@app.post("/guardrails/models/select")
async def select_guardrail_model(req: GuardrailModelSelectRequest):
    global selected_guardrail_model_id
    if not req.id:
        return {"success": False, "error": "Missing model id"}
    if not any(m["id"] == req.id for m in guardrail_models):
        return {"success": False, "error": "Unknown LLM"}
    selected_guardrail_model_id = req.id
    return {"success": True, "selected_id": selected_guardrail_model_id}


@app.post("/guardrails/models/install")
async def install_guardrail_model(req: GuardrailModelInstallRequest):
    if not req.id:
        return {"success": False, "error": "Missing model id"}
    model_entry = next((m for m in guardrail_models if m["id"] == req.id), None)
    if not model_entry:
        return {"success": False, "error": "Unknown LLM"}
    try:
        _refresh_guardrail_models()
        if model_entry.get("installed"):
            existing_path = _get_guardrail_model_path(req.id)
            return {"success": True, "path": existing_path}
        try:
            from huggingface_hub import hf_hub_download, list_repo_files
        except Exception:
            return {"success": False, "error": "huggingface-hub not installed"}

        repo_id = model_entry.get("repo")
        gguf_file = model_entry.get("gguf_file")
        if not repo_id:
            return {"success": False, "error": "Model repo missing"}

        if not gguf_file:
            files = list_repo_files(repo_id)
            gguf_files = [f for f in files if f.endswith(".gguf")]
            if not gguf_files:
                return {"success": False, "error": f"No .gguf files found in {repo_id}"}
            for preferred in ["Q4_K_M", "Q4_K_S", "Q5_K_M", "Q8_0"]:
                for f in gguf_files:
                    if preferred in f:
                        gguf_file = f
                        break
                if gguf_file:
                    break
            if not gguf_file:
                gguf_file = gguf_files[0]

        add_log(f"Downloading guardrail model: {repo_id}/{gguf_file}")
        model_path = hf_hub_download(
            repo_id=repo_id,
            filename=gguf_file,
            cache_dir=str(_guardrails_dir()),
        )

        manifest = _load_guardrails_manifest()
        manifest[req.id] = {"path": model_path, "repo": repo_id, "gguf_file": gguf_file}
        _save_guardrails_manifest(manifest)
        _refresh_guardrail_models()
        return {"success": True, "path": model_path}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/guardrails/check")
async def guardrail_check(req: GuardrailCheckRequest):
    if not req.text.strip():
        return {"allowed": True, "reason": "Allowed"}
    result = await _run_guardrail_check(req.text)
    return result


@app.post("/auto-scenes")
async def generate_auto_scenes(req: AutoScenesRequest):
    idea = (req.idea or "").strip()
    if not idea:
        return {"success": False, "error": "Please enter a storyboard idea"}
    if req.num_scenes <= 0:
        return {"success": False, "error": "Number of scenes must be at least 1"}
    if not selected_guardrail_model_id:
        return {"success": False, "error": "No LLM selected"}

    guardrail_result = await _run_guardrail_check(idea)
    if not guardrail_result.get("allowed", False):
        return {"success": False, "error": guardrail_result.get("reason", "Blocked")}

    load_error = await asyncio.to_thread(_load_guardrail_llm, selected_guardrail_model_id)
    if load_error:
        return {"success": False, "error": load_error}

    system_prompt = (
        "You generate storyboard scene descriptions. "
        "Return JSON only: an array of strings. "
        f"Return exactly {req.num_scenes} items. "
        "Each item should be one concise sentence describing a scene. "
        "No extra text."
    )

    try:
        content = ""
        try:
            response = guardrail_llm.create_chat_completion(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Storyboard idea: {idea}"},
                ],
                temperature=0,
                max_tokens=256,
            )
            content = response["choices"][0]["message"]["content"]
        except Exception:
            prompt = f"{system_prompt}\n\nIdea: {idea}\n\nResponse:\n"
            response = guardrail_llm(
                prompt,
                temperature=0,
                max_tokens=256,
                stop=["\n\n"],
            )
            content = response["choices"][0]["text"]

        json_block = _extract_json_block(content)
        scenes: List[str] = []
        if json_block:
            data = json.loads(json_block)
            if isinstance(data, list):
                scenes = [str(x).strip() for x in data if str(x).strip()]

        if len(scenes) < req.num_scenes:
            fallback = _fallback_auto_scenes(idea, req.num_scenes)
            if scenes:
                scenes = scenes + fallback[len(scenes):]
            else:
                scenes = fallback

        scenes = scenes[: req.num_scenes]
        return {"success": True, "scenes": scenes}
    except Exception:
        fallback = _fallback_auto_scenes(idea, req.num_scenes)
        return {"success": True, "scenes": fallback}


@app.post("/load-model")
async def load_model(config: ModelConfig):
    """Load an image generation model."""
    global pipeline, model_ready, model_loading, model_id, loading_progress, last_error

    if model_loading:
        return {"success": False, "error": "Model is already loading"}

    if model_ready and model_id == config.model_id:
        return {"success": True, "model_id": model_id, "message": "Model already loaded"}

    model_loading = True
    loading_progress = 0.0
    last_error = None

    try:
        from diffusers import StableDiffusionXLPipeline, StableDiffusionPipeline, AutoPipelineForText2Image

        device = "cuda" if torch.cuda.is_available() else "cpu"
        dtype = torch.float16 if (config.use_fp16 and device == "cuda") else torch.float32

        loading_progress = 0.2

        # Create models directory using user paths
        models_dir = get_models_path()
        models_dir.mkdir(parents=True, exist_ok=True)

        # Load from pretrained with auto-detection
        add_log(f"Loading model: {config.model_id}...")
        try:
            # Try AutoPipelineForText2Image which auto-detects the right pipeline class
            pipeline = AutoPipelineForText2Image.from_pretrained(
                config.model_id,
                torch_dtype=dtype,
                cache_dir=str(models_dir)
            )
        except Exception as e:
            add_log(f"Auto-pipeline failed, trying StableDiffusionXL: {str(e)[:100]}")
            # Fallback to SDXL
            try:
                pipeline = StableDiffusionXLPipeline.from_pretrained(
                    config.model_id,
                    torch_dtype=dtype,
                    cache_dir=str(models_dir)
                )
            except Exception as e2:
                add_log(f"StableDiffusionXL failed, trying standard SD: {str(e2)[:100]}")
                # Final fallback to standard SD
                pipeline = StableDiffusionPipeline.from_pretrained(
                    config.model_id,
                    torch_dtype=dtype,
                    cache_dir=str(models_dir)
                )

        loading_progress = 0.8

        # Apply optimizations
        if config.enable_attention_slicing:
            pipeline.enable_attention_slicing()
            add_log("Attention slicing enabled")

        if config.enable_vae_tiling:
            try:
                # Use new method: vae.enable_tiling() instead of deprecated pipeline.enable_vae_tiling()
                pipeline.vae.enable_tiling()
                add_log("VAE tiling enabled")
            except Exception:
                add_log("VAE tiling not supported for this model")

        if config.use_cpu_offload and device == "cuda":
            pipeline.enable_model_cpu_offload()
            add_log("CPU offload enabled")
        else:
            pipeline = pipeline.to(device)

        # Disable NSFW safety checker (too aggressive for product marketing)
        try:
            pipeline.safety_checker = None
        except Exception:
            pass  # Not all models have this

        loading_progress = 1.0
        model_id = config.model_id
        model_ready = True

        add_log(f"Model loaded successfully on {device}")

        return {"success": True, "device": device, "model_id": model_id}

    except Exception as e:
        last_error = str(e)
        model_ready = False
        add_log(f"Error loading model: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}
    finally:
        model_loading = False


@app.post("/unload_model")
async def unload_model():
    global pipeline, model_ready, model_id

    add_log("Unloading model...")

    if pipeline is not None:
        try:
            pipeline.to("cpu")
            if torch.cuda.is_available():
                torch.cuda.synchronize()
        except Exception as e:
            print(f"Error moving model to CPU: {e}")

    pipeline = None
    model_ready = False
    model_id = ""

    for _ in range(5):
        gc.collect()

    clear_cuda()
    add_log("Model unloaded")

    return {"success": True}


def _enhance_prompt_for_scene(scene_description: str, product_name: str, product_description: str, style: str) -> str:
    """Enhance a scene description with product context."""
    prompt = f"{scene_description} featuring {product_name}. {product_description}. Style: {style}. Professional marketing quality, high detail, suitable for presentation."
    return prompt


def _run_generation_sync(request: StoryboardRequest):
    """Synchronous storyboard generation function that runs in a thread."""
    global pipeline, model_ready, generated_storyboards, generating
    global generation_progress, current_scene_num, total_scenes, latest_composite
    global generation_status, stop_generation_flag, last_error, model_id, latest_composite

    try:
        from diffusers import (
            DPMSolverMultistepScheduler,
            EulerDiscreteScheduler,
            EulerAncestralDiscreteScheduler,
            DDIMScheduler,
            PNDMScheduler
        )

        # Set scheduler based on user request
        scheduler_map = {
            "DPM++ 2M": DPMSolverMultistepScheduler,
            "Euler": EulerDiscreteScheduler,
            "Euler A": EulerAncestralDiscreteScheduler,
            "DDIM": DDIMScheduler,
            "PNDM": PNDMScheduler
        }

        # Use the requested scheduler (or Euler as fallback)
        scheduler_class = scheduler_map.get(request.scheduler, EulerDiscreteScheduler)
        pipeline.scheduler = scheduler_class.from_config(pipeline.scheduler.config)
        add_log(f"Scheduler set to: {request.scheduler}")

        # Flat output folder
        output_dir = get_generated_storyboards_path()
        output_dir.mkdir(parents=True, exist_ok=True)

        start_time = time.time()
        generation_times = []
        num_scenes = len(request.scenes)
        storyboard_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        storyboard_dir = output_dir / storyboard_id
        storyboard_dir.mkdir(exist_ok=True)

        storyboard_data = {
            "product_name": request.product_name,
            "product_description": request.product_description,
            "scenes": [],
            "storyboard_id": storyboard_id,
            "created_at": datetime.now().isoformat(),
            "generation_time": 0,
        }

        for i, scene_desc in enumerate(request.scenes):
            if stop_generation_flag:
                add_log(f"Generation stopped by user at scene {i+1}/{num_scenes}")
                generation_status = f"Stopped at scene {i+1}/{num_scenes}"
                break

            current_scene_num = i + 1
            generation_progress = i / num_scenes
            generation_status = f"Generating scene {i+1}/{num_scenes}: {scene_desc[:50]}..."
            add_log(f"Scene {i+1}/{num_scenes}: {scene_desc}")

            # Enhance prompt with product context
            enhanced_prompt = _enhance_prompt_for_scene(
                scene_desc,
                request.product_name,
                request.product_description,
                request.overall_style
            )

            # Seed
            if request.seed < 0:
                current_seed = random.randint(0, 2**32 - 1)
            else:
                current_seed = request.seed + i

            generator = torch.Generator(device=pipeline.device)
            generator.manual_seed(current_seed)

            # Apply scheduler if specified
            if request.scheduler in _get_scheduler_map():
                scheduler_class = _get_scheduler_map()[request.scheduler]
                pipeline.scheduler = scheduler_class.from_config(pipeline.scheduler.config)
                add_log(f"Using scheduler: {request.scheduler}", verbose=True)

            scene_start = time.time()

            # Safety checks for generation - Conservative CFG for low VRAM GPUs
            # SDXL & RealViz: max 6.0 CFG (high CFG causes black images on MX450)
            # SD1.5: max 8.0 CFG (more stable)
            if "xl" in request.model_id.lower():  # SDXL or RealVizXL
                max_cfg = 6.0
                max_steps = 20
            elif "sd" in request.model_id.lower() and "v1" in request.model_id.lower():  # SD v1.5
                max_cfg = 8.0
                max_steps = 25
            else:
                max_cfg = 6.0
                max_steps = 20
            
            cfg_scale = max(1.0, min(request.cfg_scale, max_cfg))
            steps = max(1, min(request.steps, max_steps))
            
            if cfg_scale != request.cfg_scale:
                add_log(f"CFG clamped from {request.cfg_scale} to {cfg_scale} (max for {request.model_id.split('/')[-1]})")
            if steps != request.steps:
                add_log(f"Steps clamped from {request.steps} to {steps} (max for {request.model_id.split('/')[-1]})")
            
            try:
                with torch.no_grad():
                    result = pipeline(
                        prompt=enhanced_prompt,
                        negative_prompt=request.negative_prompt,
                        num_inference_steps=steps,
                        guidance_scale=cfg_scale,
                        generator=generator,
                        height=request.height,
                        width=request.width
                    )

                image = result.images[0]
                
                # Check for invalid values (NaN/Inf) and black images (OOM indicator)
                import numpy as np
                img_array = np.array(image)
                
                # Check for NaN or Inf values
                if np.isnan(img_array).any() or np.isinf(img_array).any():
                    add_log(f"ERROR Scene {i+1}: Invalid pixel values detected (NaN/Inf) - GPU memory corruption")
                    vram_info = get_vram_stats()
                    if vram_info:
                        add_log(f"VRAM: {vram_info['allocated']/1e9:.2f}GB allocated / {vram_info['total']/1e9:.2f}GB total")
                    add_log(f"SOLUTION: Try SD v1.5 model instead (more stable on MX450)")
                    last_error = f"Scene {i+1} failed - Memory corruption. Try SD v1.5 instead."
                    raise RuntimeError("Invalid pixel values - GPU memory corruption")
                
                # Check if image is completely black (likely OOM/failure)
                if np.mean(img_array) < 5:  # Very dark image
                    add_log(f"[WARNING] Scene {i+1} is black - OOM or settings too aggressive")
                    vram_info = get_vram_stats()
                    if vram_info:
                        add_log(f"   VRAM: {vram_info['allocated']/1e9:.2f}GB / {vram_info['total']/1e9:.2f}GB")
                    add_log(f"   SOLUTION: Use SD v1.5, reduce steps to <=15, keep CFG <=5.0")
                
            except Exception as e:
                add_log(f"ERROR generating scene {i+1}: {str(e)[:100]}")
                raise
            
            scene_time = time.time() - scene_start
            generation_times.append(scene_time)

            # Save to disk
            filepath = None
            if request.auto_save:
                filename = f"scene_{i+1:03d}_s{current_seed}.{request.output_format}"
                filepath = storyboard_dir / filename

                if request.output_format == "png":
                    image.save(filepath, format="PNG")
                elif request.output_format == "jpg":
                    image.save(filepath, format="JPEG", quality=request.jpg_quality, optimize=True)
                elif request.output_format == "webp":
                    image.save(filepath, format="WEBP", quality=90)

            # Convert to base64 for web display
            buffered = BytesIO()
            if request.output_format == "png":
                image.save(buffered, format="PNG")
                mime_type = "image/png"
            elif request.output_format == "jpg":
                image.save(buffered, format="JPEG", quality=request.jpg_quality, optimize=True)
                mime_type = "image/jpeg"
            elif request.output_format == "webp":
                image.save(buffered, format="WEBP", quality=90)
                mime_type = "image/webp"
            else:
                image.save(buffered, format="PNG")
                mime_type = "image/png"

            img_base64 = base64.b64encode(buffered.getvalue()).decode()

            derived_text = _derive_scene_text(scene_desc)
            scene_data = {
                "scene_number": i + 1,
                "description": scene_desc,
                "title": derived_text["title"],
                "caption": derived_text["caption"],
                "base64": img_base64,
                "mime_type": mime_type,
                "seed": current_seed,
                "path": str(filepath) if filepath else "Not saved",
                "generation_time": round(scene_time, 2),
                "width": request.width,
                "height": request.height,
            }

            storyboard_data["scenes"].append(scene_data)
            generated_storyboards.append(scene_data)

            # Aggressive memory cleanup between scenes for low VRAM
            del image, result, generator, buffered
            aggressive_memory_cleanup()
            add_log(f"Scene {i+1}/{num_scenes} complete ({scene_time:.1f}s)", verbose=True)

        total_time = time.time() - start_time
        avg_time = sum(generation_times) / len(generation_times) if generation_times else 0

        storyboard_data["generation_time"] = round(total_time, 2)
        storyboard_data["average_scene_time"] = round(avg_time, 2)

        # Create composite storyboard image
        try:
            # Reconstruct images from base64 for composite creation
            composite_images = []
            for scene in storyboard_data["scenes"]:
                img_data = base64.b64decode(scene["base64"])
                img = PILImage.open(BytesIO(img_data))
                composite_images.append(img)
            
            # Create and save composite
            composite = _create_composite_storyboard(
                composite_images,
                storyboard_data["scenes"],
                request.width,
                request.height
            )
            
            if composite:
                composite_path = storyboard_dir / "storyboard_composite.png"
                composite.save(composite_path, format="PNG")
                storyboard_data["composite_path"] = str(composite_path)
                # Encode composite for UI
                composite_buffer = BytesIO()
                composite.save(composite_buffer, format="PNG")
                composite_base64 = base64.b64encode(composite_buffer.getvalue()).decode()
                storyboard_data["composite"] = {
                    "base64": composite_base64,
                    "mime_type": "image/png",
                    "path": str(composite_path),
                }
                latest_composite = storyboard_data["composite"]
                add_log(f"Composite storyboard saved to {composite_path}")
        except Exception as e:
            add_log(f"Warning: Could not create composite storyboard: {e}")
            storyboard_data["composite_path"] = "Failed to create"
            latest_composite = None

        # Save metadata
        if request.save_metadata:
            metadata_path = storyboard_dir / "metadata.json"
            with open(metadata_path, 'w') as f:
                json.dump(storyboard_data, f, indent=2)
            add_log(f"Metadata saved to {metadata_path}")

        generation_progress = 1.0
        generation_status = f"Complete! Generated {len(request.scenes)} scenes"
        add_log(f"Storyboard complete: {len(request.scenes)} scenes in {total_time:.1f}s (avg: {avg_time:.1f}s/scene)")

        # Clear CUDA cache
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        return {
            "success": True,
            "storyboard_id": storyboard_id,
            "scenes": storyboard_data["scenes"],
            "composite": storyboard_data.get("composite"),
            "output_path": str(storyboard_dir),
            "total_time": round(total_time, 2),
            "average_time": round(avg_time, 2)
        }

    except Exception as e:
        last_error = str(e)
        generation_status = f"Error: {str(e)}"
        add_log(f"Generation error: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}
    finally:
        generating = False


@app.post("/generate-storyboard")
async def generate_storyboard(request: StoryboardRequest):
    global pipeline, model_ready, generated_storyboards, generating
    global generation_progress, current_scene_num, total_scenes
    global generation_status, stop_generation_flag, last_error

    if not model_ready or pipeline is None:
        return {"success": False, "error": "Model not loaded"}

    if not request.product_name.strip():
        return {"success": False, "error": "Please enter a product name"}

    if not request.scenes or len(request.scenes) == 0:
        return {"success": False, "error": "Please provide at least one scene description"}

    if generating:
        return {"success": False, "error": "Already generating"}

    if not selected_guardrail_model_id:
        return {"success": False, "error": "No LLM selected"}

    # Guardrail checks before generation
    guardrail_inputs = [
        ("product_name", request.product_name),
        ("product_description", request.product_description),
    ]
    guardrail_inputs.extend((f"scene_{i+1}", scene) for i, scene in enumerate(request.scenes))

    for _, text in guardrail_inputs:
        if not str(text).strip():
            continue
        result = await _run_guardrail_check(str(text))
        if not result.get("allowed", False):
            return {"success": False, "error": result.get("reason", "LLM unavailable")}

    generating = True
    generation_progress = 0.0
    generated_storyboards = []
    latest_composite = None
    stop_generation_flag = False
    last_error = None
    total_scenes = len(request.scenes)
    current_scene_num = 0
    generation_status = "Starting..."

    add_log(f"Starting storyboard generation for: {request.product_name}")
    add_log(f"Scenes: {len(request.scenes)}")

    # Run the blocking generation in a thread pool to not block the event loop
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(executor, _run_generation_sync, request)
    return result


@app.post("/generate-scene")
async def generate_scene(request: SceneRequest):
    """Generate a single scene for quick preview."""
    global pipeline, model_ready

    if not model_ready or pipeline is None:
        return {"success": False, "error": "Model not loaded"}

    if not request.description.strip():
        return {"success": False, "error": "Please provide a scene description"}

    try:
        enhanced_prompt = _enhance_prompt_for_scene(
            request.description,
            "product",
            request.product_context,
            request.style
        )

        if request.seed < 0:
            seed = random.randint(0, 2**32 - 1)
        else:
            seed = request.seed

        generator = torch.Generator(device=pipeline.device)
        generator.manual_seed(seed)

        # Apply scheduler if specified
        if request.scheduler in _get_scheduler_map():
            scheduler_class = _get_scheduler_map()[request.scheduler]
            pipeline.scheduler = scheduler_class.from_config(pipeline.scheduler.config)

        with torch.no_grad():
            result = pipeline(
                prompt=enhanced_prompt,
                negative_prompt=request.negative_prompt,
                num_inference_steps=request.steps,
                guidance_scale=request.cfg_scale,
                generator=generator,
                height=request.height,
                width=request.width
            )

        image = result.images[0]

        # Convert to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        derived_text = _derive_scene_text(request.description)

        return {
            "success": True,
            "title": derived_text["title"],
            "caption": derived_text["caption"],
            "base64": img_base64,
            "mime_type": "image/png",
            "seed": seed,
            "width": request.width,
            "height": request.height,
        }

    except Exception as e:
        add_log(f"Scene generation error: {e}")
        return {"success": False, "error": str(e)}


@app.get("/generation-status")
async def get_generation_status():
    """Get current generation status."""
    return {
        "generating": generating,
        "progress": generation_progress,
        "current_scene": current_scene_num,
        "total_scenes": total_scenes,
        "status": generation_status,
        "scenes": generated_storyboards,
        "composite": latest_composite
    }


@app.get("/generation-log")
async def get_generation_log():
    """Get generation log."""
    return {"log": generation_log}


@app.post("/stop-generation")
async def stop_generation():
    """Request to stop the current generation."""
    global stop_generation_flag
    stop_generation_flag = True
    add_log("Stop requested")
    return {"success": True, "message": "Stop requested"}


@app.post("/clear-cache")
async def clear_cache():
    """Clear GPU cache."""
    try:
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        add_log("Cache cleared")
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/open-folder")
async def open_folder():
    """Open output folder."""
    try:
        import platform
        import subprocess

        output_dir = get_generated_storyboards_path()
        output_dir.mkdir(parents=True, exist_ok=True)

        system = platform.system()
        if system == "Windows":
            os.startfile(str(output_dir))
        elif system == "Darwin":
            subprocess.run(["open", str(output_dir)])
        else:
            subprocess.run(["xdg-open", str(output_dir)])

        return {"success": True, "message": "Opened output folder"}
    except Exception as e:
        return {"success": False, "error": str(e)}


class DepsCheckRequest(BaseModel):
    packages: List[str]


@app.get("/env/packages")
async def env_packages():
    """Get installed packages using pip list."""
    try:
        import subprocess
        result = subprocess.run(
            [sys.executable, "-m", "pip", "list", "--format=json"],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode == 0:
            packages = json.loads(result.stdout)
            return {"success": True, "packages": packages}
        else:
            return {"success": False, "error": result.stderr}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/env/check-deps")
async def env_check_deps(req: DepsCheckRequest):
    """Check whether packages are installed."""
    try:
        import subprocess
        result = subprocess.run(
            [sys.executable, "-m", "pip", "list", "--format=json"],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode == 0:
            installed_packages = json.loads(result.stdout)
            installed_names = {pkg["name"].lower() for pkg in installed_packages}
            
            status = {}
            for pkg in req.packages:
                pkg_lower = pkg.lower()
                is_installed = pkg_lower in installed_names
                version = None
                if is_installed:
                    for p in installed_packages:
                        if p["name"].lower() == pkg_lower:
                            version = p["version"]
                            break
                status[pkg] = {"installed": is_installed, "version": version}
            
            return {"success": True, "status": status}
        else:
            return {"success": False, "error": result.stderr}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/env/install-packages")
async def env_install_packages(req: DepsCheckRequest):
    """Install packages in this environment."""
    try:
        import subprocess
        if not req.packages:
            return {"success": True, "message": "No packages to install"}
        
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install"] + req.packages,
            capture_output=True,
            text=True,
            timeout=600,
        )
        
        if result.returncode == 0:
            add_log(f"Successfully installed: {', '.join(req.packages)}")
            return {"success": True, "message": f"Installed {len(req.packages)} packages"}
        else:
            return {"success": False, "error": result.stderr}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/shutdown")
async def shutdown():
    """Gracefully shutdown the server."""
    print("Shutdown requested...")
    import asyncio
    asyncio.get_event_loop().call_later(0.5, lambda: os._exit(0))
    return {"success": True, "message": "Server shutting down"}


if __name__ == "__main__":
    import sys
    import logging

    # Reduce uvicorn logging noise
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8767

    # Check for --network flag to allow network access
    allow_network = "--network" in sys.argv
    host = "0.0.0.0" if allow_network else "127.0.0.1"

    print(f"Starting Storyboard Creator server on {host}:{port}...")
    uvicorn.run(app, host=host, port=port, log_level="warning")
