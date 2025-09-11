# Contributing Guidelines

## Overview
This repository supports multiple teams working on 3-day MVP projects simultaneously. Follow these guidelines to maintain organization and prevent conflicts.

## Team Setup Process

### 1. Initialize Your Team
```bash
./setup-team.sh
```

### 2. Create Your Team Branch
```bash
git checkout -b [LEAD]_[TEAM]_[CYCLE]_[PROJECT_CODE]
```
Example: `git checkout -b john_alpha_1_chat`

### 3. Work in Your Team Folder
- All your code goes in `[your-team-folder]/`
- Never modify other teams' folders
- Don't change the TEAM-TEMPLATE/ folder

## Branching Strategy

### Main Branch
- **Protected** - no direct pushes allowed
- Contains stable, reviewed code only
- Updated only through pull requests

### Team Branches
- Each team works in their own branch
- Naming convention: `[LEAD]_[TEAM]_[CYCLE]_[PROJECT_CODE]`
- Branch from `main` for each new project

### Feature Branches (Optional)
If your team wants to use feature branches within your team branch:
```bash
git checkout -b feature/[feature-name] [your-team-branch]
```

## Commit Guidelines

### Commit Message Format
```
[PROJECT_CODE] Brief description of changes

Optional longer description explaining what and why.
```

Examples:
- `[CHAT1] Add user authentication system`
- `[TASK2] Fix bug in task deletion endpoint`
- `[AI3] Implement chatbot response logic`

### What to Commit
- Source code in your team's `src/` folder
- Documentation updates
- Test files
- Configuration files (without secrets)

### What NOT to Commit
- Secret keys or passwords
- Personal IDE settings (use global .gitignore)
- Dependencies (node_modules, venv, etc.)
- Temporary files
- Files outside your team folder

## Daily Workflow

### Morning Routine
```bash
git checkout [your-team-branch]
git pull origin [your-team-branch]
# Start working
```

### Throughout the Day
```bash
# Commit frequently with meaningful messages
git add .
git commit -m "[PROJECT_CODE] Description of changes"
git push origin [your-team-branch]
```

### End of Day
```bash
# Make sure all work is pushed
git push origin [your-team-branch]
# Update your iteration summary
```

## Documentation Requirements

### Must Update Daily
- `Readme.md` - Your main project documentation
- `DOCS/iteration-summary.md` - Daily progress tracking

### Keep Current
- `.rules.md` - Any AI/automation rules
- `DOCS/requirements-document.md` - Project specifications

### Code Documentation
- Comment your code clearly
- Include README files in subdirectories
- Document any setup or deployment steps

## Pull Request Process

### When to Create a PR
- **End of 3-day cycle** - merge your MVP to main
- **Major milestone** - if you want to merge partial work
- **Collaboration** - if you need to share code with another team

### PR Requirements
- [ ] All tests pass (if you have tests)
- [ ] Documentation is updated
- [ ] No secrets or sensitive data included
- [ ] Code follows your team's standards
- [ ] PR description explains what was built

### PR Template
```markdown
## Project Summary
- **Team:** [Team Name]
- **Lead:** [Lead Name] 
- **Cycle:** [Cycle Number]
- **Project Code:** [Project Code]

## What Was Built
- [Feature 1]: Brief description
- [Feature 2]: Brief description

## How to Test
1. Step 1
2. Step 2

## Documentation
- [ ] Readme.md updated
- [ ] Requirements documented
- [ ] Code commented

## Next Steps
- [What would you do next if you had more time]
```

## File Organization

### Your Team's Folder Structure
```
[team-name]/
├── .rules.md              # AI/automation rules
├── Readme.md             # Main documentation (200-400 lines)
├── QUICK-START.md        # Generated quick start guide
├── DOCS/                 # All documentation
│   ├── requirements-document.md
│   └── iteration-summary.md
├── src/                  # Source code
│   ├── README.md
│   └── [your code here]
└── tests/                # Test files
    ├── README.md
    └── [your tests here]
```

### Keep It Organized
- Group related files together
- Use clear, descriptive names
- Include README files in each directory
- Remove unused files

## Collaboration Guidelines

### With Your Team
- Communicate before making major changes
- Review each other's code informally
- Share knowledge and help teammates
- Keep documentation updated for the team

### With Other Teams
- Don't modify other teams' folders
- Share learnings in team presentations
- Offer help if other teams are struggling
- Learn from other teams' approaches

### With Repository Maintainers
- Follow the established structure
- Report issues with templates or scripts
- Suggest improvements through issues/PRs
- Help improve the process for future teams

## Common Issues and Solutions

### Merge Conflicts
Usually happen when multiple people edit the same file:
```bash
git pull origin [your-team-branch]
# Fix conflicts in your editor
git add .
git commit -m "[PROJECT_CODE] Resolve merge conflicts"
```

### Accidentally Modified Wrong Folder
```bash
git checkout -- [file-you-shouldn't-have-changed]
```

### Need to Rename Your Team Branch
```bash
git branch -m [old-name] [new-name]
git push origin -u [new-name]
git push origin --delete [old-name]
```

### Forgot to Push End of Day
```bash
git log --oneline  # See your unpushed commits
git push origin [your-team-branch]
```

## Quality Standards

### Code Quality
- Write clean, readable code
- Include comments for complex logic
- Follow language-specific conventions
- Remove debug statements before committing

### Documentation Quality
- Keep README concise but complete
- Update docs when code changes
- Include examples where helpful
- Write for someone who wasn't on your team

### Project Quality
- Focus on working MVP functionality
- Include basic error handling
- Test your main user flows
- Document known limitations

## Getting Help

### Technical Issues
1. Check with your team first
2. Look at other teams' approaches
3. Ask in team presentations
4. Create an issue in the repository

### Process Issues
1. Review this contributing guide
2. Check the PROJECT-WORKFLOW-GUIDE.md
3. Ask your team lead
4. Reach out to repository maintainers

## Success Criteria

By following these guidelines, your team should achieve:
- ✅ Functional MVP delivered on time
- ✅ Clean, organized repository structure  
- ✅ Complete documentation
- ✅ Positive team collaboration experience
- ✅ Learning objectives met
- ✅ No conflicts with other teams

---

Remember: The goal is learning and delivering MVPs, not perfect code. Focus on functionality, collaboration, and documentation!
