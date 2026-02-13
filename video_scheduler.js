import { createReadStream } from "fs";
import { readdir } from "fs/promises";
import path from "path";

const VIDEO_FOLDER = "./videos";
const MIN_INTERVAL_SECONDS = 900;
const MAX_INTERVAL_SECONDS = 2400;

const VIDEOS = [];

function randomIntervalSeconds() {
  return (
    Math.floor(Math.random() * (MAX_INTERVAL_SECONDS - MIN_INTERVAL_SECONDS + 1)) +
    MIN_INTERVAL_SECONDS
  );
}

function buildVideoCaption(affiliateLink) {
  return `🔥 ENTRE PELO LINK OFICIAL (BÔNUS)\n${affiliateLink}`;
}

async function loadVideos(folderPath = VIDEO_FOLDER) {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });

    VIDEOS.length = 0;
    VIDEOS.push(
      ...files
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((fileName) => fileName.toLowerCase().endsWith(".mp4"))
        .map((fileName) => path.join(folderPath, fileName))
    );

    if (VIDEOS.length === 0) {
      console.warn("⚠️ Nenhum vídeo .mp4 encontrado na pasta ./videos");
    } else {
      console.log(`🎬 ${VIDEOS.length} vídeo(s) carregado(s) para envio automático`);
    }
  } catch (error) {
    console.warn("⚠️ Não foi possível carregar a pasta ./videos:", error.message);
  }

  return [...VIDEOS];
}

function get_random_video(last_video = null, videoList = VIDEOS) {
  if (videoList.length === 0) {
    return null;
  }

  if (videoList.length === 1) {
    return videoList[0];
  }

  const candidates = videoList.filter((video) => video !== last_video);
  const selectedIndex = Math.floor(Math.random() * candidates.length);
  return candidates[selectedIndex];
}

async function sendVideo({ bot, channel, videoPath, caption, dryRun }) {
  if (dryRun) {
    console.log(`🧪 DRY_RUN=1 | Vídeo escolhido: ${path.basename(videoPath)}`);
    console.log("🧪 DRY_RUN=1 | Caption:");
    console.log(caption);
    return;
  }

  await bot.telegram.sendVideo(
    channel,
    { source: createReadStream(videoPath) },
    {
      caption,
    }
  );

  console.log(`🎥 Vídeo enviado: ${path.basename(videoPath)}`);
}

async function startVideoScheduler({
  bot,
  channel,
  affiliateLink,
  dryRun = false,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  maxIterations = Number.POSITIVE_INFINITY,
}) {
  let lastVideo = null;
  let iterations = 0;

  while (iterations < maxIterations) {
    const intervalSeconds = randomIntervalSeconds();
    console.log(`🎲 Próximo vídeo em ${intervalSeconds} segundos`);

    if (dryRun) {
      console.log(`🧪 DRY_RUN=1 | Intervalo sorteado: ${intervalSeconds}s`);
    }

    await sleep(intervalSeconds * 1000);

    const selectedVideo = get_random_video(lastVideo);

    if (!selectedVideo) {
      console.warn("⚠️ Sem vídeos disponíveis para envio automático");
      iterations += 1;
      continue;
    }

    const caption = buildVideoCaption(affiliateLink);

    try {
      await sendVideo({
        bot,
        channel,
        videoPath: selectedVideo,
        caption,
        dryRun,
      });
      lastVideo = selectedVideo;
      iterations += 1;
    } catch (error) {
      console.error("❌ Erro ao enviar vídeo:", error);
      iterations += 1;
    }
  }
}

export { VIDEOS, loadVideos, get_random_video, startVideoScheduler, buildVideoCaption };
