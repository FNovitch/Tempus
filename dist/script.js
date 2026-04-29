"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const formElement = document.querySelector(".busca");
const searchInput = document.querySelector("#searchInput");
const resultadoElement = document.querySelector(".resultado");
const avisoElement = document.querySelector(".aviso");
const tituloElement = document.querySelector(".titulo");
const tempInfoElement = document.querySelector(".tempInfo");
const ventoInfoElement = document.querySelector(".ventoInfo");
const tempImageElement = document.querySelector(".temp img");
const ventoPontoElement = document.querySelector(".ventoPonto");
formElement.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const input = searchInput.value.trim();
    if (!input) {
        mostrarAviso("Por favor, insira o nome de um local!");
        return;
    }
    limparInfo();
    mostrarAviso("Carregando...");
    try {
        const response = yield fetch(`/api/weather?city=${encodeURIComponent(input)}`);
        const payload = yield lerPayloadDaResposta(response);
        if (!response.ok || !payload.data) {
            throw new Error(payload.message || "Nao foi possivel buscar o clima.");
        }
        mostrarInfo(payload.data);
    }
    catch (error) {
        mostrarAviso(error.message);
    }
}));
function lerPayloadDaResposta(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            return (yield response.json());
        }
        const responseText = yield response.text();
        if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
            throw new Error("A requisicao nao chegou na API de clima. Inicie o servidor Node.js local ou verifique a configuracao do deploy.");
        }
        throw new Error("A resposta da API veio em um formato invalido.");
    });
}
function mostrarInfo(data) {
    mostrarAviso("");
    resultadoElement.hidden = false;
    tituloElement.textContent = `${data.city}, ${data.country}`;
    tempInfoElement.innerHTML = `${data.temperature} <sup>&deg;C</sup>`;
    ventoInfoElement.innerHTML = `${data.windSpeed} <span>Km/h</span>`;
    tempImageElement.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    tempImageElement.alt = `Clima em ${data.city}`;
    ventoPontoElement.style.transform = `rotate(${data.windAngle - 90}deg)`;
}
function mostrarAviso(mensagem) {
    avisoElement.textContent = mensagem;
}
function limparInfo() {
    mostrarAviso("");
    resultadoElement.hidden = true;
}
