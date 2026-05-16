"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

const tool = getToolBySlug("character-counter")!;

const LIMITS = [
  { label: "Twitter / X", limit: 280 },
  { label: "SMS", limit: 160 },
  { label: "Meta description", limit: 160 },
  { label: "Title tag", limit: 60 },
  { label: "Instagram caption", limit: 2200 },
  { label: "LinkedIn post", limit: 3000 },
];

export default function CharacterCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const trimmed = text.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const lines = text === "" ? 0 : text.split(/\n/).length;
    const sentences = trimmed === "" ? 0 : trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = trimmed === "" ? 0 : trimmed.split(/\n\n+/).filter((p) => p.trim().length > 0).length;
    return { characters, charactersNoSpaces, words, lines, sentences, paragraphs };
  }, [text]);

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { label: "Characters", value: stats.characters },
            { label: "No Spaces", value: stats.charactersNoSpaces },
            { label: "Words", value: stats.words },
            { label: "Lines", value: stats.lines },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
              <p className="text-lg font-bold text-blue-600">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Type or paste your text</label>
            <button onClick={() => setText("")} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Clear</button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing to count characters in real time..."
            className="w-full h-72 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-blue-400 transition-colors resize-none leading-relaxed"
            autoFocus
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform limits</h2>
          <div className="space-y-3">
            {LIMITS.map((p) => {
              const pct = Math.min(100, (stats.characters / p.limit) * 100);
              const over = stats.characters > p.limit;
              const remaining = p.limit - stats.characters;
              return (
                <div key={p.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{p.label}</span>
                    <span className={over ? "text-rose-600 font-medium" : "text-gray-500"}>
                      {over ? `${Math.abs(remaining)} over` : `${remaining} left`} / {p.limit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${over ? "bg-rose-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
