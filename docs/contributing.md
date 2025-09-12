# Contributing Guidelines

Thank you for your interest in contributing to Mocha! This document outlines the process and standards for contributing.

## 🤝 How to Contribute

### Types of Contributions

We welcome the following types of contributions:

- **Bug fixes** - Fix issues and improve stability
- **Performance improvements** - Optimize queries, caching, or algorithms
- **New features** - Add new functionality (discuss first in issues)
- **Documentation** - Improve guides, examples, and API docs
- **Tests** - Add or improve test coverage
- **Examples** - Create usage examples and tutorials

### Before You Start

1. **Check existing issues** - Look for related issues or discussions
2. **Create an issue** - For new features or major changes, create an issue first
3. **Fork the repository** - Create your own fork to work on
4. **Read the guidelines** - Familiarize yourself with our standards

## 🛠️ Development Setup

### Prerequisites

- **Bun 1.0+** (recommended) or **Node.js 18+**
- **Git**
- **SQLite** (usually included with Bun/Node.js)

### Setup Steps

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/mocha.git
   cd mocha
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up the database**
   ```bash
   bun run db:generate
   bun run db:init
   ```

4. **Run tests**
   ```bash
   bun run test-complete.ts
   ```

5. **Check code quality**
   ```bash
   bun run check
   bunx tsc
   ```

## 📝 Code Standards

### File Organization

- **Keep files small** - Maximum 50 lines per file when possible
- **Single responsibility** - Each file should have one clear purpose
- **Component-based** - Break functionality into focused modules
- **Minimal comments** - Code should be self-documenting

### TypeScript Standards

- **Strict mode** - All TypeScript strict checks enabled
- **No `any` types** - Use `unknown` and proper type assertions
- **Explicit return types** - For public methods and complex functions
- **Interface over type** - Use interfaces for object shapes

### Code Style

We use **Biome** for formatting and linting:

```bash
# Check code style
bun run check

# Auto-fix issues
bun run check:fix

# Format code
bun run format:fix
```

### Performance Guidelines

- **Prefer iteration over array methods** - For cache invalidation and large datasets
- **Use specialized query modules** - Don't put all queries in one class
- **Implement proper caching** - Cache expensive operations with appropriate TTL
- **Optimize database queries** - Use indexes and avoid N+1 queries

## 🔄 Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feat/` - New features
- `fix/` - Bug fixes
- `perf/` - Performance improvements
- `docs/` - Documentation changes
- `test/` - Test additions/improvements
- `refactor/` - Code refactoring

Examples:
- `feat/add-channel-stats`
- `fix/cache-invalidation-bug`
- `perf/optimize-message-queries`

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Follow the code standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   bun run check
   bunx tsc
   bun run test-complete.ts
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add channel statistics tracking"
   ```

5. **Push and create PR**
   ```bash
   git push origin feat/your-feature-name
   ```

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] TypeScript compilation succeeds
- [ ] Documentation is updated
- [ ] Commit messages follow conventions

### PR Requirements

1. **Clear title** - Descriptive and follows commit conventions
2. **Detailed description** - Explain what and why
3. **Link related issues** - Reference issue numbers
4. **Test coverage** - Include tests for new functionality
5. **Breaking changes** - Clearly document any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update
- [ ] Breaking change

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🧪 Testing Guidelines

### Test Requirements

- **Unit tests** - For individual functions and classes
- **Integration tests** - For component interactions
- **Performance tests** - For critical paths
- **Type tests** - For TypeScript type safety

### Running Tests

```bash
# Run all tests
bun run test-complete.ts

# Type checking
bunx tsc

# Code quality
bun run check
```

### Writing Tests

- **Test file naming** - `*.test.ts` or `*.spec.ts`
- **Descriptive test names** - Clearly describe what is being tested
- **Arrange-Act-Assert** - Structure tests clearly
- **Mock external dependencies** - Don't rely on external services

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Create release PR
5. Tag release after merge
6. Publish to npm

## 🤔 Questions?

- **General questions** - Create a discussion
- **Bug reports** - Create an issue with bug template
- **Feature requests** - Create an issue with feature template
- **Security issues** - Email maintainers directly

## 📜 Code of Conduct

- **Be respectful** - Treat all contributors with respect
- **Be constructive** - Provide helpful feedback
- **Be patient** - Reviews take time
- **Be collaborative** - Work together to improve the project

Thank you for contributing to Mocha! ☕🎉
