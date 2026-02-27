{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"],
      "env": {
        "PLAYWRIGHT_CHROMIUM_ARGS": "--disable-features=BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessChecks"
      }
    }
  },
  "inputs": []
}