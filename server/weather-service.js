const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

function mapWeatherResponse(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    windSpeed: Number(data.wind.speed),
    windAngle: Number(data.wind.deg)
  };
}

async function fetchWeatherByCity(city, apiKey) {
  const url = new URL(WEATHER_API_URL);
  url.searchParams.set("q", city);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "pt_br");

  const response = await fetch(url);
  const data = await response.json().catch(() => null);

  if (response.status === 404) {
    return {
      ok: false,
      status: 404,
      message: "Localizacao nao encontrada. Tente novamente."
    };
  }

  if (!response.ok || !data) {
    return {
      ok: false,
      status: 502,
      message: "Nao foi possivel consultar o servico de clima no momento."
    };
  }

  return {
    ok: true,
    status: 200,
    data: mapWeatherResponse(data)
  };
}

module.exports = {
  fetchWeatherByCity
};
