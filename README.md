# Centra Roleplay Website

Modern, responsive website for Centra Roleplay MTA server with real-time player count integration.

## Features

- 🎮 Modern gaming website design with blue neon theme
- 📱 Fully responsive design
- 🔄 Real-time player count updates from MTA server
- 🚀 Optimized for Netlify deployment
- 📦 MTA script integration included

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### MTA Script Setup

1. Copy the `mta-script` folder to your MTA server's `resources` directory
2. Add to your `mtaserver.conf`:
   ```xml
   <resource src="centra-web-integration" startup="1" />
   ```
3. Update the website URL in `meta.xml` settings
4. Restart your MTA server

### Deployment

#### Netlify (Recommended)

1. Push to GitHub repository
2. Connect repository to Netlify
3. Deploy automatically with included `netlify.toml` configuration

#### Manual Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## MTA Script Features

- ✅ Automatic player count updates every 30 seconds
- ✅ Real-time updates when players join/leave
- ✅ Admin command `/updateweb` for manual updates
- ✅ Error handling and debug logging
- ✅ Configurable update intervals

## Configuration

### Website Settings

Update `mta-script/meta.xml`:
```xml
<setting name="*website_url" value="https://your-domain.com" />
<setting name="*update_interval" value="30000" />
```

### API Endpoints

- `GET /api/players` - Get current player count
- `POST /api/players` - Update player count (used by MTA script)

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify
- **MTA Integration**: Lua script with HTTP requests

## Team

- **Project Leader**: linecstacy
- **FullStack Developer**: expect

## License

© 2024 Centra Roleplay. All rights reserved.