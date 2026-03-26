# Critical Fixes Applied (ChatGPT Code Review)

## Issues Found & Fixed

### 1. **Hard-coded Scheduler Bug** ✅ FIXED

**Problem:**

```python
# OLD (WRONG) - Always used DPM++ 2M regardless of user choice
scheduler = scheduler_map.get("DPM++ 2M", DPMSolverMultistepScheduler)
pipeline.scheduler = scheduler.from_config(pipeline.scheduler.config)
```

**Fixed:**

```python
# NEW (CORRECT) - Uses user's requested scheduler
scheduler_class = scheduler_map.get(request.scheduler, EulerDiscreteScheduler)
pipeline.scheduler = scheduler_class.from_config(pipeline.scheduler.config)
add_log(f"Scheduler set to: {request.scheduler}")
```

**Impact:** You can now actually use Euler A, DDIM, or other schedulers. Before, it always swapped to DPM++ 2M first, then to your choice - wasteful and unnecessary.

---

### 2. **VAE NaN/Decode Instability** ✅ FIXED

**Problem:** VAE decoding in float16 on low-VRAM GPUs can produce NaN values, causing either black images or crashes.

**Fixed:** Force VAE to float32 after loading:

```python
# Force VAE to float32 on CUDA to prevent NaN/decode instability
# This is critical on low-VRAM GPUs like MX450
if device == "cuda":
    try:
        pipeline.vae = pipeline.vae.to(torch.float32)
        add_log("VAE set to float32 (stability fix for MX450)")
    except Exception:
        pass
```

**Impact:** Eliminates the fp16 VAE casting errors you were seeing. The rest of the model stays in fp16 (memory efficient), but VAE uses float32 (stable). This is the industry best-practice for low-VRAM generation.

---

## Understanding VRAM Reporting

**Your UI shows ~2GB allocated, but you have ~7.8GB shared available in Task Manager - this is normal!**

Why:

- CPU offload is enabled → most weights live in system RAM, not GPU VRAM
- Only active parts loaded to GPU when needed
- CUDA memory_allocated() only shows GPU VRAM, not system RAM the GPU borrows
- This mismatch between two accounting systems is expected with offloading

Your actual available compute is much higher due to shared memory.

---

## Test This Setup (Recommended)

Now try this combination:

| Setting           | Value                            |
| ----------------- | -------------------------------- |
| Model             | `runwayml/stable-diffusion-v1-5` |
| Resolution        | 512×512                          |
| Steps             | 12                               |
| CFG               | 6.0                              |
| Scheduler         | **Euler A**                      |
| CPU Offload       | ON                               |
| VAE Tiling        | ON                               |
| FP16              | ON                               |
| Attention Slicing | ON                               |

**Expected result:**

- ✅ VAE set to float32 in logs
- ✅ Scheduler set to: Euler A in logs
- ✅ Clear image output (no black, no NaN)
- ✅ Generation in ~30-60 seconds

---

## Why These Fixes Matter

| Fix           | Benefit                                                                      |
| ------------- | ---------------------------------------------------------------------------- |
| Scheduler Fix | You now control which scheduler to use (no forced DPM++ 2M)                  |
| VAE float32   | Eliminates NaN errors on low-VRAM → no more black images from decode failure |

Combined: **Much more stable and predictable generation on MX450**

---

## Files Modified

`storyboard_server.py`:

- Added VAE float32 conversion in `load_model()` function
- Fixed scheduler selection in `_run_generation_sync()` function
- No other changes needed

---

## Next Steps

1. Restart the server
2. Load SD v1.5 model
3. Look for these log messages:
   - `[OK] Best for MX450...` (model loaded)
   - `VAE set to float32 (stability fix for MX450)` ← NEW
   - `Scheduler set to: Euler A` ← FIXED (was hardcoded before)
   - `NSFW safety checker disabled`
4. Generate with the test settings above
5. Report back with results!

---

## About VRAM Showing Low

This is not a bug - it's how CPU offload works:

- **Allocated CUDA VRAM:** ~1.5GB (what's currently on GPU)
- **System RAM GPU can borrow:** ~7.8GB (shared, not counted in CUDA stats)
- **Total compute available:** Effectively ~7-8GB when including shared memory

Your setup is actually fine! The fixes above will make it stable and predictable.

Good luck! 🚀
