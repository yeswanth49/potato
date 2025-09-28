# Cursor Rules Usage Guide

## Overview

This project includes automated documentation maintenance through Cursor rules. The `.cursorrules` file contains intelligent rules that monitor architectural changes and automatically update the `docs/architecture.md` file.

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

## Rule Configuration

The cursor rules are configured with the following settings:

- **Architectural Threshold**: 5 (minimum score for auto-update)
- **Review Threshold**: 9 (score requiring human review)
- **Update Frequency**: Immediate
- **Validation Level**: Strict

## Troubleshooting

### If Rules Don't Trigger

1. Check that the `.cursorrules` file exists in the project root
2. Verify that Cursor has rules enabled in settings
3. Ensure the change meets the architectural significance threshold

### If Documentation Gets Corrupted

1. The system automatically creates backups before updates
2. You can restore from backup if needed
3. Manual edits always take precedence over automated updates

### Disabling Rules Temporarily

If you need to disable the rules temporarily:

1. Rename `.cursorrules` to `.cursorrules.disabled`
2. Make your changes
3. Rename back to `.cursorrules` to re-enable

## Best Practices

1. **Review Automated Updates**: Periodically check that automated updates are accurate
2. **Manual Overrides**: Feel free to manually edit the documentation - the rules will preserve your changes
3. **Architectural Changes**: For major architectural changes, consider updating the rules themselves
4. **Testing**: Test rule functionality when making significant project changes

## Support

For issues with the cursor rules system:

1. Check the Cursor documentation for rules syntax
2. Validate the `.cursorrules` file syntax
3. Review the architectural significance scoring in the rules file

---

**Note**: This documentation maintenance system is designed to keep the architecture documentation current with minimal manual intervention while preserving human-authored content.
