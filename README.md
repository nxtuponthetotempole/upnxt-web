# UpNxt Landing Page

An emotionally intelligent discovery engine for streaming content. Skip the scroll. Roll the credits.

## Features

- 🎬 Fullscreen autoplaying hero video
- 📱 Phone number waitlist signup with SMS opt-in
- 🎨 Animated scroll title that overlaps the hero section
- 📊 Supabase integration for waitlist data storage
- 🎭 Cinematic design with dark theme and mint accents
- 📱 Mobile-responsive design

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create the `waitlist_signups` table with this schema:

```sql
create table waitlist_signups (
  id uuid primary key default uuid_generate_v4(),
  phone text not null,
  created_at timestamp default timezone('utc', now())
);
```

3. Add RLS policy:

```sql
create policy "Allow insert for all"
on waitlist_signups
for insert
to public
using (true);
```

4. Update `supabase-config.js` with your credentials:

```javascript
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
```

### 3. Add Hero Video

Place your hero video file at `/video/upnxt-hero.mp4`

### 4. Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

## File Structure

```
├── index.html              # Main landing page
├── styles.css              # All styles including animations
├── script.js               # Main JavaScript functionality
├── supabase-config.js      # Supabase configuration
├── video/
│   └── upnxt-hero.mp4      # Hero video (add your file here)
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Features Breakdown

### Hero Section
- Fullscreen video background with `/video/upnxt-hero.mp4`
- Bouncing scroll indicator at bottom center
- No text overlay - clean video experience

### Animated Scroll Title
- "Skip the Scroll. Roll the Credits." title
- Scrolls upward and overlaps hero section
- CSS scroll-linked animations

### Waitlist Form
- Phone number input with validation
- Required SMS opt-in checkbox
- Real-time form validation
- Supabase integration for data storage
- Success/error toast notifications

### Demo Section
- Placeholder for upcoming product demo
- Interactive play button
- Maintains existing design

## Environment Variables

For production, you can use environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful fallbacks for older browsers

## Performance

- Video preloading for smooth playback
- Optimized animations with `prefers-reduced-motion` support
- Lazy loading for non-critical assets
- Mobile-optimized touch targets

## License

MIT License - see LICENSE file for details 