# Dinearound App

Simple starter for iOS app.

## Setup
- Xcode on macOS
- Git (SSH recommended)

## Workflow
- git pull --rebase before starting
- commit small, push often

## Build
Open the Xcode project in `ios/` when ready.


## Work from multiple computers (Mac mini, MacBook)

### One-time on each Mac
```bash
# 1) Test SSH to GitHub (after adding your SSH key in GitHub Settings)
ssh -T git@github.com

# 2) First-time clone on that Mac
git clone git@github.com:feedmetaco/Dinearound-app.git
cd Dinearound-app

# 3) Safer pulls (avoid messy merges)
git config pull.rebase true
```

### Daily workflow
```bash
# Before you start work on a Mac
git pull --rebase

# After you finish work
git add -A
git commit -m "describe what you changed"
git push
```

### Switching between Macs
- Finish on Mac A: commit and `git push`.
- Start on Mac B: `git pull --rebase`, then continue.

### Troubleshooting
- Permission denied (publickey): add your SSH key in GitHub → Settings → SSH and GPG keys, then `ssh -T git@github.com`.
- Merge conflicts on pull: run `git status`, open conflicting files, fix them, then:
```bash
git add -A
git rebase --continue   # if you were rebasing
# or if a merge happened
# git commit
```
