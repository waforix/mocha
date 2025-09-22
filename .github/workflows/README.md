# GitHub Actions Workflows

This directory contains automated workflows for the @waforix/mocha repository.

## sync-wiki.yml

Automatically synchronizes the `docs/` directory with the GitHub repository wiki.

### How it works

1. **Triggers**: Runs on pushes to `main`/`master` branch when files in `docs/` are changed, or manually via workflow dispatch
2. **Checkout**: Downloads both the main repository and the wiki repository
3. **Sync**: Copies all `.md` files from `docs/` to the wiki repository
4. **Transform**: Converts `README.md` to `Home.md` (GitHub wiki homepage)
5. **Navigation**: Creates/updates `_Sidebar.md` with organized navigation
6. **Commit**: Pushes changes to the wiki repository

### File mapping

| Source File | Wiki Page | Description |
|-------------|-----------|-------------|
| `docs/README.md` | `Home.md` | Main documentation homepage |
| `docs/Getting-Started.md` | `Getting-Started.md` | Installation and setup guide |
| `docs/Client-Configuration.md` | `Client-Configuration.md` | Client configuration options |
| `docs/Database-Configuration.md` | `Database-Configuration.md` | Database setup and configuration |
| `docs/Command-System.md` | `Command-System.md` | Slash command system guide |
| `docs/Autocomplete-System.md` | `Autocomplete-System.md` | Autocomplete functionality guide |
| `docs/API-Reference.md` | `API-Reference.md` | Complete API documentation |
| `docs/Quick-Examples.md` | `Quick-Examples.md` | Code examples and snippets |

### Navigation structure

The workflow automatically creates a sidebar navigation (`_Sidebar.md`) with the following structure:

```
# @waforix/mocha Documentation

## Quick Links
- Home
- Getting Started  
- API Reference

## Setup
- Getting Started
- Client Configuration
- Database Configuration

## Usage
- Quick Examples
- Command System
- Autocomplete System

## Reference
- API Reference
```

### Manual sync

You can manually trigger the wiki sync by:

1. Going to the Actions tab in GitHub
2. Selecting "Sync Documentation to Wiki"
3. Clicking "Run workflow"

### Local testing

Use the provided script to test the sync process locally:

```bash
# Run the simulation script
./scripts/sync-wiki.sh

# View generated files
ls temp-wiki/

# Clean up
rm -rf temp-wiki/
```

### Requirements

- Repository must have a wiki enabled
- GitHub Actions must have write access to the wiki repository
- Uses the default `GITHUB_TOKEN` (no additional setup required)

### Troubleshooting

**Wiki not updating**: 
- Check that the repository wiki is enabled in Settings
- Verify the workflow has the correct permissions
- Check the Actions logs for error messages

**Missing pages**:
- Ensure `.md` files exist in the `docs/` directory
- Check that file names don't contain special characters
- Verify the workflow completed successfully

**Navigation issues**:
- The sidebar is regenerated on each sync
- Custom sidebar modifications will be overwritten
- Edit the workflow file to customize navigation structure
