const fs = require("node:fs");
const path = require("node:path");

const ENV_FILE_PATH = path.join(process.cwd(), ".env");

function loadEnvFile() {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    return;
  }

  const envContent = fs.readFileSync(ENV_FILE_PATH, "utf-8");
  const envLines = envContent.split(/\r?\n/);

  for (const line of envLines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, "$1");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getConfig() {
  loadEnvFile();

  return {
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
    port: Number(process.env.PORT || 3000),
    cacheTtlInMs: 10 * 60 * 1000,
    rateLimitMaxRequests: 5,
    rateLimitWindowInMs: 60 * 1000
  };
}

module.exports = {
  getConfig
};
