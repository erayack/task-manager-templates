# @taskmaster/templates - Standalone Repository Setup Guide

This document outlines the steps needed to extract the templates folder into a standalone npm package repository.

## 🚀 Repository Setup

### 1. Initialize New Repository

```bash
# Create new repository
mkdir taskmaster-templates
cd taskmaster-templates

# Copy template files
cp -r /path/to/raycast-taskmaster-extension/templates/* .

# Initialize git repository
git init
git add .
git commit -m "Initial commit: TaskMaster templates extracted from Raycast extension"

# Add remote origin
git remote add origin https://github.com/your-org/taskmaster-templates.git
git push -u origin main
```

### 2. Dependencies Resolution ✅

The following import dependencies have been resolved:

- ✅ **Relative imports fixed**: All `../types` imports updated to `../configs/types.template`
- ✅ **Configuration imports**: All `../config` imports updated to `../configs/config.template` 
- ✅ **Component imports**: Cross-component imports use relative paths within templates structure
- ✅ **Missing dependencies**: Added placeholder implementations for missing API functions
- ✅ **Export structure**: Created proper index files for clean module exports

### 3. Package Configuration ✅

The standalone package includes:

- ✅ **package.json**: Complete npm package configuration with proper exports, scripts, and dependencies
- ✅ **tsconfig.json**: TypeScript configuration optimized for standalone usage
- ✅ **ESLint config**: Code quality and consistency rules
- ✅ **Jest config**: Testing framework setup
- ✅ **Build scripts**: Development and production build processes

## 📦 Publishing to NPM

### Prerequisites

1. **NPM Account**: Create account at [npmjs.com](https://www.npmjs.com)
2. **Organization**: Create `@taskmaster` organization (or use different namespace)
3. **Authentication**: Login via `npm login`

### Publishing Steps

```bash
# 1. Build the package
npm run build

# 2. Run tests and validation
npm run validate

# 3. Version bump (choose appropriate version)
npm version patch  # or minor, major

# 4. Publish to npm
npm publish --access public

# 5. Tag release
git push --follow-tags
```

### Version Management

Follow semantic versioning:
- **patch** (1.0.1): Bug fixes, template improvements
- **minor** (1.1.0): New templates, additional features  
- **major** (2.0.0): Breaking changes, API changes

## 🛠️ Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Run linting
npm run lint
npm run lint:fix

# Run tests
npm run test
npm run test:watch

# Type checking
npm run typecheck
```

### Testing Templates

```bash
# Create test project
mkdir test-project
cd test-project
npm init -y

# Install local package for testing
npm install ../taskmaster-templates

# Test imports
echo "import { Task } from '@taskmaster/templates'; console.log('Import works!');" > test.js
node test.js
```

## 🔧 Integration Testing

### Framework Compatibility Testing

Create example projects to verify compatibility:

#### React App
```bash
npx create-react-app react-test
cd react-test
npm install @taskmaster/templates
# Test component imports and usage
```

#### Next.js App  
```bash
npx create-next-app@latest nextjs-test
cd nextjs-test
npm install @taskmaster/templates
# Test SSR compatibility
```

#### Raycast Extension
```bash
npx create-raycast-extension raycast-test
cd raycast-test  
npm install @taskmaster/templates
# Test Raycast-specific components
```

## 📋 Pre-Release Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint passes without errors
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Examples work correctly

### Package Quality
- [ ] Build outputs are clean
- [ ] Package size is reasonable (<500kb)
- [ ] All exports are properly typed
- [ ] Peer dependencies are correct
- [ ] README includes usage examples

### Distribution
- [ ] Version bumped appropriately  
- [ ] CHANGELOG updated
- [ ] Git tags created
- [ ] GitHub release created
- [ ] NPM package published

## 🔍 Post-Release Tasks

### Monitoring
- [ ] NPM download statistics
- [ ] GitHub issues and feedback
- [ ] Community usage patterns
- [ ] Performance in different environments

### Maintenance
- [ ] Regular dependency updates
- [ ] Security vulnerability monitoring  
- [ ] Community contributions review
- [ ] Template improvements based on usage

## 🤝 Community Contributions

### Contributing Guidelines

1. **Fork repository** and create feature branch
2. **Follow code style** (ESLint + Prettier)
3. **Add tests** for new templates
4. **Update documentation** 
5. **Submit pull request** with clear description

### Issue Templates

Create GitHub issue templates for:
- 🐛 Bug reports
- ✨ Feature requests  
- 📝 Template improvements
- 📖 Documentation updates

## 🔐 Security Considerations

### Package Security
- Regular dependency audits (`npm audit`)
- Automated security updates (Dependabot)
- No secrets in repository
- Minimal runtime dependencies

### Template Security  
- No hardcoded credentials or keys
- Input validation in all templates
- Safe default configurations
- Security-focused examples

## 🚀 Future Enhancements

### Planned Features
- [ ] CLI tool for template scaffolding
- [ ] Visual template browser
- [ ] Framework-specific optimizations
- [ ] Integration with popular task management APIs
- [ ] Real-time collaboration templates

### Template Expansions
- [ ] Vue.js components
- [ ] Angular components  
- [ ] Svelte components
- [ ] Node.js API templates
- [ ] Database schema templates
- [ ] Docker configurations

This setup guide ensures the templates can be successfully extracted into a standalone, production-ready npm package that maintains all functionality while being framework-agnostic and easily consumable by different projects.