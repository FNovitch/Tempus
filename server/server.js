const http = require("node:http");

const { getConfig } = require("./config");
const { MemoryCache } = require("./cache");
const { RateLimiter } = require("./rate-limiter");
const { serveStaticFile } = require("./static");
const { fetchWeatherByCity } = require("./weather-service");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function normalizeCityName(city) {
  return city.trim().toLowerCase();
}

function createServer() {
  const config = getConfig();
  const cache = new MemoryCache(config.cacheTtlInMs);
  const rateLimiter = new RateLimiter(
    config.rateLimitMaxRequests,
    config.rateLimitWindowInMs
  );

  return http.createServer(async (request, response) => {
    if (!request.url || !request.method) {
      sendJson(response, 400, { message: "Requisicao invalida." });
      return;
    }

    const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

    if (request.method === "GET" && requestUrl.pathname === "/api/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/weather") {
      const city = requestUrl.searchParams.get("city") || "";
      const clientIp = request.socket.remoteAddress || "unknown";
      const rateLimitResult = rateLimiter.check(clientIp);

      if (!rateLimitResult.allowed) {
        sendJson(response, 429, {
          message: "Muitas consultas em pouco tempo. Tente novamente em instantes."
        });
        return;
      }

      if (!city.trim()) {
        sendJson(response, 400, { message: "Informe uma cidade para a busca." });
        return;
      }

      if (!config.openWeatherApiKey) {
        sendJson(response, 500, {
          message: "A chave da OpenWeather nao foi configurada no servidor."
        });
        return;
      }

      const cacheKey = normalizeCityName(city);
      const cachedWeather = cache.get(cacheKey);
      if (cachedWeather) {
        sendJson(response, 200, {
          source: "cache",
          data: cachedWeather
        });
        return;
      }

      try {
        const weatherResult = await fetchWeatherByCity(city, config.openWeatherApiKey);
        if (!weatherResult.ok) {
          sendJson(response, weatherResult.status, { message: weatherResult.message });
          return;
        }

        cache.set(cacheKey, weatherResult.data);
        sendJson(response, 200, {
          source: "api",
          data: weatherResult.data
        });
      } catch (error) {
        console.error("Erro ao consultar o clima:", error);
        sendJson(response, 500, {
          message: "Erro interno ao consultar o clima."
        });
      }
      return;
    }

    if (request.method === "GET" && serveStaticFile(response, requestUrl.pathname)) {
      return;
    }

    sendJson(response, 404, { message: "Rota nao encontrada." });
  });
}

if (require.main === module) {
  const config = getConfig();
  const server = createServer();

  server.listen(config.port, () => {
    console.log(`Servidor rodando em http://localhost:${config.port}`);
  });
}

module.exports = {
  createServer
};
