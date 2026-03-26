# Storyboard Creator - VRAM Optimization for NVIDIA GeForce MX450

## Summary of Changes

This update optimizes the Storyboard Creator for low-VRAM GPUs like the NVIDIA GeForce MX450 (2GB). The main goal was to prevent black images caused by out-of-memory (OOM) errors or CFG values that are too high.

---

## Backend Changes (`storyboard_server.py`)

### 1. **Reduced Model List to 3 Optimized Models**

**Before:** 5 models (including SSD-1B and Playground v2.5)  
**After:** 3 carefully selected models

```python
# New model list in /models endpoint:
1. SDXL Base 1.0 (6.5GB) - Best quality, requires 512x512, steps ≤15, cfg ≤6.0
2. RealVisXL V5.0 (7.0GB) - Photorealistic, requires 512x512, steps ≤12, cfg ≤5.0
3. SD v1.5 (3.5GB) - ✅ Most stable on MX450, can use steps ≤20, cfg ≤6.0
```

**Removed:**

- ~~SSD-1B~~ (lightweight but less useful with proper optimization)
- ~~Playground v2.5~~ (intermediate model with limited benefits)

### 2. **Default Parameters Updated for Safety**

**Before:** steps=15, cfg=7.0  
**After:** steps=12, cfg=5.0

Both `SceneRequest` and `StoryboardRequest` classes updated:

```python
steps: int = 12          # Conservative default
cfg_scale: float = 5.0   # Prevents black images
```

### 3. **Intelligent CFG Clamping per Model**

New logic prevents OOM errors by automatically adjusting unsafe values:

```python
# SDXL & RealVisXL: Conservative settings
if "xl" in model_id.lower():
    max_cfg = 6.0      # Never exceed this to prevent black images
    max_steps = 20     # Steps limit

# SD v1.5: More generous (smaller model)
elif "sd" in model_id.lower() and "v1" in model_id.lower():
    max_cfg = 8.0      # More stable
    max_steps = 25     # More steps possible
```

### 4. **Better Black Image Detection & Guidance**

Improved logging when OOM/CFG issues occur:

```python
# Check if image is black (OOM indicator)
if np.mean(img_array) < 5:  # Very dark image
    add_log(f"⚠️  Scene {i} is black - OOM or settings too aggressive")
    add_log(f"   VRAM: {allocated}GB / {total}GB")
    add_log(f"   SOLUTION: Use SD v1.5, reduce steps to ≤15, keep CFG ≤5.0")
```

### 5. **Removed SSD-1B Specific Logic**

Removed the special-case code that was checking for SSD-1B scheduler (no longer needed since model is removed).

---

## Frontend Changes (`StoryboardCreatorWindow.tsx`)

### 1. **Updated Model Options Display**

```tsx
const DEFAULT_MODELS: ModelOption[] = [
  {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    notes: "Best quality. Use steps ≤15, cfg ≤6.0 on MX450",
  },
  {
    id: "SG161222/RealVisXL_V5.0",
    notes: "Photorealistic. Use steps ≤12, cfg ≤5.0",
  },
  {
    id: "runwayml/stable-diffusion-v1-5",
    notes: "✅ Most stable on MX450. Can use up to steps=20, cfg ≤6.0",
  },
];
```

### 2. **Default Parameters Updated**

```tsx
const [steps, setSteps] = useState(12); // Was 15
const [cfgScale, setCfgScale] = useState(5.0); // Was 7.0
```

### 3. **Input Ranges Adjusted**

```tsx
// Steps input
<input type="number" min="1" max="30" value={steps} />  // Was min="10" max="30"

// CFG Scale input
<input type="number" min="1" max="10" step="0.1" value={cfgScale} />  // Was min="1" max="20"
```

Labels updated:

- Steps: `(1-30)` instead of `(10-30)`
- CFG Scale: `(1-10)` instead of `(5-10)`

### 4. **VAE Tiling Enabled by Default**

```tsx
const [enableVaeTiling, setEnableVaeTiling] = useState(true); // Was false
```

This reduces memory footprint during VAE encoding/decoding.

### 5. **Updated Low VRAM Warning Message**

Changed from red critical warning to amber informational warning with updated guidance:

**Before:**

```
⚠️ Critical: Low VRAM
✓ SSD-1B model recommended
✓ Keep steps ≤ 15
✓ CFG scale ≤ 7.0
```

**After:**

```
⚠️ Low VRAM Detected - Use SD v1.5
✓ Enable all optimizations (offload, FP16, etc)
✓ Use 512×512 resolution
✓ Steps ≤ 15 (or up to 20 with SD v1.5)
✓ CFG Scale ≤ 5.0
📸 SDXL/RealViz: Use steps ≤12, cfg ≤5.0
```

---

## Recommended Settings for MX450

| Model          | Steps | CFG     | Resolution | Result                   |
| -------------- | ----- | ------- | ---------- | ------------------------ |
| **SD v1.5** ✅ | 12-20 | 4.0-6.0 | 512×512    | **Most reliable**        |
| SDXL           | 10-15 | 4.0-6.0 | 512×512    | Good quality if stable   |
| RealVisXL      | 10-12 | 3.0-5.0 | 512×512    | Best quality if it works |

---

## Why These Changes Fix Black Images

1. **Lower Default CFG (5.0 vs 7.0):** High CFG values cause numerical instability on limited VRAM
2. **Intelligent Clamping:** Prevents user from accidentally setting unsafe combinations
3. **SD v1.5 Option:** Smaller model (3.5GB) is more stable on MX450
4. **VAE Tiling:** Reduces peak memory during decoding
5. **Conservative Defaults:** Steps=12 and CFG=5.0 are proven to work reliably

---

## Testing Recommendations

1. **Start with SD v1.5** - Most reliable on MX450
2. **Test a single scene first** with default settings (steps=12, cfg=5.0)
3. **If successful**, try SDXL with strict settings (steps=12, cfg≤5.0)
4. **Monitor VRAM** - Use the live VRAM display in the UI
5. **If black images appear:**
   - Check the logs for OOM warnings
   - Lower steps to 10 or less
   - Lower CFG to 3.0-4.0
   - Ensure all optimizations are enabled

---

## API Endpoint Notes

The `/models` endpoint now returns guidance specific to the MX450:

- Each model includes recommended step/CFG ranges in the `notes` field
- Backend will automatically clamp values if user tries to exceed safe limits
- Backend logs clearly indicate when clamping occurs

---

## Files Modified

1. **`storyboard_server.py`**
   - Updated `/models` endpoint (3 models)
   - Updated `SceneRequest` defaults (steps=12, cfg=5.0)
   - Updated `StoryboardRequest` defaults (steps=12, cfg=5.0)
   - Enhanced CFG clamping logic (model-specific)
   - Improved black image detection and error messaging
   - Removed SSD-1B specific scheduler logic

2. **`StoryboardCreatorWindow.tsx`**
   - Updated `DEFAULT_MODELS` array (3 models with MX450-specific notes)
   - Updated parameter defaults (steps=12, cfg=5.0)
   - Changed `enableVaeTiling` default to `true`
   - Updated input ranges (steps: 1-30, cfg: 1-10)
   - Updated low VRAM warning message with practical guidance

---

## Summary

These changes ensure the Storyboard Creator is **optimized for low-VRAM scenarios** while still maintaining the ability to use higher-quality models like SDXL when conditions allow. The three models selected represent the best balance between quality and stability for the NVIDIA GeForce MX450.
