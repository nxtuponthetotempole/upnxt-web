#!/bin/bash

# remove-vercel-json.sh — Fix broken Vercel deploy by removing vercel.json

echo "🗑  Removing vercel.json to restore Vercel's default static site behavior..."

# Step 1: Remove vercel.json
if [ -f "vercel.json" ]; then
  git rm vercel.json
  echo "✅ vercel.json removed from git tracking."
else
  echo "⚠️  vercel.json not found. Skipping removal."
fi

# Step 2: Commit the deletion
git commit -m "Remove vercel.json to restore Vercel static site settings"

# Step 3: Push to GitHub
git push origin main

echo ""
echo "🚀 Push complete. Now go to https://vercel.com to trigger a redeploy:"
echo "1. Open your UpNxt project"
echo "2. Go to Settings → Build & Development"
echo "   - Set Build Command: echo 'Static site — no build needed'"
echo "   - Set Output Directory: ."
echo "3. Then go to Deployments tab and click 'Redeploy' on the latest commit"
echo ""
echo "🎯 Once deployed, visit https://upnxt-web.vercel.app and confirm:"
echo "- Hero video loads"
echo "- Scroll animation works"
echo "- Waitlist form submits to Supabase"
echo ""
echo "✅ You're now back on a clean, dashboard-controlled deploy path!" 