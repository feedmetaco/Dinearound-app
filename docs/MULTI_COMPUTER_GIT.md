# Work from Multiple Computers

## One-time per Mac
```bash
ssh -T git@github.com
git clone git@github.com:feedmetaco/Dinearound-app.git
cd Dinearound-app
git config pull.rebase true
```

## Daily
```bash
git pull --rebase
# work...
git add -A
git commit -m "describe change"
git push
```

## Switch Macs
- Finish on A: `git push`
- Start on B: `git pull --rebase`

## Troubleshooting
- Permission denied (publickey): add SSH key in GitHub Settings → SSH and GPG keys, then `ssh -T git@github.com`.
- Merge conflicts: fix files, then
```bash
git add -A
git rebase --continue   # or git commit, if it was a merge
```
