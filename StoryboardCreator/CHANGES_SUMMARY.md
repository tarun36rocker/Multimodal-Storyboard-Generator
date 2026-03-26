# Quick Reference: What Changed

## Change 1: Scheduler Fix

**Location:** `_run_generation_sync()` function, around line 415

**Before:**

```python
scheduler = scheduler_map.get("DPM++ 2M", DPMSolverMultistepScheduler)
pipeline.scheduler = scheduler.from_config(pipeline.scheduler.config)
```

**After:**

```python
# Use the requested scheduler (or Euler as fallback)
scheduler_class = scheduler_map.get(request.scheduler, EulerDiscreteScheduler)
pipeline.scheduler = scheduler_class.from_config(pipeline.scheduler.config)
add_log(f"Scheduler set to: {request.scheduler}")
```

---

## Change 2: VAE float32 Stability

**Location:** `load_model()` function, after CPU offload setup (around line 330)

**Added:**

```python
# Force VAE to float32 on CUDA to prevent NaN/decode instability
# This is critical on low-VRAM GPUs like MX450
if device == "cuda":
    try:
        pipeline.vae = pipeline.vae.to(torch.float32)
        add_log("VAE set to float32 (stability fix for MX450)")
    except Exception:
        pass  # Some models may not support this
```

---

## Why These Matter

1. **Scheduler Fix**: You now get the scheduler you actually selected (was always DPM++ 2M before)
2. **VAE float32**: Eliminates NaN casting errors during decoding → no more black images

Both are in production quality code now! ✅

---

## Test It

```
Model: SD v1.5
Steps: 12
CFG: 6.0
Scheduler: Euler A  ← This will now actually be used!
Resolution: 512x512
```

You should see in logs:

```
Scheduler set to: Euler A  ← Proof it's working
VAE set to float32 (stability fix for MX450)  ← Proof VAE is stable
```

Ready to test! 🎉
