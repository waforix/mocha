# Commit Guidelines

This document outlines the commit message format and standards for the Mocha project.

## 📝 Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples

```bash
feat: add channel statistics tracking
fix: resolve cache invalidation bug
perf: optimize message query performance
docs: update API reference documentation
test: add unit tests for cache manager
refactor: split query class into modules
```

## 🏷️ Commit Types

### Primary Types

- **feat** - New features or functionality
- **fix** - Bug fixes
- **perf** - Performance improvements
- **docs** - Documentation changes
- **test** - Adding or updating tests
- **refactor** - Code refactoring without feature changes

### Secondary Types

- **build** - Build system or dependency changes
- **ci** - CI/CD configuration changes
- **chore** - Maintenance tasks
- **style** - Code formatting (not affecting functionality)
- **revert** - Reverting previous commits

## 🎯 Scopes

Use scopes to specify which part of the codebase is affected:

### Core Components
- **cache** - Cache-related changes
- **db** - Database schema or connection changes
- **gateway** - Discord Gateway client changes
- **events** - Event processing changes
- **stats** - Statistics aggregation changes
- **types** - TypeScript type definitions

### Infrastructure
- **build** - Build configuration
- **deps** - Dependency updates
- **config** - Configuration files
- **scripts** - Build/utility scripts

### Examples with Scopes

```bash
feat(cache): add type-safe key generation
fix(gateway): handle reconnection edge cases
perf(stats): optimize user query performance
docs(api): update method signatures
test(cache): add LRU cache unit tests
refactor(queries): split into specialized modules
```

## ✍️ Writing Good Commit Messages

### Description Guidelines

- **Use imperative mood** - "add feature" not "added feature"
- **Start with lowercase** - Unless it's a proper noun
- **No period at the end** - Keep it concise
- **Maximum 50 characters** - For the description line
- **Be specific** - Clearly describe what changed

### Good Examples

```bash
feat: add voice session duration tracking
fix: prevent memory leak in event processor
perf: reduce database query count by 40%
docs: add performance optimization guide
test: increase cache manager test coverage
refactor: extract date utilities to separate module
```

### Bad Examples

```bash
# Too vague
fix: bug fix
feat: improvements
update: changes

# Wrong tense
feat: added new feature
fix: fixed the bug

# Too long
feat: add comprehensive voice session duration tracking with detailed analytics and reporting capabilities

# Missing type
add new caching system
update documentation
```

## 📋 Commit Body

Use the body to explain **what** and **why**, not **how**:

```bash
feat(cache): add automatic cache warming

Implement background cache warming to improve response times
for frequently accessed statistics. This reduces cold start
latency by pre-loading common queries during low-traffic periods.

The warming process runs every 5 minutes and targets:
- Top 100 active users per guild
- Guild statistics for last 30 days
- Popular leaderboard queries
```

### Body Guidelines

- **Wrap at 72 characters** - For better readability
- **Separate from description** - Use blank line
- **Explain motivation** - Why was this change needed?
- **Describe impact** - What does this change affect?

## 🔗 Commit Footer

Use footers for metadata and references:

### Breaking Changes

```bash
feat(api): change getUserStats return format

BREAKING CHANGE: getUserStats now returns an object with
additional metadata instead of just the stats array.

Before: getUserStats() -> UserStats
After: getUserStats() -> { stats: UserStats, metadata: Meta }
```

### Issue References

```bash
fix(gateway): handle connection timeout properly

Fixes #123
Closes #456
Refs #789
```

### Co-authored Commits

```bash
feat: add real-time statistics dashboard

Co-authored-by: Jane Doe <jane@example.com>
Co-authored-by: John Smith <john@example.com>
```

## 🚀 Special Cases

### Merge Commits

Use descriptive merge commit messages:

```bash
# Good
merge: integrate voice tracking feature (#123)

# Bad
Merge pull request #123 from user/feature
```

### Revert Commits

Follow the revert format:

```bash
revert: feat(cache): add automatic cache warming

This reverts commit 1234567890abcdef.

Reason: Caused memory issues in production environment.
```

### Hotfix Commits

Mark urgent production fixes:

```bash
fix(gateway)!: prevent connection loop crash

HOTFIX: Critical fix for production stability issue
that caused infinite reconnection loops.
```

## 🔍 Commit Message Validation

We use automated tools to validate commit messages:

### Local Validation

```bash
# Install commitizen for guided commits
bun add -D commitizen cz-conventional-changelog

# Use guided commit
bunx cz
```

### Pre-commit Hooks

```bash
# Install husky for git hooks
bun add -D husky @commitlint/cli @commitlint/config-conventional

# Validate commit messages
bunx commitlint --from HEAD~1 --to HEAD --verbose
```

## 📊 Commit Statistics

Track your commit quality:

```bash
# Analyze commit history
git log --oneline --grep="feat:" --since="1 month ago"
git log --oneline --grep="fix:" --since="1 month ago"

# Check commit message format
git log --pretty=format:"%s" -10 | grep -E "^(feat|fix|perf|docs|test|refactor)"
```

## ✅ Commit Checklist

Before committing, ensure:

- [ ] Commit message follows conventional format
- [ ] Type and scope are appropriate
- [ ] Description is clear and concise
- [ ] Body explains why (if needed)
- [ ] Breaking changes are documented
- [ ] Related issues are referenced
- [ ] Code is tested and linted
- [ ] No sensitive information included

## 🎯 Best Practices

### Atomic Commits

- **One logical change per commit** - Don't mix unrelated changes
- **Complete functionality** - Each commit should be functional
- **Reversible changes** - Easy to revert if needed

### Commit Frequency

- **Commit often** - Small, frequent commits are better
- **Meaningful checkpoints** - Each commit should represent progress
- **Clean history** - Use interactive rebase to clean up before pushing

### Team Collaboration

- **Consistent format** - Follow team conventions
- **Clear communication** - Help reviewers understand changes
- **Reference issues** - Link commits to project management

Remember: Good commit messages are a gift to your future self and your teammates! 🎁
