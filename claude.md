# Grafana Polystat Panel

## Project Overview

This is a Grafana panel plugin that provides a D3-based multi-stat visualization using hexagonal (or circular/square) polygons. Each metric received is displayed as a polygon, with support for grouping metrics into composites that show the triggered state of combined metrics.

**Current Version**: 2.1.16
**License**: Apache-2.0
**Grafana Compatibility**: 9.5.x or later
**Primary Technology**: TypeScript, React 17, D3.js

## Key Features

- **Multi-shape Support**: Hexagons, circles, and squares
- **Composites**: Combine multiple metrics into a single representation showing the "worst" state
- **Autoscaling**: Best-fit sizing of polygons to panel size
- **Thresholds**: Ranged state support with customizable thresholds
- **Overrides**: Apply custom rendering options, thresholds, and clickthroughs per metric
- **Clickthrough URLs**: Navigate to other dashboards or URLs by clicking polygons
- **Tooltips**: Display additional information when polygons are scaled down

## Architecture

### Directory Structure

```
src/
├── __mocks__/          # Test mocks for models and composites
├── components/         # React components
│   ├── composites/     # Composite metric handling
│   ├── gradients/      # Gradient rendering utilities
│   ├── layout/         # Layout management for polygon positioning
│   ├── overrides/      # Override editor and item components
│   ├── thresholds/     # Threshold editor components
│   └── tooltips/       # Tooltip rendering
├── data/               # Data processing utilities
│   └── valueMappingsWrapper/ # Value mapping logic
└── img/                # Plugin assets and screenshots

Key files:
- module.ts             # Plugin entry point
- migrations.ts         # Panel option migrations
- utils.ts              # Utility functions
- components/Polystat.tsx  # Main panel component
```

### Core Components

1. **Polystat.tsx**: Main panel component that orchestrates the rendering
2. **layoutManager.ts**: Handles polygon positioning and autoscaling
3. **OverrideEditor.tsx**: UI for configuring metric-specific overrides
4. **ThresholdsEditor.tsx**: UI for configuring threshold states
5. **Composites**: Logic for combining multiple metrics

## Development Setup

### Prerequisites

- Node.js >= 24
- Yarn 4.12.0 (managed via packageManager field)

### Installation

```bash
yarn install
```

### Development Workflow

```bash
# Development mode with watch
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Type checking
yarn typecheck

# Linting
yarn lint
yarn lint:fix

# Spell checking
yarn spellcheck

# E2E tests
yarn e2e
yarn playwright:test
yarn playwright:test:ui
```

### Docker Development

```bash
docker compose up --build
# Then navigate to http://localhost:3000
```

## Build System

- **Bundler**: Webpack 5
- **TypeScript**: 5.9.3
- **Compiler**: SWC (fast TypeScript/JavaScript compiler)
- **Testing**: Jest with @swc/jest
- **E2E Testing**: Playwright with @grafana/plugin-e2e

## Dependencies

### Key Runtime Dependencies

- `@grafana/data` (9.5.21): Core Grafana data utilities
- `@grafana/ui` (9.5.21): Grafana UI components
- `@grafana/runtime` (9.5.21): Grafana runtime utilities
- `d3-hexbin` (0.2.2): D3 hexagonal binning for polygon layout
- `react` (17.0.2) & `react-dom` (17.0.2): UI framework
- `react-tooltip` (5.30.0): Tooltip rendering
- `tinycolor2` (1.6.0): Color manipulation

### Development Tools

- ESLint with Grafana config for code quality
- Prettier for code formatting
- Jest for unit testing
- Playwright for E2E testing
- Webpack with custom configuration in `.config/webpack/`

## Plugin Configuration

The plugin supports extensive customization through:

1. **General Settings**: Panel-wide display options
2. **Options**: Polygon shape, colors, sizing
3. **Thresholds**: Define state ranges and colors
4. **Overrides**: Per-metric customization
5. **Composites**: Metric grouping configuration
6. **Clickthrough URLs**: Navigation configuration

See documentation in `docs/` directory:
- `Polystat-docs-settings.md`
- `Polystat-docs-options.md`
- `Polystat-docs-thresholds.md`
- `Polystat-docs-overrides.md`
- `Polystat-docs-composites.md`
- `Polystat-docs-clickthroughurl.md`

## Testing

### Unit Tests

- Located alongside source files with `.test.ts` or `.test.tsx` extension
- Use Jest with React Testing Library
- Mock data in `src/__mocks__/`

### E2E Tests

- Located in `tests/` directory
- Use Playwright with Grafana plugin-e2e utilities
- Configuration in `playwright.config.ts`

### Test Data

Enable Grafana TestData plugin to test with sample data:
1. Navigate to Plugins > Apps
2. Find "Grafana TestData App"
3. Click Enable

## CI/CD

- GitHub Actions workflows in `.github/workflows/`
- Automated dependency updates with Renovate
- Stale issue management
- Code quality checks via Code Climate
- Security scanning via Snyk

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create signed plugin using: `yarn sign`
4. Plugin is published to Grafana plugin marketplace

## Important Notes

- Color assignments from value mappings are ignored; only threshold colors apply
- The plugin uses D3's hexagonal binning algorithm for layout
- Autoscaling ensures polygons fit within the panel boundaries
- Composite metrics show the "worst" state of combined metrics
- The plugin is maintained by Grafana Labs

## Resources

- **GitHub**: https://github.com/grafana/grafana-polystat-panel
- **Grafana Marketplace**: https://grafana.com/grafana/plugins/grafana-polystat-panel
- **D3 Inspiration**: https://www.visualcinnamon.com/2013/07/self-organizing-maps-creating-hexagonal.html

## Contributors

Special thanks to Mathieu Rollet, Mattias Jiderhamn, AnushaBoggarapu, KamalakarGoretta, Rene Hennig, Hamza Ziyani, and many others who have contributed to this project.
