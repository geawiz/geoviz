# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a collection of interactive web mapping tutorials using maplibre-gl-js. The repository demonstrates progressive concepts from basic maps to advanced geospatial data visualization with different protocols and data formats.

## Architecture

The project has two main components:

1. **Tutorial Examples** (`0_getting-started/`, `1_simple-map/`, `2_PMTiles-map/`, `3_Cloud-Optimized-GeoTIFF/`, `4_layer-list/`)
   - Each tutorial directory contains standalone HTML examples and Vue.js components
   - Demonstrates specific mapping concepts with both vanilla JS and Vue implementations
   - Includes Jupyter notebooks for data processing workflows

2. **Website Application** (`website/`)
   - Vue 3 + TypeScript + Vuetify application
   - Vite-based build system
   - Displays tutorials in an interactive interface
   - Main map component at `website/src/components/Map.vue`

## Key Technologies

- **Frontend**: Vue 3, TypeScript, Vuetify, Vite
- **Mapping**: maplibre-gl-js with protocols for PMTiles and Cloud Optimized GeoTIFF (COG)
- **Data Processing**: Python with rasterio, geopandas, and Jupyter notebooks
- **Package Management**: pnpm (lockfile present)

## Common Development Commands

All commands should be run from the `website/` directory:

```bash
cd website/
pnpm dev          # Start development server on port 3333
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm typecheck    # Run TypeScript type checking
pnpm deploy       # Build and deploy to gh-pages
```

## Data Processing Workflows

The project includes Jupyter notebooks for processing geospatial data:

- `2_PMTiles-map/prepare_vector_tiles.ipynb`: Convert vector data to PMTiles format
- `3_Cloud-Optimized-GeoTIFF/prepare_cog.ipynb`: Process raster data into Cloud Optimized GeoTIFF

These notebooks demonstrate:
- Downloading and processing Swiss geospatial data
- Converting between coordinate systems (LV95 to WGS84)
- Creating optimized formats for web mapping (PMTiles, COG)
- Using tippecanoe for vector tile generation

## Map Component Architecture

The main `Map.vue` component (`website/src/components/Map.vue`) handles:
- Dynamic protocol registration (PMTiles, COG)
- Layer management with visibility toggles
- Support for both vector and raster data sources
- Integration with tutorial configuration system

## Tutorial Structure

Each tutorial follows a consistent pattern:
- `README.md`: Tutorial explanation and concepts
- `index.html`: Standalone HTML implementation
- `Map.vue`: Vue component implementation
- `data/`: Sample data files
- Processing notebooks where applicable

## Git Hooks

The project uses simple-git-hooks with lint-staged for pre-commit linting:
- All files are linted with ESLint before commit
- Automatic fixing is applied during the pre-commit hook

## Development Notes

- Use pnpm for package management (pnpm-lock.yaml is present)
- The codebase follows Vue 3 Composition API patterns
- TypeScript is used throughout with strict type checking
- Vuetify provides the UI component framework
- ESLint configuration includes Vue-specific rules and formatting