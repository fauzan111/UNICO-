# Metro Transport QR App

A mobile-responsive metro transport app that generates authentic QR codes for student tickets.

## Features

- 📱 Mobile-first design matching real metro apps
- 🎫 Generates authentic QR codes with proper format
- ⏰ Auto-updates QR codes every 10 minutes
- 🔄 Real-time timestamps
- 🎨 Authentic UI matching UNICO transport system

## Usage

### Quick Start (Simple Version)
Open `simple-app.html` in any web browser - works on mobile and desktop.

### Full App
Open `index.html` for the complete app with all 5 pages:
1. Explore (Map view)
2. Buy tickets
3. My tickets (with QR codes)
4. Vehicles
5. Profile

### Server Version
```bash
npm install
npm start
```
Then open `http://localhost:3000`

## QR Code Format

The app generates QR codes in the authentic format:
```
STUDRC
TIC
2025-09-28T00:20
2026-07-31T23:59
XNJFXZDHE9
37
2
0
021a340f1cbbb1d03089175ccae61b0e9ff5de1c4bdab4998f15bdb245
2025-09-28T00:20:22+02:00
```

## Files

- `index.html` - Complete app with all pages
- `simple-app.html` - QR-only version (recommended for mobile)
- `styles.css` - Styling
- `script.js` - JavaScript functionality
- `server.js` - Node.js server (optional)
- `package.json` - Dependencies

## Mobile Usage

1. Upload to GitHub Pages or any hosting service
2. Open the URL on your phone
3. Add to home screen for app-like experience
4. QR codes update automatically every 10 minutes

## License

MIT License - Feel free to use and modify!