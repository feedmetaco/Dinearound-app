
# 🐳 Setting Up Docker + MCP Dev Environment on macOS

This guide walks you through installing Docker Desktop and setting up a local MCP (Multi-Agent Coding Playground) to allow collaboration between Claude, ChatGPT, Cursor, and other agents on a shared app project.

---

## ✅ Step 1: Install Docker Desktop

1. Go to [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Download the macOS version (Apple Silicon or Intel)
3. Open the `.dmg` file and drag Docker to Applications
4. Launch Docker Desktop and follow setup prompts
5. Verify Docker installation via Terminal:
    ```bash
    docker --version
    docker compose version
    ```
6. Run test container:
    ```bash
    docker run hello-world
    ```

---

## ✅ Step 2: Prepare MCP Directory Structure

1. In your home directory, create a folder:
    ```bash
    mkdir -p ~/dinearound-dev/{workspace,agents}
    cd ~/dinearound-dev
    ```

2. Inside `workspace`, this is where your actual app project lives:
    ```plaintext
    workspace/
    ├── App/           ← SwiftUI/Xcode project
    ├── Docs/          ← App Store text, roadmaps
    └── Notes/         ← AI notes and prompts
    ```

3. Optional: create a Git repo inside `workspace/App`

---

## ✅ Step 3: Create Basic Docker Compose File

Save this as `docker-compose.yml` in `~/dinearound-dev/`:

```yaml
version: '3.9'
services:
  claude-agent:
    image: ubuntu:22.04
    container_name: claude_agent
    volumes:
      - ./workspace:/workspace
    command: tail -f /dev/null

  chatgpt-agent:
    image: ubuntu:22.04
    container_name: chatgpt_agent
    volumes:
      - ./workspace:/workspace
    command: tail -f /dev/null
```

Start the containers:
```bash
docker compose up -d
```

---

## ✅ Step 4: Future Options

| Add-On | Purpose |
|--------|---------|
| VS Code Server | Edit project directly from browser inside Docker |
| Swift Dev Container | Add Swift/Xcode CLI tools for builds/tests |
| GitHub Sync | Push/pull project remotely |
| Claude Auto-Writer | Simulate Claude generating code into workspace |

---

## ✅ You’re Ready

Your shared workspace is now accessible by all agents and tools in your dev setup.  
Cursor + Claude + ChatGPT can all target `/workspace` for structured collaboration.
