import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { loadVideos, get_random_video, buildVideoCaption } from "../video_scheduler.js";

test("loadVideos carrega somente arquivos .mp4", async () => {
  const tempDir = await mkdtemp(path.join(tmpdir(), "videos-test-"));

  try {
    await writeFile(path.join(tempDir, "a.mp4"), "");
    await writeFile(path.join(tempDir, "b.MP4"), "");
    await writeFile(path.join(tempDir, "ignore.txt"), "");

    const videos = await loadVideos(tempDir);

    assert.equal(videos.length, 2);
    assert.ok(videos.every((video) => video.toLowerCase().endsWith(".mp4")));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});

test("get_random_video não repete o último quando há múltiplos vídeos", () => {
  const list = ["videos/1.mp4", "videos/2.mp4", "videos/3.mp4"];

  for (let i = 0; i < 20; i += 1) {
    const selected = get_random_video("videos/1.mp4", list);
    assert.notEqual(selected, "videos/1.mp4");
  }
});

test("get_random_video retorna null se lista vazia", () => {
  assert.equal(get_random_video(null, []), null);
});

test("buildVideoCaption mantém formato esperado", () => {
  const caption = buildVideoCaption("https://example.com");
  assert.equal(caption, "🔥 ENTRE PELO LINK OFICIAL (BÔNUS)\nhttps://example.com");
});
