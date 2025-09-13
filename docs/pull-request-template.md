# Pull Request Template

## Description

Brief description of the changes made in this PR.

## Type of Change

Please check the type of change your PR introduces:

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] ⚡ Performance improvement (non-breaking change which improves performance)
- [ ] 📚 Documentation update (changes to documentation only)
- [ ] 🔧 Refactoring (code changes that neither fix a bug nor add a feature)
- [ ] 🧪 Test changes (adding or updating tests)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Related Issues

Closes #(issue number)
Fixes #(issue number)
Refs #(issue number)

## Changes Made

### Core Changes
- List the main changes made to the codebase
- Include any new files created or deleted
- Mention any architectural changes

### API Changes
- List any changes to public APIs
- Include breaking changes with migration notes
- Document new methods or parameters

### Performance Impact
- Describe any performance improvements or regressions
- Include benchmark results if applicable
- Note memory usage changes

## Testing

### Test Coverage
- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests added/updated
- [ ] All existing tests pass
- [ ] Manual testing completed

### Test Results
```bash
# Include test output here
bun run test-complete.ts
✅ All tests passed
```

### Manual Testing
Describe the manual testing performed:
- [ ] Tested with real Discord bot
- [ ] Verified database operations
- [ ] Checked cache behavior
- [ ] Tested error scenarios

## Performance Testing

### Benchmarks
If applicable, include benchmark results:

```
Before:
- getUserStats: 45ms average
- getLeaderboard: 120ms average
- Memory usage: 150MB

After:
- getUserStats: 32ms average (-29%)
- getLeaderboard: 95ms average (-21%)
- Memory usage: 135MB (-10%)
```

### Load Testing
- [ ] Tested with high event volume
- [ ] Verified memory stability
- [ ] Checked for memory leaks

## Code Quality

### Code Standards
- [ ] Code follows project style guidelines
- [ ] Files are under 50 lines where possible
- [ ] Components have single responsibility
- [ ] Minimal comments (self-documenting code)
- [ ] TypeScript strict mode compliance
- [ ] No `any` types used

### Code Review
- [ ] Self-review completed
- [ ] Code is well-structured and readable
- [ ] Error handling is appropriate
- [ ] Security considerations addressed

## Documentation

### Documentation Updates
- [ ] API documentation updated
- [ ] README updated if needed
- [ ] Examples updated if needed
- [ ] Architecture docs updated if needed

### Breaking Changes
If this PR introduces breaking changes, provide migration guide:

```typescript
// Before
const stats = client.getUserStats(guildId, userId);

// After  
const stats = await client.getUserStats(guildId, userId, 30);
```

## Deployment

### Database Changes
- [ ] No database schema changes
- [ ] Database migration included
- [ ] Migration tested locally
- [ ] Backward compatibility maintained

### Configuration Changes
- [ ] No configuration changes required
- [ ] Environment variables added/changed
- [ ] Configuration documented

## Checklist

### Before Submitting
- [ ] Branch is up to date with main
- [ ] Commit messages follow conventional format
- [ ] All CI checks pass
- [ ] No merge conflicts
- [ ] PR title follows conventional format

### Code Quality
- [ ] TypeScript compilation succeeds
- [ ] Biome linting passes
- [ ] All tests pass locally
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic is explained
- [ ] Public APIs are documented
- [ ] Examples are provided for new features

## Additional Notes

Add any additional notes, concerns, or context that reviewers should be aware of.

### Dependencies
- List any new dependencies added
- Explain why they were chosen
- Note any version constraints

### Future Work
- List any follow-up work needed
- Note any technical debt created
- Suggest future improvements

### Screenshots/GIFs
If applicable, add screenshots or GIFs to demonstrate the changes.

---

## Reviewer Guidelines

### What to Look For
- Code quality and adherence to standards
- Performance implications
- Security considerations
- Test coverage and quality
- Documentation completeness

### Testing Instructions
1. Clone the branch
2. Run `bun install`
3. Run `bun run db:init`
4. Run `bun run test-complete.ts`
5. Test manually with Discord bot

### Review Checklist
- [ ] Code follows project conventions
- [ ] Changes are well-tested
- [ ] Documentation is adequate
- [ ] Performance impact is acceptable
- [ ] Security implications considered
