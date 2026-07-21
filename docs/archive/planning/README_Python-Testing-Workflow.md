# Python Testing Workflow — Cursor Terminal Friendly

This bundle gives you a **clean, repeatable way** to run Python from Cursor’s terminal without mixing up shell and Python syntax.

## TL;DR
- Use a **virtual environment** for clean deps.
- Use a **playground** file for quick tests.
- Run via **tasks** (VS Code/Cursor) or small shell/PowerShell scripts.
- Don’t paste Python in the shell; use the Python REPL or a `.py` file.

---

## 1) Create & Activate a Virtual Environment

### macOS / Linux (bash/zsh)
```bash
python3 -m venv .venv
source .venv/bin/activate
python -V
pip -V
```

### Windows (PowerShell)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -V
pip -V
```

> Tip: When finished, run `deactivate` to exit the venv.

---

## 2) Install Optional Dev Tools
```bash
pip install -r requirements.txt
```
- `ipython` — a friendly Python REPL with history & autocomplete.

---

## 3) Quick Tests (Three Options)

### Option A — Python REPL (interactive)
```bash
python
>>> file_path = "plan.txt"
>>> print(f"Plan file at {file_path} updated successfully.")
>>> exit()
```

### Option B — Run a Script
```bash
python playground.py --file plan.txt
```

### Option C — Use Tasks (Cursor/VS Code Task Runner)
Open the command palette and run: **Tasks: Run Task → Run Playground (Python)**

---

## 4) Included Files

```
.
├─ README_Python-Testing-Workflow.md  # this file
├─ playground.py                      # safe sandbox for experiments
├─ run_playground.sh                  # macOS/Linux runner
├─ run_playground.ps1                 # Windows PowerShell runner
├─ requirements.txt                   # optional dev deps (ipython)
├─ .vscode/
│  └─ tasks.json                      # one-click run task for Cursor/VS Code
└─ .gitignore                         # basic Python ignores
```

---

## 5) Common Gotchas (and fixes)

**Problem:** Terminal shows `dquote>` and seems “stuck”.  
**Cause:** You pasted Python (with quotes) into **bash/zsh**, which expects shell syntax.  
**Fix:** Press **Ctrl+C** to cancel. Use `python` (REPL) or run a `.py` file.

**Problem:** `command not found: python` on macOS.  
**Fix:** Try `python3` or set up a venv and run `python` from there.

**Problem:** Imports fail even after `pip install`.  
**Fix:** You probably installed outside your venv. Activate venv and re-install.

---

## 6) Pro Tips

- Keep a dedicated `playground.py` for experiments so your main app stays clean.
- Use `argparse` flags to toggle behaviors quickly.
- Add more **Tasks** (test, lint, format) to automate your dev loop.

---

## 7) Example Commands

```bash
# macOS/Linux
chmod +x run_playground.sh
./run_playground.sh --file plan.txt

# Windows
./run_playground.ps1 -File plan.txt
```

Happy hacking — and no more `dquote>` 🙂
