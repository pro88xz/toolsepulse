"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("lorem-ipsum-generator")!;

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
  "accusamus", "iusto", "odio", "dignissimos", "ducimus", "blanditiis",
  "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos", "dolores",
  "quas", "molestias", "excepturi", "occaecati", "provident", "similique",
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSentence(minWords: number, maxWords: number): string {
  const len = rand(minWords, maxWords);
  const parts: string[] = [];
  for (let i = 0; i < len; i++) parts.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  let s = parts.join(" ");
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (len > 8 && Math.random() < 0.5) {
    const comma = Math.floor(len / 2);
    const w = s.split(" ");
    w[comma] = w[comma] + ",";
    s = w.join(" ");
  }
  return s + ".";
}

function generateParagraph(sentenceMin: number, sentenceMax: number, wordsMin: number, wordsMax: number): string {
  const count = rand(sentenceMin, sentenceMax);
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) sentences.push(generateSentence(wordsMin, wordsMax));
  return sentences.join(" ");
}

function generate(paragraphs: number, sentences: number, words: number, startWithLorem: boolean): string {
  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    let para = generateParagraph(Math.max(2, sentences - 2), sentences + 2, Math.max(4, words - 3), words + 3);
    if (i === 0 && startWithLorem) {
      para = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + para;
    }
    result.push(para);
  }
  return result.join("\n\n");
}

export default function LoremIpsumGeneratorPage() {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentences, setSentences] = useState(5);
  const [words, setWords] = useState(10);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [tick, setTick] = useState(0);
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () => generate(paragraphs, sentences, words, startWithLorem),
    [paragraphs, sentences, words, startWithLorem, tick]
  );

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Paragraphs</label>
              <input
                type="number"
                min={1}
                max={50}
                value={paragraphs}
                onChange={(e) => setParagraphs(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Sentences / paragraph</label>
              <input
                type="number"
                min={1}
                max={20}
                value={sentences}
                onChange={(e) => setSentences(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Words / sentence</label>
              <input
                type="number"
                min={3}
                max={30}
                value={words}
                onChange={(e) => setWords(Math.max(3, Math.min(30, Number(e.target.value) || 3)))}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded"
              />
              Start with &ldquo;Lorem ipsum dolor sit amet&hellip;&rdquo;
            </label>
            <button
              onClick={() => setTick((t) => t + 1)}
              className="ml-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Generated text</p>
            <button
              onClick={copy}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{output}</div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
