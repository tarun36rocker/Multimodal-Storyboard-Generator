# Storyboard Creator Workflow

A professional storyboard generation tool designed for product presentations. Create sequential visual narratives based on your product ideas using AI-powered image generation with SDXL.

## Features

- **Product-Focused Generation**: Generate scenes specifically tailored to your product with automatic context enhancement
- **Multi-Scene Storyboards**: Create multiple scenes in sequence with consistent styling
- **Style Presets**: Choose from predefined presentation styles or create custom ones
- **Real-time Preview**: View scenes as they're generated with progress tracking
- **Metadata Tracking**: Automatic metadata saving with generation timestamps and parameters
- **GPU Acceleration**: Full CUDA support with memory optimization
- **VRAM Management**: CPU offloading and FP16 precision for efficient memory usage

## Architecture

### Server (`storyboard_server.py`)

- FastAPI-based REST server running on port 8767 (default)
- SDXL image generation using Hugging Face diffusers
- Supports multiple models (SDXL Base 1.0, RealVisXL V5.0)
- Asynchronous scene generation with progress tracking
- Automatic scene enhancement with product context
- Output organization with metadata.json for each storyboard

### UI (`StoryboardCreatorWindow.tsx`)

- React/TypeScript component
- Real-time server status monitoring
- Interactive scene editor
- Live generation progress with VRAM statistics
- Thumbnail preview grid
- Integrated logging system

## Python Dependencies (venv pattern)

The workflow follows the Python virtual environment dependency pattern. Required packages:

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `diffusers` - Image generation pipeline
- `transformers` - Model loading
- `torch` - Deep learning framework
- `safetensors` - Safe tensor loading
- `accelerate` - Model optimization
- `requests` - HTTP client for model downloads
- `pillow` - Image processing
- `pydantic` - Data validation

### Installation

When running the workflow, you'll need to create/activate a Python virtual environment with these dependencies:

```bash
python -m venv storyboard_venv
source storyboard_venv/bin/activate  # On Windows: storyboard_venv\Scripts\activate
pip install fastapi uvicorn diffusers transformers torch safetensors accelerate requests pillow pydantic
```

## API Endpoints

### Server Control

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /status` - Current server and model status
- `GET /models` - Available model list

### Model Management

- `POST /load-model` - Load image generation model
- `POST /unload_model` - Unload current model
- `POST /clear-cache` - Clear GPU cache

### Storyboard Generation

- `POST /generate-storyboard` - Generate complete storyboard
- `POST /generate-scene` - Generate single scene for preview
- `GET /generation-status` - Current generation progress
- `GET /generation-log` - Generation history log
- `POST /stop-generation` - Stop active generation

### Utilities

- `POST /open-folder` - Open output folder
- `POST /shutdown` - Gracefully shutdown server

## Configuration

### Image Generation Parameters

- **Steps**: 10-50 (default: 25) - More steps = higher quality but slower
- **CFG Scale**: 1-20 (default: 7.0) - Prompt adherence strength
- **Width/Height**: 512-1024 (default: 1024x1024) - Output resolution
- **Seed**: -1 for random, or specific seed for reproducibility
- **Output Format**: PNG, JPG, or WebP

### Style Presets

- **Product Launch**: Professional product marketing
- **Feature Showcase**: Feature highlight, detailed product display
- **Corporate**: Professional business presentation
- **Tech Product**: Modern technology, futuristic, sleek design
- **Lifestyle**: Premium quality, aspirational tone

## Output Structure

Generated storyboards are organized as follows:

```
generated_storyboards/
├── 20240115_143022/          # Storyboard ID (timestamp)
│   ├── scene_001_s12345.png
│   ├── scene_002_s12346.png
│   ├── scene_003_s12347.png
│   └── metadata.json
```

### Metadata Format (metadata.json)

```json
{
  "product_name": "CloudSync Pro",
  "product_description": "Enterprise cloud synchronization platform",
  "storyboard_id": "20240115_143022",
  "created_at": "2024-01-15T14:30:22.123456",
  "generation_time": 125.4,
  "average_scene_time": 41.8,
  "scenes": [
    {
      "scene_number": 1,
      "description": "Product interface on desktop",
      "path": "/path/to/scene_001_s12345.png",
      "seed": 12345,
      "generation_time": 42.1
    }
  ]
}
```

## Performance Tips

1. **GPU Memory Optimization**
   - Enable CPU Offload for GPUs with < 12GB VRAM
   - Use FP16 precision to reduce memory usage
   - Reduce resolution if VRAM is limited

2. **Generation Speed**
   - Lower step count for faster generation (20-25 is usually sufficient)
   - Reuse seeds for consistency within a storyboard
   - Pre-load model before batch generation

3. **Quality vs Speed**
   - 25-30 steps: Good balance for presentations
   - 35-40 steps: High quality output
   - 50+ steps: Maximum quality (slower)

## Troubleshooting

### Model Won't Load

- Ensure sufficient disk space for model download (~10GB)
- Check internet connection for Hugging Face model download
- Verify CUDA/GPU compatibility

### Out of Memory Errors

- Enable CPU Offload
- Enable FP16 precision
- Reduce image resolution
- Reduce CFG scale

### Generation Stops

- Check available disk space for output
- Verify GPU temperature (overheating protection)
- Try smaller batch size

## Development Notes

The workflow is built following ContextUI patterns:

- Uses IPC communication for server management
- Integrates with venv selector
- Provides real-time status updates
- Follows same structure as SDXLGenerator for consistency

## License

Same as ContextUI project

## Related Workflows

- **SDXLGenerator**: Direct image generation without product focus
- **ImageToText**: Convert images to text descriptions
- **LocalChat**: LLM-based scene suggestion generation
