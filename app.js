const CONFIG_URL = "/config.json";
const DEFAULT_POLL_INTERVAL = 60_000;

const player = document.getElementById("video-player");
const statusCard = document.getElementById("status-card");
const statusText = document.getElementById("status-text");
const playOverlay = document.getElementById("play-overlay");

let activeConfig = null;
let pollHandle = null;

function showStatus(message, persist = false) {
  statusText.textContent = message;
  statusCard.classList.remove("hidden");

  if (!persist) {
    window.clearTimeout(showStatus.hideHandle);
    showStatus.hideHandle = window.setTimeout(() => {
      statusCard.classList.add("hidden");
    }, 4000);
  }
}

async function loadConfig() {
  const cacheBreaker = `ts=${Date.now()}`;
  const response = await fetch(`${CONFIG_URL}?${cacheBreaker}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar o config.json");
  }

  return response.json();
}

function buildVideoUrl(config) {
  const separator = config.videoUrl.includes("?") ? "&" : "?";
  return `${config.videoUrl}${separator}v=${encodeURIComponent(config.version)}`;
}

async function tryPlayVideo() {
  try {
    await player.play();
    playOverlay.classList.add("hidden");
    return true;
  } catch (error) {
    playOverlay.classList.remove("hidden");
    showStatus("Autoplay bloqueado neste navegador. Clique na tela para iniciar.", true);
    return false;
  }
}

function normalizeConfig(config) {
  return {
    videoUrl: config.videoUrl,
    version: config.version ?? config.videoUrl,
    pollIntervalMs: Number(config.pollIntervalMs) || DEFAULT_POLL_INTERVAL,
    title: config.title ?? "TV Corporativa",
  };
}

async function applyConfig(nextConfig, { initialLoad = false } = {}) {
  const normalized = normalizeConfig(nextConfig);

  if (!normalized.videoUrl) {
    throw new Error("Defina videoUrl em config.json");
  }

  const configChanged =
    !activeConfig ||
    activeConfig.version !== normalized.version ||
    activeConfig.videoUrl !== normalized.videoUrl;

  const intervalChanged =
    !activeConfig || activeConfig.pollIntervalMs !== normalized.pollIntervalMs;

  activeConfig = normalized;
  document.title = normalized.title;

  if (configChanged) {
    player.src = buildVideoUrl(normalized);
    player.load();

    const didPlay = await tryPlayVideo();
    if (didPlay) {
      showStatus(
        initialLoad
          ? "Video carregado com sucesso."
          : "Novo video detectado. Atualizando a exibicao."
      );
    }
  }

  if (intervalChanged) {
    startPolling(normalized.pollIntervalMs);
  }
}

function startPolling(intervalMs) {
  if (pollHandle) {
    window.clearInterval(pollHandle);
  }

  pollHandle = window.setInterval(async () => {
    try {
      const config = await loadConfig();
      await applyConfig(config);
    } catch (error) {
      showStatus(error.message, true);
    }
  }, intervalMs);
}

async function bootstrap() {
  showStatus("Buscando configuracao do video...", true);

  try {
    const config = await loadConfig();
    await applyConfig(config, { initialLoad: true });
  } catch (error) {
    showStatus(error.message, true);
  }
}

player.addEventListener("error", () => {
  showStatus(
    "Falha ao carregar o video. Verifique se o arquivo existe e se a TV suporta esse MP4.",
    true
  );
});

player.addEventListener("canplay", async () => {
  if (activeConfig) {
    await tryPlayVideo();
  }
});

document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible" && activeConfig) {
    await tryPlayVideo();
  }
});

playOverlay.addEventListener("click", async () => {
  const didPlay = await tryPlayVideo();

  if (didPlay) {
    showStatus("Video iniciado com sucesso.");
  }
});

bootstrap();
