# Storyboard Creator - Quick Start Guide

## 1. Setup Python Environment

### Option A: Using pip

```bash
# Create virtual environment
python -m venv storyboard_venv

# Activate it
# On Windows:
storyboard_venv\Scripts\activate
# On macOS/Linux:
source storyboard_venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Option B: Using conda

```bash
conda create -n storyboard python=3.10
conda activate storyboard
pip install -r requirements.txt
```

## 2. Start the Workflow

1. Open ContextUI
2. Navigate to **StoryboardCreator** workflow
3. Click **Start Server** button
4. Wait for "Model Ready" status
5. Click **Load Model** to download and initialize SDXL

## 3. Generate Your First Storyboard

1. **Fill in Product Details**
   - Product Name: e.g., "CloudSync Pro"
   - Product Description: e.g., "Enterprise cloud storage solution"

2. **Add Scenes**
   - Click "Add Scene" for each scene in your storyboard
   - Example scenes:
     - "Product hero shot with cloud elements"
     - "User interface showing main dashboard"
     - "Team collaboration features in action"
     - "Enterprise deployment architecture"
     - "Product benefits visualization"

3. **Choose Style**
   - Select from presets: Product Launch, Feature Showcase, Corporate, Tech Product, Lifestyle
   - Or customize the style description

4. **Configure Generation**
   - Steps: 25 (default good quality)
   - CFG Scale: 7.0 (default balance)
   - Keep other settings default for best results

5. **Click "Generate Storyboard"**
   - Monitor progress in the logs
   - Preview scenes as they're generated
   - View generation time and seed info

## 4. Export & Use

- **View in UI**: Click thumbnails to preview each scene
- **Open Folder**: Click "Open" button to view saved files
- **Metadata**: Check `metadata.json` for generation details
- **Export**: PNG/JPG files ready for presentations

## Example Storyboard Workflow

### Product: "SecureVault Pro" - Password Manager

**Scene 1**: "Modern sleek password manager interface with glowing lock icons and digital security elements"

**Scene 2**: "User dashboard showing encrypted vault with multiple folders and organizational structure"

**Scene 3**: "Team collaboration features with shared vault and permission controls"

**Scene 4**: "Mobile and desktop app synchronized with cloud backup illustration"

**Scene 5**: "Enterprise deployment with security compliance badges and certifications"

**Style**: "Professional product presentation, corporate, modern tech"

## Performance Expectations

- **Model Download**: 10-20 minutes (first time only)
- **Per Scene Generation**: 30-50 seconds (with 25 steps)
- **Complete 5-Scene Storyboard**: ~3-5 minutes total

## Troubleshooting

### Server Won't Start

- Check Python version (3.8+)
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check port 8767 isn't in use

### Model Loading Fails

- Ensure 25GB+ free disk space
- Check internet connection
- Try `pip install --upgrade diffusers transformers`

### Out of Memory

- Enable CPU Offload and FP16 in Model settings
- Reduce image size to 768x768
- Reduce generation steps to 20

### Low Quality Output

- Increase steps to 35-40
- Use higher CFG scale (8-10)
- Refine scene descriptions to be more specific
- Try RealVisXL V5.0 model for realistic style

## Tips for Best Results

### Scene Descriptions

✅ Good: "Modern dashboard interface with analytics charts and real-time data visualization"
❌ Bad: "Dashboard"

✅ Good: "Enterprise server room with glowing cables and security protocols indicated by holographic elements"
❌ Bad: "Server room"

### Style Guidance

- **Marketing Focus**: Use "professional product marketing"
- **Executive Presentation**: Use "corporate"
- **Tech Audience**: Use "modern technology, futuristic"
- **Lifestyle/Premium**: Use "lifestyle, aspirational, premium quality"

### Seed Control

- Use `-1` (default) for random, unique scenes
- Use specific seed number to reproduce same scene
- Add same base seed for visual consistency across scenes

## Next Steps

1. Generate multiple storyboards for A/B testing
2. Edit descriptions for fine-tuning results
3. Mix and match best scenes from different generations
4. Use metadata for batch processing reports
5. Integrate into presentation tools

## Advanced Usage

### Batch Generation

```bash
# Run server and generate multiple storyboards
python storyboard_server.py 8767 &

# Generate via API
curl -X POST http://localhost:8767/generate-storyboard \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "MyProduct",
    "product_description": "Description",
    "scenes": ["Scene 1", "Scene 2", "Scene 3"],
    "overall_style": "professional product presentation",
    "steps": 25,
    "cfg_scale": 7.0
  }'
```

### Check Generation Status

```bash
curl http://localhost:8767/generation-status
```

### Access Generation Logs

```bash
curl http://localhost:8767/generation-log
```

## Support

For issues or feature requests, check:

- README.md - Full documentation
- Generated metadata.json - Generation details
- Console logs - Error messages and diagnostics
