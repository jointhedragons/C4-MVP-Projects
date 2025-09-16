# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Purpose

This is a **3-day MVP development repository** supporting teams of 4 members (1 lead + 3 developers) working on rapid prototyping projects. Each team follows a structured workflow to deliver functional MVPs within a 72-hour timeframe.

## Key Commands

### Team Initialization
```bash
# Set up a new team structure (interactive script)
./setup-team.sh

# Create team branch after setup
git checkout -b [LEAD]_[TEAM]_[CYCLE]_[PROJECT_CODE]
```

### Repository Navigation
```bash
# View all team projects
ls -la */

# Check current team structure
find . -name "Readme.md" -path "*/[team-name]/*"
find . -name "QUICK-START.md" -path "*/[team-name]/*"
```

### Development Workflow
```bash
# Daily team workflow
git checkout [team-branch]
git pull origin [team-branch]
# ... development work ...
git add .
git commit -m "[PROJECT_CODE] Description of changes"
git push origin [team-branch]
```

## Architecture Overview

### Repository Structure
- **Root Level**: Project templates, workflow guides, and team initialization scripts
- **TEAM-TEMPLATE/**: Template files copied during team setup
- **[team-name]/**: Individual team folders with complete project structure
- **setup-team.sh**: Interactive script for creating team environments

### Team Project Structure
Each team folder follows a standardized pattern:
```
[team-name]/
├── .rules.md              # AI/automation instructions
├── Readme.md             # Main documentation (200-400 lines max)
├── QUICK-START.md        # Auto-generated next steps guide
├── DOCS/                 # Documentation folder
│   ├── requirements-document.md
│   └── iteration-summary.md
├── src/                  # Source code
└── tests/                # Test files
```

### Workflow Architecture
1. **Pre-Development**: Team meeting → Requirements → Task breakdown → Self-assignment
2. **Day 1**: Foundation and project setup
3. **Day 2**: Core development and integration
4. **Day 3**: Polish, testing, and presentation prep

### Branching Strategy
- **Main branch**: Protected, no direct pushes
- **Team branches**: Format `[LEAD]_[TEAM]_[CYCLE]_[PROJECT_CODE]`
- **Feature branches**: Optional sub-branches from team branch

### Documentation Requirements
- **Readme.md**: Complete thought process documentation (200-400 lines)
- **.rules.md**: Project-specific AI model constraints and coding standards
- **Daily updates**: Iteration summaries and progress tracking
- **Commit format**: `[PROJECT_CODE] Description of changes`

## Key Project Files

### Essential References
- `PROJECT-WORKFLOW-GUIDE.md`: Complete 3-day development workflow
- `CONTRIBUTING.md`: Repository collaboration guidelines
- `TEAM-TEMPLATE/`: Base templates for all team projects

### Team-Specific Files
- `[team]/Readme.md`: Primary documentation with architecture decisions
- `[team]/.rules.md`: AI model instructions and coding standards
- `[team]/QUICK-START.md`: Auto-generated immediate next steps
- `[team]/DOCS/requirements-document.md`: Business and technical specifications

## Development Constraints

### Time Constraints
- **3-day timeline**: All development must fit within 72 hours
- **MVP focus**: Prioritize functionality over perfection
- **Realistic scoping**: Tasks must be achievable within team capabilities

### Team Constraints
- **4-person teams**: 1 lead + 3 developers
- **Self-assignment**: Team members choose tasks based on strengths
- **Collaboration focus**: Support each other and share learnings

### Quality Standards
- **Documentation first**: All architectural decisions must be documented
- **Working MVP**: Functional prototype over perfect code
- **Learning emphasis**: Experience and knowledge sharing prioritized

## AI Model Guidelines

When working with team projects:
- Follow the specific `.rules.md` file in each team folder
- Respect the 3-day timeline constraints in all suggestions
- Prioritize MVP functionality over comprehensive solutions
- Generate code compatible with the team's chosen tech stack
- Maintain consistency with existing architectural decisions
- Update documentation when making significant changes

## Common Development Patterns

### Project Initialization
1. Run `./setup-team.sh` to create team structure
2. Fill out requirements document in team meeting
3. Break down tasks in main Readme.md
4. Create team branch and begin development

### Daily Workflow
1. Morning: Pull latest changes, review progress
2. Development: Work on assigned tasks with regular commits
3. Evening: Push changes, update iteration summary

### Integration Process
- Work within team branch throughout development
- Create pull request only at end of 3-day cycle
- Merge to main only after successful MVP completion

## Success Metrics

A successful project delivers:
- Functional MVP within 3-day timeline
- Complete documentation following the template structure
- All team members contributing meaningfully
- Valuable learning experience for entire team
- Clean, organized codebase ready for presentation

## Reference Material

Based on workflow described in: http://www.youtube.com/watch?v=oc4KHuIgYyw

Key insight: This repository emphasizes rapid prototyping, collaborative learning, and structured documentation over traditional long-term development practices.
