# Cursor Rules Usage Guide

## Overview

This project includes automated documentation maintenance and Git operations through Cursor rules. The `.cursorrules` file contains intelligent rules that monitor architectural changes and automatically:

1. **Update documentation** in `docs/architecture.md`
2. **Commit and push changes** to enable CodeRabbit reviews
3. **Create pull requests** for major architectural changes

## How It Works

### Automatic Triggers

The cursor rules automatically activate when you make the following types of changes:

1. **Component Changes**
   - Adding new React components
   - Modifying existing component interfaces
   - Changing component relationships

2. **Dependency Updates**
   - Installing new packages (`package.json` changes)
   - Updating existing dependencies
   - Removing unused dependencies

3. **Structure Changes**
   - Creating new directories
   - Moving files between folders
   - Reorganizing project structure

4. **Configuration Updates**
   - Modifying Next.js config
   - Updating TypeScript config
   - Changing build configurations

### What Gets Updated

When architectural changes are detected, the following documentation sections are automatically updated:

- **Technology Stack**: New dependencies and versions
- **Project Structure**: Directory tree and file descriptions
- **Component Architecture**: Component relationships and diagrams
- **Data Flow Architecture**: State management patterns
- **Performance Optimizations**: New optimization techniques

## Manual Testing

You can test the cursor rules functionality by:

1. **Adding a new component**:
   ```bash
   # Create a new component file
   touch components/new-feature.tsx
   ```

2. **Installing a new dependency**:
   ```bash
   # Add a new package
   pnpm add some-new-library
   ```

3. **Modifying project structure**:
   ```bash
   # Create a new directory
   mkdir components/sections
   ```

After making these changes, check `docs/architecture.md` to see if the relevant sections were updated automatically.

## Git Automation Features

### Automatic Commit & Push (Score 7-10)

For medium-impact changes, the rules automatically:

1. **Stage all changes** (`git add .`)
2. **Generate descriptive commit messages** based on the type of changes
3. **Commit changes** to the local repository
4. **Push to origin branch** to trigger CodeRabbit review

**Examples of triggering changes:**
- Creating new components (`components/new-feature.tsx`)
- Adding new hooks (`hooks/useCustomHook.ts`)
- Modifying configuration files (`next.config.mjs`, `tsconfig.json`)
- Making significant component updates

### Automatic PR Creation (Score 11+)

For major architectural changes, the rules automatically:

1. **Ensure all changes are committed** and pushed
2. **Create a pull request** targeting the main branch
3. **Generate detailed PR descriptions** with impact assessment
4. **Add appropriate labels** (`auto-generated`, `architectural-change`)
5. **Notify you** with the PR link for CodeRabbit review

**Examples of triggering changes:**
- Adding new pages (`app/new-page/page.tsx`)
- Major dependency updates (`package.json`)
- Removing components or restructuring
- Cross-component architectural changes

### Prerequisites

**For PR Creation:**
- **GitHub CLI** must be installed and authenticated
- Repository must be hosted on GitHub
- Current branch must not be `main` (for safety)

**For All Git Operations:**
- Repository must be a valid Git repository
- Remote origin must be configured
- User must have push permissions to the repository

## Rule Configuration

The cursor rules are configured with the following settings:

- **Architectural Threshold**: 5 (minimum score for auto-update)
- **Review Threshold**: 9 (score requiring human review)
- **Git Commit Threshold**: 7 (minimum score for auto-commit & push)
- **PR Creation Threshold**: 11 (minimum score for auto-PR creation)
- **Update Frequency**: Immediate
- **Validation Level**: Strict
- **Git Auto Push**: Enabled
- **PR Auto Create**: Enabled
- **GitHub CLI Required**: Yes

## Troubleshooting

### If Rules Don't Trigger

1. Check that the `.cursorrules` file exists in the project root
2. Verify that Cursor has rules enabled in settings
3. Ensure the change meets the architectural significance threshold

### If Documentation Gets Corrupted

1. The system automatically creates backups before updates
2. You can restore from backup if needed
3. Manual edits always take precedence over automated updates

### Git Automation Issues

**If auto-commit/push fails:**
1. Check that you're in a valid Git repository (`git status`)
2. Verify remote origin is configured (`git remote -v`)
3. Ensure you have push permissions to the repository
4. Check if there are uncommitted changes blocking the operation

**If PR creation fails:**
1. Install GitHub CLI: `brew install gh` (macOS) or download from GitHub
2. Authenticate with GitHub: `gh auth login`
3. Ensure you're not on the main branch (safety feature)
4. Verify the repository is hosted on GitHub

**If rules don't trigger Git operations:**
1. Verify the architectural significance score meets thresholds (7+ for commit, 11+ for PR)
2. Check that the changed files are not in exclusion patterns
3. Ensure Cursor has the necessary permissions to run Git commands

### Disabling Rules Temporarily

If you need to disable the rules temporarily:

1. Rename `.cursorrules` to `.cursorrules.disabled`
2. Make your changes
3. Rename back to `.cursorrules` to re-enable

**To disable only Git automation:**
1. Open `.cursorrules`
2. Set `gitAutoPush: false` and `prAutoCreate: false` in ruleConfig
3. Restart Cursor or reload the rules

## Best Practices

1. **Review Automated Updates**: Periodically check that automated updates are accurate
2. **Manual Overrides**: Feel free to manually edit the documentation - the rules will preserve your changes
3. **Architectural Changes**: For major architectural changes, consider updating the rules themselves
4. **Testing**: Test rule functionality when making significant project changes

### Git Automation Best Practices

1. **Work on Feature Branches**: Always work on feature branches, not main, to allow PR creation
2. **Review Auto-Generated PRs**: Even auto-generated PRs should be reviewed before merging
3. **Check CodeRabbit Reviews**: Use the automated PR creation to get consistent CodeRabbit reviews
4. **Monitor Thresholds**: Adjust significance thresholds if rules trigger too frequently or infrequently
5. **Git Hygiene**: The automation helps maintain good Git practices with descriptive commits

### Workflow Recommendations

1. **Small Changes**: Let the rules handle documentation updates automatically
2. **Medium Changes**: Let auto-commit/push trigger CodeRabbit reviews on your branch
3. **Major Changes**: Use auto-PR creation to get thorough reviews before merging to main
4. **Emergency Changes**: Disable rules temporarily if you need to make urgent changes without automation

## Support

For issues with the cursor rules system:

1. Check the Cursor documentation for rules syntax
2. Validate the `.cursorrules` file syntax
3. Review the architectural significance scoring in the rules file

### Git Automation Support

**Git Operations:**
- Ensure Git is properly installed and configured
- Check repository permissions and remote access
- Verify branch naming conventions

**PR Creation:**
- Confirm GitHub CLI installation: `gh --version`
- Validate authentication: `gh auth status`
- Check repository hosting and permissions

**CodeRabbit Integration:**
- Verify CodeRabbit is enabled for your repository
- Check that pushes to branches trigger CodeRabbit reviews
- Confirm PR creation triggers the full CodeRabbit review suite

---

**Note**: This documentation maintenance system is designed to keep the architecture documentation current with minimal manual intervention while preserving human-authored content.
