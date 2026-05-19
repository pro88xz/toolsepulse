"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { saveAs } from "file-saver";
import { getToolBySlug } from "@/config/tools";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import WhatsNext from "@/components/tools/WhatsNext";
import InboxBanner from "@/components/tools/InboxBanner";
import { takeFromInbox, inboxItemToFile } from "@/lib/toolInbox";

const tool = getToolBySlug("mp4-to-mp3")!;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MP4ToMP3Page() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [resultSize, setResultSize] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file (MP4, WebM, etc.)");
      return;
    }

    setError("");
    setDone(false);
    setFileName(file.name);
    setFileSize(file.size);
    setProcessing(true);
    setProgress("Loading video...");

    try {
      // Quick metadata read for duration display (optional, non-fatal if it fails)
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = videoUrl;
      video.muted = true;
      try {
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => { setDuration(video.duration); resolve(); };
          video.onerror = () => reject(new Error("metadata"));
          setTimeout(() => reject(new Error("timeout")), 5000);
        });
      } catch {
        // Duration is just for display, not critical
      }
      URL.revokeObjectURL(videoUrl);

      setProgress("Loading converter (one-time download)...");
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress }) => {
        const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
        setProgress("Extracting audio... " + pct + "%");
      });

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(baseURL + "/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL(baseURL + "/ffmpeg-core.wasm", "application/wasm"),
      });

      setProgress("Reading file...");
      const ext = file.name.match(/\.[^.]+$/)?.[0] || ".mp4";
      const inputName = "input" + ext;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // -vn: strip video, -acodec libmp3lame: MP3 codec, -q:a 2: VBR ~190kbps (high quality)
      await ffmpeg.exec(["-i", inputName, "-vn", "-acodec", "libmp3lame", "-q:a", "2", "output.mp3"]);

      const data = (await ffmpeg.readFile("output.mp3")) as Uint8Array;
      const blob = new Blob([data as BlobPart], { type: "audio/mp3" });
      setResultSize(blob.size);
      saveAs(blob, file.name.replace(/\.[^.]+$/, ".mp3"));

      try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile("output.mp3");
      } catch {}
      ffmpeg.terminate();

      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to convert video. The file may be corrupted or unsupported.");
    } finally {
      setProcessing(false);
      setProgress("");
    }
  }, []);

  const [inboxSource, setInboxSource] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const file = Array.from(files).find((f) => f.type.startsWith("video/"));
    if (file) convertFile(file);
  }, [convertFile]);

  // On mount: check if a file was passed from another tool via inbox
  useEffect(() => {
    const fromTool = new URLSearchParams(window.location.search).get("from");
    if (!fromTool) return;
    (async () => {
      const item = await takeFromInbox();
      if (!item) return;
      const file = inboxItemToFile(item);
      setInboxSource(item.sourceTool);
      handleFiles([file]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToolPageLayout tool={tool} hideWhatsNext>
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => !processing && inputRef.current?.click()}
            className={"drop-zone cursor-pointer " + (dragActive ? "active" : "")}
          >
            <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
                <p className="text-sm text-gray-600">{progress}</p>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full bg-cyan-100 p-4 mb-4">
                  <svg className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Drop a video file here or click to upload</p>
                <p className="text-sm text-gray-400 mt-1">MP4, WebM, MOV — extract audio as MP3</p>
              </>
            )}
          </div>
        </div>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">{error}</div>}

        {done && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Conversion Complete</h2>
                <p className="text-sm text-green-700">{fileName} - {formatDuration(duration)} - {formatSize(resultSize)}</p>
              </div>
            </div>
            <button onClick={() => setDone(false)} className="mt-4 btn-secondary py-2 px-4">Convert Another Video</button>
          </div>
        )}
      </div>
      <WhatsNext currentTool="mp4-to-mp3" />
    </ToolPageLayout>
  );
}
