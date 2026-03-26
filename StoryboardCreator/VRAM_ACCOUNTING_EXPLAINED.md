# VRAM Accounting Explained

## The Apparent Mismatch

**What you're seeing:**

- UI shows: `~1.5GB allocated out of 2GB GPU VRAM`
- Task Manager shows: `~7.8GB shared GPU memory available`

**This is NOT a bug - it's how CPU offload works!**

---

## How CPU Offload Works

When you enable CPU offload (which is ON by default):

```
Model Weights Distribution:
├─ GPU VRAM (active only when needed)
│  └─ Currently in use: ~1.5GB (what CUDA reports)
└─ System RAM (always available)
   └─ Model weights on standby: ~4-5GB
```

During generation, the pipeline:

1. Loads a component to GPU (~200MB)
2. Runs it
3. Moves it back to CPU RAM
4. Repeats for next component

Result:

- **CUDA stats** show only what's currently on GPU (~1.5GB)
- **System RAM** holds the rest of the model (~4-5GB)
- **Total available for GPU** = both = ~7.8GB when including shared

---

## Why This Matters for You

| Metric             | Value                 | Meaning                          |
| ------------------ | --------------------- | -------------------------------- |
| GPU VRAM (CUDA)    | ~1.5-2GB              | Only what's on device now        |
| Shared System RAM  | ~7.8GB                | What GPU can borrow as needed    |
| Total compute pool | ~7-8GB                | Actual memory for generation     |
| Your GPU           | MX450 (2GB dedicated) | Tiny, so CPU offload is critical |

**Translation:** You effectively have 7-8GB of memory for generation, split across GPU and CPU. The UI showing 1.5GB is not the bottleneck - it's actually a good sign that offloading is working!

---

## Why Black Images Happened Before (Not a VRAM Issue)

The black images were NOT caused by hitting VRAM limits. They came from:

1. **NSFW Safety Checker** (flagging product images) ← FIXED
2. **fp16 VAE Decode NaN** (numerical instability) ← FIXED
3. **Hard-coded scheduler** (inefficient scheduling) ← FIXED

All three are now resolved. Generation should be stable now.

---

## What Could Still Cause Black Images

Even with fixes, these could cause black images:

| Cause                      | Fix                        |
| -------------------------- | -------------------------- |
| CFG too high (>8)          | Lower to 5-6               |
| Steps too low (<5)         | Increase to 10+            |
| Resolution too high (>768) | Use 512x512                |
| SDXL/RealViz on MX450      | Use SD v1.5 instead        |
| Terrible prompt            | Use descriptive scene text |

Most likely: **CFG is too high**. Recommended for MX450:

- SD v1.5: CFG 5.0-6.0
- SDXL: CFG 4.0-5.0 (if you try it)

---

## The VRAM Readout

Your UI calls `/status` which reports:

```python
"total": torch.cuda.get_device_properties(0).total_memory  # Physical GPU VRAM
"allocated": torch.cuda.memory_allocated()  # Currently on GPU
"free": total - used  # Available GPU VRAM right now
```

This is **correct but limited in view** - it doesn't show system RAM that's available to GPU. That's why you see what looks like low VRAM when Task Manager shows plenty.

**This is not a bug, it's just two different accounting systems.**

---

## Bottom Line

✅ **Your setup is fine**

- CPU offload enabled = good practice for MX450
- 1.5GB GPU + 7.8GB shared = ~7-8GB total compute
- Low GPU VRAM reading = expected with offload, NOT a problem

✅ **Fixes applied:**

- VAE float32 → eliminates decode NaN
- Scheduler fix → proper scheduling
- NSFW disabled → no false flagging

✅ **Next steps:**

- Restart server
- Test SD v1.5 with CFG 5-6, steps 12
- You should get clear, stable images!

Good luck! 🚀
