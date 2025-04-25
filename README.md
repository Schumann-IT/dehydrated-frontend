# dehydrated-frontend

## Installation

Install the application dependencies by running:

```sh
npm install
```

## Development

Start the application in development mode by running:

```sh
npm run dev
```

## Production

Build the application in production mode by running:

```sh
npm run build
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **CI Workflow**: Runs on every push and pull request to main and develop branches. It performs type checking, linting, and builds the application.
- **Code Quality Workflow**: Runs weekly and on pushes to main and develop branches. It checks code quality with ESLint, Prettier, and dependency audits.
- **Dependabot**: Automatically creates pull requests for dependency updates.
- **Deployment Workflow**: Deploys the application to GitHub Pages when changes are pushed to the main branch.

## Theme Plugins

The application supports theme plugins that allow you to customize its appearance. Theme plugins provide custom Material-UI themes for both light and dark modes.

### Creating a Theme Plugin

#### 1. Package Structure

Create a new npm package with the following structure:

```
my-theme-plugin/
├── package.json
├── src/
│   ├── light.ts
│   └── dark.ts
└── README.md
```

#### 2. Package Configuration

In your `package.json`, add the following configuration:

```json
{
  "name": "my-theme-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "react-admin": {
    "type": "theme",
    "name": "my-theme",
    "light": "light",
    "dark": "dark"
  },
  "peerDependencies": {
    "@mui/material": "^6.0.0",
    "react-admin": "^5.0.0"
  }
}
```

The `react-admin` field is crucial:
- `type`: Must be "theme"
- `name`: The identifier for your theme
- `light`: The name of your light theme export (defaults to "light")
- `dark`: The name of your dark theme export (defaults to "dark")

#### 3. Theme Implementation

Create your theme files (`light.ts` and `dark.ts`):

```typescript
// src/light.ts
import { Theme } from '@mui/material';

export const light: Theme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#your-primary-color',
      light: '#your-primary-light',
      dark: '#your-primary-dark',
      contrastText: '#your-contrast-text',
    },
    secondary: {
      main: '#your-secondary-color',
      light: '#your-secondary-light',
      dark: '#your-secondary-dark',
      contrastText: '#your-contrast-text',
    },
  },
  // Add other theme customizations
};

// src/dark.ts
import { Theme } from '@mui/material';

export const dark: Theme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#your-primary-color',
      light: '#your-primary-light',
      dark: '#your-primary-dark',
      contrastText: '#your-contrast-text',
    },
    secondary: {
      main: '#your-secondary-color',
      light: '#your-secondary-light',
      dark: '#your-secondary-dark',
      contrastText: '#your-contrast-text',
    },
  },
  // Add other theme customizations
};
```

### Installing a Theme Plugin

1. Install the theme plugin package:

```bash
npm install my-theme-plugin
# or
yarn add my-theme-plugin
```

2. The theme will be automatically detected and loaded by the application's theme system.

### Using Theme Plugins

#### Default Theme

The application comes with a default theme that includes:

- Light and dark mode support
- Customizable assets (wallpaper)
- Customizable texts (title, dashboard content)

#### Custom Theme Options

You can customize the following options in your theme:

```typescript
interface CustomThemeOptions {
  assets?: {
    wallpaper: string;  // URL to the background image
  };
  texts?: {
    title: string;      // Application title
    dashboard: {
      content: string;  // Dashboard welcome message
    };
  };
}
```

#### Theme Switching

The application automatically handles theme switching between light and dark modes. The current theme mode is stored in the environment variable `VITE_THEME_MODE` (defaults to "light").

### Best Practices

1. **Theme Consistency**: Ensure your light and dark themes maintain visual consistency and follow Material Design principles.

2. **Color Palette**: 
   - Use a consistent color palette across both themes
   - Ensure sufficient contrast ratios for accessibility
   - Consider color-blind users when choosing your palette

3. **Typography**:
   - Maintain readable font sizes
   - Use consistent font families
   - Ensure proper hierarchy with different text styles

4. **Spacing**:
   - Use consistent spacing units
   - Maintain proper padding and margins
   - Follow Material Design spacing guidelines

5. **Components**:
   - Customize component styles consistently
   - Ensure interactive elements are clearly distinguishable
   - Maintain proper states (hover, active, disabled)

### Troubleshooting

1. **Theme Not Loading**:
   - Check if the package.json has the correct `react-admin` configuration
   - Verify that the theme exports match the names specified in package.json
   - Ensure all peer dependencies are installed

2. **Style Conflicts**:
   - Check for conflicting style overrides
   - Verify that your theme properly extends the base theme
   - Use the Material-UI theme provider's `StyledEngineProvider` if needed

3. **Performance Issues**:
   - Optimize theme object size
   - Use proper code splitting
   - Implement lazy loading for theme assets

### Example Theme Plugin

Here's a minimal example of a theme plugin:

```typescript
// src/light.ts
import { Theme } from '@mui/material';

export const light: Theme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#fff',
    },
  },
};

// src/dark.ts
import { Theme } from '@mui/material';

export const dark: Theme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
  },
};
```

### Contributing

When contributing a theme plugin:

1. Follow the Material-UI theming guidelines
2. Include proper documentation
3. Provide examples of usage
4. Test your theme in both light and dark modes
5. Ensure accessibility compliance
6. Include proper TypeScript types

