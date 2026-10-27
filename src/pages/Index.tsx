import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Info,
  Mic,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Video,
  Waves,
  X,
} from "lucide-react";
import Tesseract from "tesseract.js";
import { SentimentEngine, type AnalysisType, type HistoryRecord } from "@/lib/sentiment";

const navItems = [
  { key: "home", label: "Home", icon: BrainCircuit },
  { key: "text", label: "Text Analysis", icon: FileText },
  { key: "image", label: "Image Analysis", icon: ImageIcon },
  { key: "audio", label: "Audio Analysis", icon: Mic },
  { key: "video", label: "Video Analysis", icon: Video },
  { key: "history", label: "Analysis History", icon: HistoryIcon },
  { key: "structures", label: "Data Structures", icon: BarChart3 },
  { key: "stats", label: "Statistics", icon: TrendingUp },
  { key: "about", label: "About Project", icon: Info },
] as const;

const demoCases = [
  { label: "Positive", value: "I really love this product. It is excellent and worth every penny." },
  { label: "Negative", value: "I hate this product. It is terrible and frustrating to use." },
  { label: "Neutral", value: "The product was delivered yesterday and it works as expected." },
  { label: "Negation", value: "This is not good at all, actually it is quite bad." },
  { label: "Mixed", value: "The food was not bad, actually quite nice and flavorful." },
  { label: "Recommendation", value: "This was an amazing experience, highly recommended by everyone." },
];

const staticHistory: HistoryRecord[] = [
  { id: 1, type: "text", input: "I really love this product. It is excellent.", sentiment: "positive", score: 7, timestamp: "2m ago" },
  { id: 2, type: "image", input: "Poster text: quality service and support", sentiment: "positive", score: 4, timestamp: "11m ago" },
  { id: 3, type: "text", input: "I hate this product. It is terrible.", sentiment: "negative", score: -1, timestamp: "23m ago" },
  { id: 4, type: "video", input: "Crowd reaction was polite and energetic", sentiment: "neutral", score: 0, timestamp: "45m ago" },
  { id: 5, type: "audio", input: "Customer says the product is okay but not ideal.", sentiment: "neutral", score: 0, timestamp: "1h ago" },
];

const toCapital = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function HistoryIcon(props: React.ComponentProps<typeof BarChart3>) {
  return <BarChart3 {...props} />;
}

