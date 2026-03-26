# NVIDIA GeForce MX450 Quick Start Guide

## You now have 3 optimized models to choose from:

### 1. **SD v1.5** ✅ RECOMMENDED FOR YOUR GPU

- **VRAM:** 3.5GB (most efficient)
- **Quality:** Good, fast
- **Settings:** steps 12-20, cfg 4.0-6.0
- **Best for:** Quick generation, reliable results
- **✅ Will work reliably on MX450**

### 2. **SDXL Base 1.0**

- **VRAM:** 6.5GB (tight fit on MX450)
- **Quality:** Excellent
- **Settings:** steps 10-15, cfg 4.0-6.0 (keep LOW!)
- **⚠️ May cause OOM - use with care**

### 3. **RealVisXL V5.0**

- **VRAM:** 7.0GB (very tight fit)
- **Quality:** Photorealistic
- **Settings:** steps 10-12, cfg 3.0-5.0 (keep VERY LOW!)
- **⚠️ Experimental on MX450 - test carefully**

---

## Getting Good Results on MX450

### Step 1: Start Simple

1. Select **SD v1.5** model
2. Keep default settings (steps=12, cfg=5.0)
3. Use 512×512 resolution
4. Click "Load Model" then generate a test scene

### Step 2: If It Works

- You can try increasing steps to 15-20 (still safe)
- You can try SDXL if you want higher quality
- Keep cfg ≤ 6.0 always

### Step 3: If You Get Black Images

- **Immediately reduce cfg to 3.0-4.0**
- Reduce steps to 10 or less
- Use SD v1.5 instead of SDXL
- Make sure all optimizations are enabled
- Check VRAM in UI (should see ~2GB free)

---

## Settings By Scenario

### "I want fast results"

```
Model: SD v1.5
Steps: 12
CFG: 5.0
Resolution: 512×512
Time: ~30-45 seconds per image
```

### "I want the best quality"

```
Model: SDXL
Steps: 12
CFG: 5.0
Resolution: 512×512
Time: ~2-3 minutes per image
(May fail - have backup settings ready)
```

### "I keep getting black images"

```
Model: SD v1.5
Steps: 10
CFG: 3.0
Resolution: 512×512
All optimizations: ENABLED
(This setup is bulletproof)
```

---

## What Each Optimization Does

- **CPU Offload:** Moves model to CPU when not needed (saves ~1GB VRAM)
- **FP16:** Uses half-precision floats (saves ~50% VRAM)
- **Attention Slicing:** Processes attention in chunks (saves ~1GB VRAM)
- **VAE Tiling:** Processes VAE in tiles (saves ~500MB VRAM)

**Total Savings:** ~2.5GB VRAM! **All enabled by default.**

---

## Why You're Getting Black Images

The problem: When CFG is too high with limited VRAM, the model's attention calculations overflow and produce garbage (black images).

**Solutions (in order):**

1. ✅ Lower CFG to 3-5 (most common fix)
2. ✅ Lower steps to 10-12
3. ✅ Switch to SD v1.5 (uses less memory)
4. ✅ Check optimizations are ON
5. ❌ Don't use SDXL/RealViz yet (save for desktop)

---

## System Info

- **Your GPU:** NVIDIA GeForce MX450
- **VRAM:** 2GB (tight!)
- **Recommended Model:** SD v1.5
- **Recommended Resolution:** 512×512 (always)

---

## Next Steps

1. Load **SD v1.5** model
2. Generate a single test scene (use button in UI)
3. Check if output looks correct
4. If it works: Generate your full storyboard
5. If it's black: Lower CFG to 3.0 and try again

**Good luck! 🎨**
