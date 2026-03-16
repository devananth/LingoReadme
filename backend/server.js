import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { LingoDotDevEngine } from "lingo.dev/sdk";
import pLimit from "p-limit";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// INCREASED CONCURRENCY: 10 chunks at a time
const limit = pLimit(10);

function createChunks(text, limitSize) {
  if (!text) return [];
  const paragraphs = text.split(/\n\n+/);
  const chunks = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    // If a single paragraph is huge, we must include it,
    // but usually, we group them until we hit ~5000 chars.
    if (
      currentChunk.length + paragraph.length > limitSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      currentChunk = currentChunk
        ? `${currentChunk}\n\n${paragraph}`
        : paragraph;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

app.post("/api/translate", async (req, res) => {
  const { markdown, targetLocale } = req.body;
  const startTime = performance.now();

  if (!markdown || !targetLocale) return res.status(400).send("Missing data");

  try {
    const chunks = createChunks(markdown, 5000);
    console.log(`Starting translation: ${chunks.length} chunks.`);

    const translationPromises = chunks.map((chunk, index) =>
      limit(async () => {
        return await lingoDotDev.localizeText(chunk, {
          targetLocale: targetLocale,
          sourceLocale: "en",
        });
      }),
    );

    const translatedChunks = await Promise.all(translationPromises);
    const translatedMarkdown = translatedChunks.join("\n\n");

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`Finished Translation in ${duration}s`);

    res.json({ translatedMarkdown, duration });
  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () =>
  console.log("Translation backend server on http://localhost:3000"),
);