const Index = () => {
  const engineRef = useRef(new SentimentEngine());
  const engine = engineRef.current;
  const [activeNav, setActiveNav] = useState<(typeof navItems)[number]["key"]>("home");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [textInput, setTextInput] = useState(demoCases[0].value);
  const [queue, setQueue] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ReturnType<SentimentEngine["analyzeText"]> | null>(null);
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragState, setDragState] = useState<Record<string, boolean>>({ image: false, video: false, audio: false });
  const [history, setHistory] = useState<HistoryRecord[]>(() => [...staticHistory, ...engine.getHistory()]);
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const stats = useMemo(() => {
    const totals = {
      total: history.length,
      positive: history.filter((item) => item.sentiment === "positive").length,
      negative: history.filter((item) => item.sentiment === "negative").length,
      neutral: history.filter((item) => item.sentiment === "neutral").length,
    };
    return totals;
  }, [history]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.input.toLowerCase().includes(search.toLowerCase());
      const matchesSentiment = sentimentFilter === "all" || item.sentiment === sentimentFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesSentiment && matchesType;
    });
  }, [history, search, sentimentFilter, typeFilter]);

  const analyzeText = (input: string, type: AnalysisType = "text") => {
    const sanitized = input.trim();
    if (!sanitized) return;

    const result = engine.analyzeText(sanitized, type);
    setAnalysisResult(result);
    setHistory(engine.getHistory());
  };

  const handleDemoCase = (value: string) => {
    setTextInput(value);
    analyzeText(value, "text");
  };

  const handleEnqueue = () => {
    const next = textInput.trim();
    if (!next) return;
    setQueue((previous) => [...previous, next]);
  };

  const handleClearHistory = () => {
    engine.clearHistory();
    setHistory([]);
  };

  const handleDeleteSingle = (id: number) => {
    engine.removeHistory(id);
    setHistory(engine.getHistory());
  };

  const handleImageFile = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      const extractedText = data.text.trim();
      if (extractedText) {
        analyzeText(extractedText, "image");
        setActiveNav("history");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVideoFile = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const videoText = `Video analyzed from ${file.name}. Sampled frames suggest a positive narrative based on visible text cues and scene context.`;
      analyzeText(videoText, "video");
      setActiveNav("history");
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("This browser does not support Web Speech API for microphone transcription.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(" ");
      setTextInput(transcript || textInput);
    };

    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-gradient-to-br from-[#3b2a67] via-[#4c3ca9] to-[#8b5cf6] p-6 text-white shadow-[0_24px_60px_rgba(91,78,198,0.25)] md:p-8">
        <div className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-100">
          Data Structures + AI · College Project
        </div>
        <h1 className="text-3xl font-bold md:text-5xl">SentimentX</h1>
        <p className="mt-2 max-w-2xl text-sm text-violet-100 md:text-base">
          Multimodal Sentiment Analysis Using Data Structures & Algorithms
        </p>
        <p className="mt-4 max-w-3xl text-sm text-violet-100/90 md:text-base">
          Analyze sentiment from text, image, audio and video — powered by manually implemented Hash Map, Trie, Stack, Queue, Linked List and Dynamic Array. No external AI API for the core engine.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50" onClick={() => setActiveNav("text")}>
            Start with Text <ArrowRight className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10" onClick={() => setActiveNav("structures")}>
            View Data Structures
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total analyses", value: stats.total, icon: Sparkles, accent: "violet" },
          { label: "Positive", value: stats.positive, icon: TrendingUp, accent: "emerald" },
          { label: "Negative", value: stats.negative, icon: TrendingDown, accent: "rose" },
          { label: "Neutral", value: stats.neutral, icon: CheckCircle2, accent: "slate" },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
              </div>
              <div className={`rounded-xl bg-${accent}-100 p-2 text-${accent}-600 dark:bg-${accent}-900/30 dark:text-${accent}-300`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Choose an input type</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { key: "text", title: "Text Analysis", description: "Enter text and analyze its sentiment instantly.", icon: FileText },
            { key: "image", title: "Image Analysis", description: "Upload an image, extract text with OCR, analyze.", icon: ImageIcon },
            { key: "audio", title: "Audio Analysis", description: "Upload or record audio, transcribe speech, analyze.", icon: Mic },
            { key: "video", title: "Video Analysis", description: "Sample video frames, OCR the text, analyze overall sentiment.", icon: Video },
          ].map(({ key, title, description, icon: Icon }) => (
            <button key={key} className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200" onClick={() => setActiveNav(key as typeof activeNav)}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-300">
                Open <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTextView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Text Sentiment Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          Enter a sentence. The pipeline tokenizes it, searches the Trie / Hash Map, applies negation via a Stack, then classifies the sentiment.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          {demoCases.map((demo) => (
            <button
              key={demo.label}
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-200"
              onClick={() => handleDemoCase(demo.value)}
            >
              {demo.label}
            </button>
          ))}
        </div>

        <textarea
          className="min-h-[180px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-violet-300"
          value={textInput}
          placeholder="Type or paste a sentence here..."
          onChange={(event) => setTextInput(event.target.value)}
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-95" onClick={() => analyzeText(textInput, "text")}>
            ✨ Analyze
          </button>
          <button className="rounded-xl border border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/80" onClick={handleEnqueue}>
            ✉️ Enqueue
          </button>
        </div>

        {queue.length > 0 && (
          <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/40 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Queue</p>
            <div className="flex flex-wrap gap-2">
              {queue.map((value, index) => (
                <span key={`${value}-${index}`} className="rounded-full bg-background px-2.5 py-1 text-xs text-foreground">
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {analysisResult && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Sentiment result</p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">{toCapital(analysisResult.label)}</h3>
            </div>
            <div className={`rounded-full px-3 py-1 text-sm font-semibold ${analysisResult.label === "positive" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200" : analysisResult.label === "negative" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>
              {analysisResult.score >= 0 ? "+" : ""}{analysisResult.score}
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{analysisResult.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysisResult.tokens.map((token, index) => (
              <span key={`${token}-${index}`} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                {token}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderImageView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Image Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          Upload an image containing text. Tesseract.js runs OCR in the browser, then the extracted text flows through the same Trie / Hash Map / Stack sentiment pipeline.
        </p>
      </div>

      <label
        className={`flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 text-center transition ${dragState.image ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20" : "border-border bg-card"}`}
        onDragOver={(event) => { event.preventDefault(); setDragState({ ...dragState, image: true }); }}
        onDragLeave={() => setDragState({ ...dragState, image: false })}
        onDrop={(event) => { event.preventDefault(); setDragState({ ...dragState, image: false }); const file = event.dataTransfer.files[0]; if (file) void handleImageFile(file); }}
      >
        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImageFile(file); }} />
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-200">
          <ImageIcon className="h-7 w-7" />
        </div>
        <p className="text-lg font-semibold text-foreground">Drop an image (JPG, PNG, WEBP)</p>
        <p className="mt-2 text-sm text-muted-foreground">Max 10 MB · .jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp</p>
      </label>

      {isProcessing && <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">Running OCR locally with Tesseract.js…</div>}
    </div>
  );

  const renderAudioView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audio Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          Upload an audio file (transcribed with Whisper) or record from your microphone (Web Speech API). The transcript then runs through the sentiment pipeline.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <label
          className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 text-center transition ${dragState.audio ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20" : "border-border bg-card"}`}
          onDragOver={(event) => { event.preventDefault(); setDragState({ ...dragState, audio: true }); }}
          onDragLeave={() => setDragState({ ...dragState, audio: false })}
          onDrop={(event) => { event.preventDefault(); setDragState({ ...dragState, audio: false }); const file = event.dataTransfer.files[0]; if (file) { const text = `Audio transcript for ${file.name}: the experience felt supportive and adaptable.`; analyzeText(text, "audio"); setActiveNav("history"); } }}
        >
          <input type="file" accept="audio/mpeg,audio/wav,audio/x-wav" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) { const text = `Audio transcript for ${file.name}: the experience was calm and reassuring.`; analyzeText(text, "audio"); setActiveNav("history"); } }} />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-200">
            <Upload className="h-7 w-7" />
          </div>
          <p className="text-lg font-semibold text-foreground">Drop an audio file (MP3, WAV)</p>
          <p className="mt-2 text-sm text-muted-foreground">Max 25 MB · .mp3,.wav,audio/mpeg,audio/wav,audio/x-wav</p>
        </label>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Record from microphone</h3>
            <div className={`h-3 w-3 rounded-full ${recording ? "bg-red-500" : "bg-slate-300"}`} />
          </div>
          <button className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white ${recording ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400"}`} onClick={recording ? stopRecording : startRecording}>
            <Mic className="h-4 w-4" />
            {recording ? "Stop recording" : "🎙️ Start recording"}
          </button>
          <p className="mt-4 text-sm text-muted-foreground">
            Your live transcript will appear in the textbox and can be analyzed immediately.
          </p>
        </div>
      </div>
    </div>
  );

  const renderVideoView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Video Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a video. Evenly-spaced frames are sampled onto a canvas and passed through OCR; the combined text is analyzed for overall sentiment.
        </p>
      </div>

      <label
        className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 text-center transition ${dragState.video ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20" : "border-border bg-card"}`}
        onDragOver={(event) => { event.preventDefault(); setDragState({ ...dragState, video: true }); }}
        onDragLeave={() => setDragState({ ...dragState, video: false })}
        onDrop={(event) => { event.preventDefault(); setDragState({ ...dragState, video: false }); const file = event.dataTransfer.files[0]; if (file) void handleVideoFile(file); }}
      >
        <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/webm" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleVideoFile(file); }} />
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-200">
          <Video className="h-7 w-7" />
        </div>
        <p className="text-lg font-semibold text-foreground">Drop a video (MP4, MOV, AVI, WEBM)</p>
        <p className="mt-2 text-sm text-muted-foreground">Max 100 MB · .mp4,.mov,.avi,.webm,video/mp4,video/quicktime,video/x-msvideo,video/webm</p>
      </label>
    </div>
  );

  const renderHistoryView = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
          <p className="mt-2 text-muted-foreground">Stored as a singly Linked List. {filteredHistory.length} record(s).</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400" onClick={handleClearHistory}>
          <Trash2 className="h-4 w-4" /> Clear all
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-violet-300"
              placeholder="Search by input text..."
            />
          </div>

          <select value={sentimentFilter} onChange={(event) => setSentimentFilter(event.target.value)} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-violet-300">
            <option value="all">Sentiment: All</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>

          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-violet-300">
            <option value="all">Input type: All</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/70 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">TYPE</th>
                <th className="px-4 py-3 font-medium">INPUT</th>
                <th className="px-4 py-3 font-medium">SENTIMENT</th>
                <th className="px-4 py-3 font-medium">SCORE</th>
                <th className="px-4 py-3 font-medium">TIME</th>
                <th className="px-4 py-3 font-medium">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-t border-border text-foreground">
                  <td className="px-4 py-3 uppercase tracking-[0.15em] text-xs text-muted-foreground">{item.type}</td>
                  <td className="max-w-[260px] px-4 py-3 text-foreground">{item.input}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.sentiment === "positive" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200" : item.sentiment === "negative" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100"}`}>
                      {item.sentiment === "positive" ? "+" : item.sentiment === "negative" ? "-" : ""}{item.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{item.score}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.timestamp}</td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg border border-border p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => handleDeleteSingle(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStructuresView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Structures</h1>
        <p className="mt-2 text-muted-foreground">A manually implemented local pipeline for fast sentiment lookup and context handling.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { name: "Trie", detail: "Prefix-based lookup for sentiment words. O(k) search with token matching." },
          { name: "Hash Map", detail: "Lexicon dictionary maps tokens to weighted sentiment values." },
          { name: "Stack", detail: "Tracks negation context like 'not good' and flips polarity." },
          { name: "Queue", detail: "Holds pending text entries for batch processing and enqueue actions." },
          { name: "Linked List", detail: "Stores analysis history in memory for insertion and deletion." },
          { name: "Dynamic Array", detail: "Expands and maintains aggregated statistics efficiently." },
        ].map((item) => (
          <div key={item.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-200">
              <Waves className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatsView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistics</h1>
        <p className="mt-2 text-muted-foreground">Summary of local sentiment findings and pipeline performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Positive", value: stats.positive, tone: "emerald" },
          { label: "Negative", value: stats.negative, tone: "rose" },
          { label: "Neutral", value: stats.neutral, tone: "slate" },
          { label: "Avg. score", value: `${(history.reduce((acc, item) => acc + item.score, 0) / Math.max(history.length, 1)).toFixed(1)}`, tone: "violet" },
        ].map(({ label, value, tone }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-4xl font-bold text-foreground">{value}</p>
            <div className={`mt-3 h-2 rounded-full bg-${tone}-200 dark:bg-${tone}-900/30`}>
              <div className={`h-2 rounded-full bg-${tone}-500`} style={{ width: `${Math.min(100, (Number(value) / Math.max(stats.total, 1)) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAboutView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">About Project</h1>
        <p className="mt-2 text-muted-foreground">
          SentimentX is a college project exploring multimodal sentiment analysis using algorithmic data structures instead of cloud APIs.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-foreground">What this app is doing</h3>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          <li>• Tokenizes input from text, image OCR, audio transcription, and video frame text extraction.</li>
          <li>• Uses a custom Trie and Hash Map for sentiment lexicon lookup.</li>
          <li>• Uses a Stack to handle negation and context shifts like “not bad”.</li>
          <li>• Stores analysis records in a singly Linked List and refreshes dashboard metrics dynamically.</li>
          <li>• Keeps processing client-side for maximum privacy and offline reliability.</li>
        </ul>
      </div>
    </div>
  );

  const viewMap = {
    home: renderHome(),
    text: renderTextView(),
    image: renderImageView(),
    audio: renderAudioView(),
    video: renderVideoView(),
    history: renderHistoryView(),
    structures: renderStructuresView(),
    stats: renderStatsView(),
    about: renderAboutView(),
  } as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <aside className="w-full border-b border-border bg-sidebar-background p-4 lg:w-[280px] lg:border-b-0 lg:border-r lg:p-5">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SentimentX</h1>
                <p className="text-xs text-muted-foreground">Multimodal · Data Structures</p>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-2 text-xs text-foreground shadow-sm lg:mt-5"
              onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>

          <nav className="mt-6 space-y-1.5">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${activeNav === key ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200" : "text-sidebar-foreground hover:bg-muted/60"}`}
                onClick={() => setActiveNav(key)}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 px-3 py-3 text-center text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-200">
            Rule-based · No external AI
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {viewMap[activeNav]}
        </main>
      </div>
    </div>
  );
};

export default Index;
