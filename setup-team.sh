#!/bin/bash

# Team Setup Script for 3-Day MVP Projects
# This script initializes the team structure based on the PROJECT-WORKFLOW-GUIDE.md

echo "🚀 Setting up your team's project structure for 3-Day MVP..."
echo "================================================"

# Function to validate input
validate_input() {
    if [[ -z "$1" ]]; then
        echo "❌ Error: Input cannot be empty. Please try again."
        return 1
    fi
    return 0
}

# Get team information
while true; do
    read -p "Enter your team name (e.g., AlphaTeam, BetaSquad): " TEAM_NAME
    if validate_input "$TEAM_NAME"; then
        # Replace spaces with hyphens and convert to lowercase for folder name
        TEAM_FOLDER=$(echo "$TEAM_NAME" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
        break
    fi
done

while true; do
    read -p "Enter team lead name: " LEAD_NAME
    if validate_input "$LEAD_NAME"; then
        break
    fi
done

while true; do
    read -p "Enter cycle number (e.g., 1, 2, 3): " CYCLE_NUM
    if validate_input "$CYCLE_NUM"; then
        break
    fi
done

while true; do
    read -p "Enter project code (e.g., MVP1, PROJ-A): " PROJECT_CODE
    if validate_input "$PROJECT_CODE"; then
        break
    fi
done

read -p "Enter project name (e.g., TaskManager, ChatBot): " PROJECT_NAME
read -p "Enter team member 1 name: " MEMBER_1
read -p "Enter team member 2 name: " MEMBER_2
read -p "Enter team member 3 name: " MEMBER_3

# Get current date
CURRENT_DATE=$(date +"%Y-%m-%d")
END_DATE=$(date -d "+2 days" +"%Y-%m-%d")

echo ""
echo "📋 Team Configuration Summary:"
echo "================================"
echo "Team Name: $TEAM_NAME"
echo "Team Folder: $TEAM_FOLDER"
echo "Lead: $LEAD_NAME"
echo "Members: $MEMBER_1, $MEMBER_2, $MEMBER_3"
echo "Cycle: $CYCLE_NUM"
echo "Project Code: $PROJECT_CODE"
echo "Project Name: $PROJECT_NAME"
echo "Start Date: $CURRENT_DATE"
echo "End Date: $END_DATE"
echo ""

read -p "Does this look correct? (y/n): " CONFIRM
if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
    echo "❌ Setup cancelled. Please run the script again."
    exit 1
fi

# Check if team folder already exists
if [[ -d "$TEAM_FOLDER" ]]; then
    echo "⚠️  Warning: Team folder '$TEAM_FOLDER' already exists."
    read -p "Do you want to overwrite it? (y/n): " OVERWRITE
    if [[ $OVERWRITE != "y" && $OVERWRITE != "Y" ]]; then
        echo "❌ Setup cancelled to avoid overwriting existing files."
        exit 1
    fi
    echo "🗑️  Removing existing folder..."
    rm -rf "$TEAM_FOLDER"
fi

# Create team folder structure
echo "📁 Creating team folder structure..."
mkdir -p "$TEAM_FOLDER"/{DOCS,src,tests}

# Check if TEAM-TEMPLATE exists
if [[ ! -d "TEAM-TEMPLATE" ]]; then
    echo "❌ Error: TEAM-TEMPLATE folder not found. Please run this script from the repository root."
    exit 1
fi

# Copy template files
echo "📄 Copying template files..."
cp TEAM-TEMPLATE/.rules.md "$TEAM_FOLDER/"
cp TEAM-TEMPLATE/Readme.md "$TEAM_FOLDER/"
cp -r TEAM-TEMPLATE/DOCS/* "$TEAM_FOLDER/DOCS/"

# Create basic source structure
echo "🔧 Setting up source code structure..."
cat > "$TEAM_FOLDER/src/README.md" << EOF
# Source Code Directory

This directory contains the main source code for the $PROJECT_NAME project.

## Structure
- Place your main application code here
- Organize by features or components as appropriate
- Follow the coding standards defined in ../.rules.md

## Getting Started
1. Set up your development environment
2. Install dependencies
3. Run the application

## Architecture
[Document your code organization here]
EOF

cat > "$TEAM_FOLDER/tests/README.md" << EOF
# Tests Directory

This directory contains all test files for the $PROJECT_NAME project.

## Test Structure
- Unit tests for individual components
- Integration tests for feature workflows
- End-to-end tests for user scenarios

## Running Tests
\`\`\`bash
# Add commands to run tests here
\`\`\`

## Test Coverage
- Target: 70%+ coverage for core functionality
- Document any untested areas and reasons
EOF

# Update template files with team information
echo "✏️  Customizing templates with team information..."

# Update main README
sed -i "s/\[PROJECT NAME\]/$PROJECT_NAME/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[TEAM NAME\]/$TEAM_NAME/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[LEAD NAME\]/$LEAD_NAME/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[MEMBER 1\]/$MEMBER_1/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[MEMBER 2\]/$MEMBER_2/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[MEMBER 3\]/$MEMBER_3/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[CYCLE NUMBER\]/$CYCLE_NUM/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[PROJECT CODE\]/$PROJECT_CODE/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[START DATE\]/$CURRENT_DATE/g" "$TEAM_FOLDER/Readme.md"
sed -i "s/\[END DATE\]/$END_DATE/g" "$TEAM_FOLDER/Readme.md"

# Update requirements document
sed -i "s/\[PROJECT NAME\]/$PROJECT_NAME/g" "$TEAM_FOLDER/DOCS/requirements-document.md"
sed -i "s/\[TEAM NAME\]/$TEAM_NAME/g" "$TEAM_FOLDER/DOCS/requirements-document.md"
sed -i "s/\[LEAD NAME\]/$LEAD_NAME/g" "$TEAM_FOLDER/DOCS/requirements-document.md"
sed -i "s/\[CYCLE NUMBER\]/$CYCLE_NUM/g" "$TEAM_FOLDER/DOCS/requirements-document.md"
sed -i "s/\[DATE\]/$CURRENT_DATE/g" "$TEAM_FOLDER/DOCS/requirements-document.md"

# Update iteration summary
sed -i "s/\[CYCLE_NUMBER\]/$CYCLE_NUM/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[PROJECT_NAME\]/$PROJECT_NAME/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[TEAM_NAME\]/$TEAM_NAME/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[LEAD_NAME\]/$LEAD_NAME/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[PROJECT_CODE\]/$PROJECT_CODE/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[START_DATE\]/$CURRENT_DATE/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[END_DATE\]/$END_DATE/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[MEMBER_1\]/$MEMBER_1/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[MEMBER_2\]/$MEMBER_2/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"
sed -i "s/\[MEMBER_3\]/$MEMBER_3/g" "$TEAM_FOLDER/DOCS/iteration-summary.md"

# Create a quick start guide
cat > "$TEAM_FOLDER/QUICK-START.md" << EOF
# Quick Start Guide - $PROJECT_NAME

## Team Information
- **Team:** $TEAM_NAME
- **Lead:** $LEAD_NAME
- **Members:** $MEMBER_1, $MEMBER_2, $MEMBER_3
- **Cycle:** $CYCLE_NUM
- **Project Code:** $PROJECT_CODE
- **Timeline:** $CURRENT_DATE to $END_DATE (3 days)

## Immediate Next Steps
1. **Team Meeting** - Review requirements document together
2. **Task Breakdown** - Update Readme.md with specific tasks
3. **Self-Assignment** - Each member claims tasks they want to work on
4. **Environment Setup** - Get development environment ready
5. **Start Coding** - Begin with foundational components

## Important Files
- \`Readme.md\` - Main project documentation (keep this updated!)
- \`DOCS/requirements-document.md\` - Fill this out in your team meeting
- \`DOCS/iteration-summary.md\` - Update daily with progress
- \`.rules.md\` - Add any AI/automation rules specific to your project

## Daily Workflow
### Day 1 (Today): Foundation
- [ ] Complete requirements document
- [ ] Break down tasks in README
- [ ] Set up project structure
- [ ] Begin core development

### Day 2: Core Development  
- [ ] Implement main features
- [ ] Work on integrations
- [ ] Regular team check-ins

### Day 3: Polish & Present
- [ ] Final integration
- [ ] Testing and bug fixes
- [ ] Complete documentation
- [ ] Prepare presentation

## Branch Naming Convention
Use: \`${LEAD_NAME}_${TEAM_NAME}_${CYCLE_NUM}_${PROJECT_CODE}\`

## Commit Message Format
\`[${PROJECT_CODE}] Your commit message here\`

Good luck with your 3-day MVP! 🚀
EOF

echo ""
echo "✅ Team structure created successfully!"
echo "================================"
echo "📁 Your team folder: $TEAM_FOLDER"
echo "📝 Files created:"
echo "   ├── Readme.md (main documentation)"
echo "   ├── .rules.md (AI/automation rules)" 
echo "   ├── QUICK-START.md (immediate next steps)"
echo "   ├── DOCS/"
echo "   │   ├── requirements-document.md"
echo "   │   └── iteration-summary.md"
echo "   ├── src/ (source code)"
echo "   └── tests/ (test files)"
echo ""
echo "🎯 Immediate Next Steps:"
echo "   1. cd $TEAM_FOLDER"
echo "   2. Review QUICK-START.md"
echo "   3. Fill out DOCS/requirements-document.md in your team meeting"
echo "   4. Break down tasks in Readme.md"
echo "   5. Start coding!"
echo ""
echo "📊 Recommended Branch Name:"
echo "   ${LEAD_NAME}_${TEAM_NAME}_${CYCLE_NUM}_${PROJECT_CODE}"
echo ""
echo "🎉 Happy coding! Remember: Focus on MVP, collaborate, and deliver in 3 days!"
