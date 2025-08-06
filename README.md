# Zoning Map Digitizer

## Overview

An **AI-powered web application** for digitizing and analyzing zoning maps from PDF documents. This tool streamlines the conversion of static zoning PDFs into **interactive, editable vector data** for urban planning and GIS workflows. Bring your own API key and you're off to the races.

---
![Alt text](https://github.com/weissbc07/map-digitize-pro/blob/main/public/featured.png?raw=true "Map Digitize Pro")

## 🔑 Key Features

### 🤖 AI-Powered Analysis
- **GPT-4 Vision Integration**: Automated map feature detection and overlay alignment  
- **Smart Legend Detection**: Automatically extracts zoning types, codes, and color mappings  
- **Intelligent Coordinate Suggestion**: Georeferencing using detected streets and landmarks  
- **Auto Alignment**: AI-optimized scale, rotation, and positioning

### 📄 PDF Processing
- Drag-and-drop upload (max 10MB) with validation  
- High-quality conversion with `PDF.js`  
- Upload progress tracking and visual feedback  
- Smart cropping to isolate map and legend content

### 🗺️ Interactive Mapping
- Seamless `OpenLayers` integration  
- Real-time controls: scale, opacity, rotation, position  
- Interactive map with `OpenStreetMap` base layer  
- Live mouse position and scale indicator

### ✏️ Vector Editing Tools
- Drawing modes: Polygon, Rectangle, Circle, Freehand  
- Assign zone types with color-coded visualization  
- Edit properties of drawn features  
- Includes 17+ predefined zoning types

### 📊 Data Export
- **GeoJSON** for web GIS compatibility  
- **KML** for Google Earth or legacy mapping tools  
- Summary reports with stats and metadata  
- Styled exports maintaining zoning visual cues

---

## 🧭 Step-by-Step Workflow

1. **Upload**: Drop your PDF zoning map  
2. **Smart Crop**: AI separates map and legend  
3. **Georeference**: Position map with coordinate suggestions  
4. **Legend Detection**: Zoning categories identified  
5. **Zone Configuration**: Manage zone types, colors, and rules  
6. **Draw & Edit**: Use advanced drawing tools for boundaries  
7. **Export**: Download in GeoJSON, KML, and more

---

## ⚙️ Technology Stack

### Frontend
- React 18 + TypeScript  
- Vite (build + dev server)  
- React Router DOM (routing)

### UI Components
- `shadcn/ui` + Radix Primitives  
- Tailwind CSS  
- Lucide Icons  
- Sonner (toasts/alerts)

### Mapping & Geospatial
- `OpenLayers` for high-performance mapping  
- `PDF.js` for client-side PDF parsing  
- GeoJSON for standard vector format

### AI & Vision
- GPT-4 Vision (via OpenAI API)  
- Custom vision models for:
  - Feature detection
  - Geocoordinate inference
  - Legend parsing
  - Map alignment

### Data Management
- `@tanstack/react-query` for data fetching  
- `React Hook Form` + Zod for forms  
- Supabase (PostgreSQL) for persistence  
- Custom hooks for map feature state

### Dev Tools
- TypeScript  
- ESLint  
- Tailwind typography plugin  
- PostCSS + Autoprefixer

---

## 💼 Use Cases

- **Urban Planners**: Convert legacy PDFs to digital zoning data  
- **GIS Professionals**: Generate usable shapefiles and layers  
- **Municipal Governments**: Modernize zoning documents  
- **Real Estate**: Visualize property zoning at parcel level  
- **Consultants**: Automate zoning workflows with AI

---

## 🚀 Installation & Development

```bash
# Clone the repository
git clone <repository-url>
cd zoning-map-digitizer

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## 🔧 Configuration

- Requires OpenAI API Key  
- Requires Supabase Project (for data backend)  
- Use `.env` file to configure API keys and Supabase connection

---

## 🧠 Why It Matters

This application bridges **traditional GIS workflows** with **modern AI capabilities**, reducing the time, effort, and manual steps involved in zoning map digitization.

---

## 📦 Changelog

### What's Changed

- `feat`: Allow toggling of PDF overlay [#1](https://github.com/weissbc07/map-digitize-pro/pull/1) by [@weissbc07](https://github.com/weissbc07)

### New Contributors

- [@weissbc07](https://github.com/weissbc07) made their first contribution in [#1](https://github.com/weissbc07/map-digitize-pro/pull/1)

**Full Changelog**: [Commits »](https://github.com/weissbc07/map-digitize-pro/commits/main)
