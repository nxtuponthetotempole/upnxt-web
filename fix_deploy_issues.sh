#!/bin/bash

# fix_deploy_issues.sh — Ensure video, CSS, and Vercel deploy works for UpNxt

echo "🔧 Fixing broken video and CSS references for UpNxt landing page..."

# Step 1: Check if video file exists
echo "✅ Checking video file..."
if [ ! -f "video/hero.mp4" ]; then
  echo "⚠️  Missing video file: video/hero.mp4"
  echo "❗  Please move your video file into the ./video/ directory and name it hero.mp4"
  exit 1
else
  echo "✅ Video file found: video/hero.mp4"
fi

# Step 2: Ensure styles.css contains the right video styles
echo "✅ Checking styles.css for hero video styling..."

# Check if #bgVideo style already exists
if grep -q "#bgVideo" styles.css; then
  echo "✅ #bgVideo style already exists in styles.css"
else
  echo "✅ Adding #bgVideo style to styles.css..."
  echo "
#bgVideo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
}
" >> styles.css
fi

# Step 3: Check if index.html has the video element
echo "✅ Checking index.html for video element..."
if grep -q 'id="bgVideo"' index.html; then
  echo "✅ Video element already exists in index.html"
else
  echo "⚠️  Video element missing from index.html"
  echo "❗  Please manually add the video element to index.html"
fi

# Step 4: Git commit & push
echo "📦 Committing changes and pushing to GitHub..."

git add styles.css video/hero.mp4
git commit -m "Fix CSS and video paths for production deployment"
git push origin main

echo "🚀 Pushed to main — deployment should auto-trigger on Vercel"

# Final instructions
echo ""
echo "🧪 Visit https://upnxt-web.vercel.app to confirm:"
echo "  ✅ Fullscreen hero video renders"
echo "  ✅ CSS styles are applied"
echo "  ✅ Waitlist form is functional"
echo ""
echo "🎬 Done!" 