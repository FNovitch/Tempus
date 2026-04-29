const formElement = document.querySelector(".busca") as HTMLFormElement;
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
const resultadoElement = document.querySelector(".resultado") as HTMLElement;
const avisoElement = document.querySelector(".aviso") as HTMLElement;
const tituloElement = document.querySelector(".titulo") as HTMLElement;
const tempInfoElement = document.querySelector(".tempInfo") as HTMLElement;
const ventoInfoElement = document.querySelector(".ventoInfo") as HTMLElement;
const tempImageElement = document.querySelector(
  ".temp img"
) as HTMLImageElement;
const ventoPontoElement = document.querySelector(".ventoPonto") as HTMLElement;

type WeatherResponse = {
  city: string;
  country: string;
  temperature: number;
  icon: string;
  windSpeed: number;
  windAngle: number;
};

type ApiPayload = {
  data?: WeatherResponse;
  message?: string;
};

formElement.addEventListener("submit", async (event) => {
  event.preventDefault();

  const input = searchInput.value.trim();
  if (!input) {
    mostrarAviso("Por favor, insira o nome de um local!");
    return;
  }

  limparInfo();
  mostrarAviso("Carregando...");

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(input)}`);
    const payload = await lerPayloadDaResposta(response);

    if (!response.ok || !payload.data) {
      throw new Error(payload.message || "Nao foi possivel buscar o clima.");
    }

    mostrarInfo(payload.data);
  } catch (error) {
    mostrarAviso((error as Error).message);
  }
});

async function lerPayloadDaResposta(response: Response): Promise<ApiPayload> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as ApiPayload;
  }

  const responseText = await response.text();
  if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
    throw new Error(
      "A requisicao nao chegou na API de clima. Inicie o servidor Node.js local ou verifique a configuracao do deploy."
    );
  }

  throw new Error("A resposta da API veio em um formato invalido.");
}

function mostrarInfo(data: WeatherResponse) {
  mostrarAviso("");
  resultadoElement.hidden = false;
  tituloElement.textContent = `${data.city}, ${data.country}`;
  tempInfoElement.innerHTML = `${data.temperature} <sup>&deg;C</sup>`;
  ventoInfoElement.innerHTML = `${data.windSpeed} <span>Km/h</span>`;
  tempImageElement.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
  tempImageElement.alt = `Clima em ${data.city}`;
  ventoPontoElement.style.transform = `rotate(${data.windAngle - 90}deg)`;
}

function mostrarAviso(mensagem: string) {
  avisoElement.textContent = mensagem;
}

function limparInfo() {
  mostrarAviso("");
  resultadoElement.hidden = true;
}
