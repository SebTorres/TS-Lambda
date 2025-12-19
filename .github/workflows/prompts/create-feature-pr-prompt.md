---
description: Create a feature PR with automatic Jira integration
name: create-feature-pr
argument-hint: "issue-key branch-name"
agent: agent
tools:
  - atlassian/atlassian-mcp-server 
  - io.github.github/github-mcp-server 
---

# Create Feature Pull Request

Create a comprehensive pull request for issue **${input:issueKey}** from branch **${input:branchName}**.

## Steps to Execute:

### 1. Gather Issue Information
Use #tool:mcp_atlassian_atl_getJiraIssue to fetch details for ${input:issueKey}:
- Get issue summary and description
- Extract acceptance criteria
- Note current status and assignee

### 2. Create GitHub Pull Request
Use #tool:github to:
- Create PR with title format: `[${input:issueKey}] {issue-summary}`
- Generate description including:
## Jira Issue

[https://jobsityapps.atlassian.net/browse/${input:issueKey}](vscode-file://vscode-app/snap/code/215/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html)

## Description

{copy issue description}

## Acceptance Criteria

{copy acceptance criteria from Jira}

## Code Changes

{analyze git diff and summarize changes}

## Testing Checklist

- [ ]  Unit tests added/updated
- [ ]  Integration tests pass
- [ ]  Manual testing completed
- [ ]  Code review requested

```
### 3. Link PR to Jira
Use #tool:mcp_atlassian_atl_addCommentToJiraIssue to add:
- Comment with PR link
- Update issue with GitHub remote link
- Transition to "In Review" status

## Code Analysis Context
Analyze these Coffee Shop API files for context:
- [createCoffee.ts](../src/services/createCoffee.ts)
- [getCoffee.ts](../src/services/getCoffee.ts) 
- [updateCoffee.ts](../src/services/updateCoffee.ts)
- [deleteCoffee.ts](../src/services/deleteCoffee.ts)