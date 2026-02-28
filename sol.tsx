{
{
  "scripts": {
    "agent:healer": "playwright agents run --agent=healer --prompt=specs/prompt.md",
    "agent:healer:all": "playwright agents run --agent=healer --spec=specs --prompt=specs/prompt.md"
  }
}

In .vscode/tasks.json:

{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Agent: Healer — Current Spec",
      "type": "shell",
      "command": "pnpm",
      "args": [
        "agent:healer",
        "--",
        "--spec=${file}"
      ],
      "problemMatcher": []
    },
    {
      "label": "Agent: Healer — All Specs",
      "type": "shell",
      "command": "pnpm",
      "args": [
        "agent:healer:all"
      ],
      "problemMatcher": []
    }
  ]
}