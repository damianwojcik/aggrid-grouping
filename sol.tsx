{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "false",
        "PLAYWRIGHT_LAUNCH_OPTIONS": "{\"args\":[\"--disable-features=PrivateNetworkAccessChecks,BlockInsecurePrivateNetworkRequests\"]}"
      }
    }
  },
  "inputs": []
}