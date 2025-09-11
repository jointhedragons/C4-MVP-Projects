# Three-Day MVP Project Workflow Guide

## Overview
This guide implements the workflow described in the instructional video for managing three-day MVP projects with teams of 4 members (1 lead + 3 developers).

**Video Reference:** http://www.youtube.com/watch?v=oc4KHuIgYyw

## Team Structure
- **Team Lead:** Oversees project, breaks down tasks, manages workflow
- **3 Team Members:** Rotate through different technologies and projects for diverse experience

## Workflow Steps

### Pre-Development Phase

#### 1. Team Meeting (Day 0 or Day 1 Morning) [01:49]
- Align on project objectives
- Discuss ideas and approach
- Create shared understanding

#### 2. Requirements Document Creation [02:05]
- Document business aspects
- Define core features
- Specify AI integration requirements (if applicable)
- Set realistic scope for 3-day timeline

#### 3. Task Breakdown [04:10]
- Lead breaks project into small, manageable tasks
- Consider team capabilities and 3-day constraint
- Be realistic and reasonable with expectations

#### 4. Team Approval & Self-Assignment [05:43]
- Team reviews and approves task breakdown
- Members self-assign tasks based on strengths and interests
- Ensure ownership and accountability

### Development Phase (Days 1-3)

#### Day 1: Foundation
- Set up repository structure
- Initialize project scaffolding
- Begin core feature development

#### Day 2: Core Development
- Implement main features
- Integration work
- Regular check-ins and adjustments

#### Day 3: Integration & Polish
- Final integration
- Testing and bug fixes
- Documentation completion
- Presentation preparation

## Repository Management [08:00]

### Branching Strategy
- **Main Branch:** Protected - no direct pushes allowed
- **Team Branches:** Each team works in dedicated branch
- **Naming Convention:** `LEAD_TEAM_Cycle_number_Project_code`

### Required Folder Structure [10:08]
```
[TEAM-NAME]/
├── .rules.md              # AI model instructions
├── DOCS/                  # Documentation folder
│   ├── requirements-document.md
│   ├── iteration-summary.md
│   └── [other-docs]
├── Readme.md             # Core documentation (200-400 lines)
├── src/                  # Source code
└── tests/                # Test files
```

### Documentation Requirements

#### .rules.md [10:08]
- Instructions for AI models
- Project-specific guidelines
- Coding standards

#### DOCS/ Folder [10:09]
- Iteration summaries
- Technical specifications
- Context preservation
- General project information

#### Readme.md [10:09]
- Complete thought process documentation
- Architecture decisions
- Workflow explanation
- Concise (200-400 lines maximum)

## Best Practices

### Task Management
- Keep tasks small and achievable
- Regular progress check-ins
- Adjust scope as needed
- Maintain team communication

### Code Quality
- Follow established coding standards
- Include proper documentation
- Test critical functionality
- Maintain clean, readable code

### Team Collaboration
- Respect individual strengths
- Support team members
- Share knowledge and learnings
- Maintain positive team dynamics

## Success Metrics
- Functional MVP delivered on time
- All team members contribute meaningfully
- Documentation is complete and clear
- Team gains valuable experience
- Project meets defined requirements

## Common Pitfalls to Avoid
- Over-scoping for 3-day timeline
- Neglecting documentation
- Poor task breakdown
- Lack of regular communication
- Perfectionism over functionality

## Getting Started
1. Use the `setup-team.sh` script to initialize your team structure
2. Fill out the requirements document in your team meeting
3. Break down tasks and assign them
4. Start coding with the 3-day timeline in mind

Remember: The goal is to deliver a working MVP in 3 days while providing valuable learning experiences for all team members.
