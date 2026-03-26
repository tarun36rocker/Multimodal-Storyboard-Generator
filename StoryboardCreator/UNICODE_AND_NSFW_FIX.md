# Unicode & NSFW Detection Fix

## Problem

You encountered two issues:

1. **Unicode Encoding Error** on Windows console:

   ```
   UnicodeEncodeError: 'charmap' codec can't encode characters in position 11-12
   ```

   This was caused by emoji characters (⚠️, 📸, ✅) in Python logging output. Windows console uses `cp1252` encoding which cannot handle emoji.

2. **Black Images (NSFW Detection)**:
   ```
   Potential NSFW content was detected in one or more images. A black image will be returned instead.
   ```
   The diffusers library has an aggressive NSFW safety checker that was flagging product images as "unsafe" and replacing them with black placeholders.

## Solution

### 1. Removed Emoji from Logging

**Changed:**

- ⚠️ → [WARNING]
- 📸 → [INFO]
- ✅ → [OK]

This fix is in:

- Model descriptions in `/models` endpoint
- Black image detection warning messages
- All Python logging output

### 2. Disabled NSFW Safety Checker

Added code to disable the overly-aggressive NSFW safety checker:

```python
# Disable NSFW safety checker (too aggressive for product marketing)
try:
    pipeline.safety_checker = None
    add_log("NSFW safety checker disabled")
except Exception:
    pass  # Not all models have this
```

This is executed when loading the model, so it won't interfere with legitimate product generation.

## Why This Works

- **Emoji Fix**: Python can now safely print log messages to Windows console without encoding errors
- **NSFW Fix**: The safety checker was detecting normal product imagery and replacing it with black images. Product marketing images are not "unsafe content" - they're professional photos

## What to Try Now

1. **Restart the server** (it will pick up the changes)
2. **Load SD v1.5 model** again
3. **Generate with your settings**: cfg=5.0, steps=20
4. **Check the logs** - you should see:
   - `NSFW safety checker disabled` (model loading)
   - No more Unicode encoding errors
   - Actual generated images instead of black images

## If You Still Get Issues

If you still get black images after this fix:

1. **Lower CFG** to 3.0-4.0 (memory issue, not NSFW)
2. **Lower steps** to 12-15
3. **Use 512x512** resolution
4. **Check VRAM** is not running out

The NSFW checker was your main blocker - it should be resolved now.

---

## Files Modified

- `storyboard_server.py`:
  - Removed emoji from `/models` endpoint
  - Removed emoji from black image warnings
  - Added NSFW safety checker disable on model load

## Testing Checklist

- [ ] Server restarts without errors
- [ ] Load SD v1.5 model - should see "NSFW safety checker disabled"
- [ ] Generate a scene - should see actual image, not black
- [ ] Check logs for no Unicode errors
- [ ] Try SDXL with cfg=5.0, steps=15

Good luck! Your black image issue should be resolved now. 🎉
