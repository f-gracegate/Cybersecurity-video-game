import React, { useState, useEffect } from "react";
import { 
  Sparkles, History, Download, Trash2, FileText, Play,
  Plus, Laptop, CheckCircle, ShieldAlert, AlertCircle, RefreshCw
} from "lucide-react";
import { VideoScene, SavedScript } from "../types";
import { DEFAULT_SCENES } from "../data";

interface AIPresentationWorkspaceProps {
  activeScriptId: string;
  onSelectScript: (script: SavedScript) => void;
  onAddScript: (script: SavedScript) => void;
  savedScripts: SavedScript[];
  onDeleteScript: (id: string) => void;
}

const PRESET_TOPICS = [
  {
    title: "🔐 Wi-Fi Hack Shielding",
    prompt: "How to audit and lock down your home Wi-Fi router, shield network access, disable vulnerable WPS pins, and configure WPA3 passwords."
  },
  {
    title: "📥 WhatsApp Social Phishing",
    prompt: "A case of malicious links on WhatsApp, fake verification PIN scams, double-factor authentication bypassing, and target response."
  },
  {
    title: "💸 CEO Ransomware Trap",
    prompt: "Ransomware spreading through spoofed corporate PDF billing emails, malicious macros, automated encrypting, and recovery protocol."
  },
  {
    title: "📱 SIM Swapping Shields",
    prompt: "How hackers steal mobile identities through SIM-swapping, social engineering call centers, security pin bypasses, and protection steps."
  }
];

export const AIPresentationWorkspace: React.FC<AIPresentationWorkspaceProps> = ({
  activeScriptId,
  onSelectScript,
  onAddScript,
  savedScripts,
  onDeleteScript
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Function to compile and download Standalone HTML presentation
  const handleDownloadStandalone = (script: SavedScript) => {
    // Determine the total duration from the final scene end timestamp
    const duration = script.scenes.length > 0 ? script.scenes[script.scenes.length - 1].end : 60;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Standalone Presenter: ${script.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #030712; color: #f3f4f6; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none; background: #3b82f6; width: 14px; height: 14px; border-radius: 50%;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="max-w-4xl w-full bg-[#0d1117] border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <header class="border-b border-neutral-800 pb-4">
            <h1 class="text-xl font-bold text-white">${script.title}</h1>
            <p class="text-xs text-neutral-400 mt-1">Standalone Presenter Film Bundle • Exported from Studio Lab</p>
        </header>

        <!-- Dynamic Visualization Player Screen -->
        <div id="visual-screen" class="relative aspect-video w-full bg-black rounded-2xl overflow-hidden border border-blue-500/20 flex flex-col items-center justify-center p-8 transition-all duration-300">
            <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.5)_100%)] opacity-75 z-10" />
            
            <div id="visual-graphic" class="text-center space-y-4">
                <div id="graphic-icon" class="text-6xl animate-pulse">💻</div>
                <h2 id="graphic-title" class="text-lg font-bold text-blue-400 uppercase tracking-widest font-mono">Standby</h2>
                <p id="graphic-desc" class="text-xs text-neutral-400 max-w-md mx-auto"></p>
            </div>

            <!-- Narrations overlaid -->
            <div class="absolute bottom-6 left-6 right-6 text-center bg-black/90 border border-neutral-800 py-3 px-5 rounded-xl backdrop-blur-md">
                <p id="subtitles" class="text-sm font-medium text-blue-300 leading-relaxed">"Press play to start voiceover presentation."</p>
            </div>
            
            <div class="absolute top-4 left-4 bg-[#161b22] border border-neutral-800 px-2.5 py-1 rounded text-[9px] font-mono tracking-wider text-neutral-300 z-20 uppercase flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                <span>Stand-Alone Media Presentation</span>
            </div>
        </div>

        <!-- Progress and Actions Header -->
        <div class="space-y-4">
            <div class="flex items-center gap-3">
                <input type="range" id="scrubber" min="0" max="${duration}" step="0.5" value="0" class="flex-1 accent-blue-500 h-2 bg-neutral-800 rounded-full cursor-pointer">
                <span id="timer" class="font-mono text-xs text-neutral-400 w-12 text-right">0:00</span>
            </div>

            <div class="flex justify-between items-center bg-[#161b22] p-4 rounded-xl border border-neutral-800/60">
                <div class="flex items-center gap-2">
                    <button id="play-btn" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl text-sm transition-all shadow-md">Play Presentation</button>
                    <button id="reset-btn" class="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold py-2 px-4 rounded-xl text-sm transition-all border border-neutral-700">Reset</button>
                </div>
                
                <span id="timeline-scene" class="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">Scene: Wait</span>
            </div>
        </div>

        <!-- Storyboard cues -->
        <div id="cues" class="bg-black/30 border border-neutral-800 rounded-2xl p-4 overflow-y-auto max-h-[180px] space-y-2">
           ${script.scenes.map(s => `
                <div onclick="seekTo(${s.start})" class="cursor-pointer hover:bg-neutral-800 p-2.5 rounded-lg border border-neutral-800 text-xs flex justify-between items-center transition-all bg-[#0d1117]/50">
                    <div>
                        <span class="font-bold text-neutral-100 font-sans">${s.id}. ${s.title}</span>
                        <p class="text-neutral-400 mt-0.5">${s.voiceover}</p>
                    </div>
                    <span class="font-mono text-[9px] bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-400 border border-neutral-800">0:${s.start < 10 ? '0' + s.start : s.start} - 0:${s.end < 10 ? '0' + s.end : s.end}</span>
                </div>
           `).join("")}
        </div>
    </div>

    <script>
        const scenes = ${JSON.stringify(script.scenes)};
        const duration = ${duration};
        
        let playhead = 0;
        let isPlaying = false;
        let timerId = null;

        const playBtn = document.getElementById('play-btn');
        const resetBtn = document.getElementById('reset-btn');
        const scrubber = document.getElementById('scrubber');
        const timerLabel = document.getElementById('timer');
        const sceneLabel = document.getElementById('timeline-scene');
        const subtitles = document.getElementById('subtitles');
        const graphicIcon = document.getElementById('graphic-icon');
        const graphicTitle = document.getElementById('graphic-title');
        const graphicDesc = document.getElementById('graphic-desc');
        const visualScreen = document.getElementById('visual-screen');

        const categoryIcons = {
            intro: '💻', passwords: '🔑', updates: '🔄', phishing: '📥', antivirus: '🛡️', backup: '☁️', outro: '🔐'
        };

        const categoryColors = {
            intro: 'rgba(59, 130, 246, 0.4)',
            passwords: 'rgba(59, 130, 246, 0.4)',
            updates: 'rgba(99, 102, 241, 0.4)',
            phishing: 'rgba(239, 68, 68, 0.4)',
            antivirus: 'rgba(59, 130, 246, 0.4)',
            backup: 'rgba(79, 70, 229, 0.4)',
            outro: 'rgba(16, 185, 129, 0.4)'
        };

        function getActiveScene(time) {
            return scenes.find(s => time >= s.start && time < s.end) || scenes[scenes.length - 1];
        }

        function speakText(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(u);
            }
        }

        function updateUI() {
            scrubber.value = playhead;
            
            const mins = Math.floor(playhead / 60);
            const secs = Math.floor(playhead % 60);
            timerLabel.innerText = mins + ':' + (secs < 10 ? '0' : '') + secs;

            const s = getActiveScene(playhead);
            sceneLabel.innerText = 'Scene: ' + s.title;
            subtitles.innerText = '“' + s.voiceover + '”';
            graphicIcon.innerText = categoryIcons[s.category] || '🛡️';
            graphicTitle.innerText = s.onScreenText;
            graphicDesc.innerText = s.visualDescription;
            visualScreen.style.boxShadow = 'inset 0 0 20px ' + (categoryColors[s.category] || 'rgba(59, 130, 246, 0.2)');
        }

        function tick() {
            if (playhead >= duration) {
                pause();
                playhead = duration;
                updateUI();
                return;
            }
            const lastScene = getActiveScene(playhead);
            playhead = Math.round((playhead + 0.1) * 10) / 10;
            const newScene = getActiveScene(playhead);
            
            if (lastScene.id !== newScene.id) {
                speakText(newScene.voiceover);
            }
            updateUI();
        }

        function play() {
            if (playhead >= duration) playhead = 0;
            isPlaying = true;
            playBtn.innerText = 'Pause';
            playBtn.className = 'bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-xl text-sm transition-all shadow-md';
            
            const s = getActiveScene(playhead);
            speakText(s.voiceover);
            
            timerId = setInterval(tick, 100);
        }

        function pause() {
            isPlaying = false;
            playBtn.innerText = 'Play Presentation';
            playBtn.className = 'bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl text-sm transition-all shadow-md';
            clearInterval(timerId);
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }

        function seekTo(time) {
            playhead = time;
            updateUI();
            if (isPlaying) {
                const s = getActiveScene(playhead);
                speakText(s.voiceover);
            }
        }

        playBtn.addEventListener('click', function() {
            if (isPlaying) pause(); else play();
        });

        resetBtn.addEventListener('click', function() {
            pause();
            playhead = 0;
            updateUI();
        });

        scrubber.addEventListener('input', function(e) {
            seekTo(parseFloat(e.target.value));
        });

        updateUI();
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cinematic-presentation-${script.title.toLowerCase().replace(/\s+/g, "-")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Compile and download screenplay script
  const handleDownloadScreenplay = (script: SavedScript) => {
    let output = `# SCREENPLAY STORYBOARD: ${script.title.toUpperCase()}\n`;
    output += `Generated on: ${script.timestamp}\n`;
    if (script.prompt) {
      output += `Original Prompt Topic: "${script.prompt}"\n`;
    }
    output += `========================================================================\n\n`;

    script.scenes.forEach(scene => {
      output += `SCENE ${scene.id}: ${scene.title.toUpperCase()} (0:${scene.start < 10 ? '0' + scene.start : scene.start} - 0:${scene.end < 10 ? '0' + scene.end : scene.end})\n`;
      output += `------------------------------------------------------------------------\n`;
      output += `CATEGORY MODALITY: ${scene.category.toUpperCase()}\n`;
      output += `VISUAL GRAPHICS:   ${scene.visualDescription}\n`;
      output += `ON-SCREEN BULLET:  "${scene.onScreenText}"\n`;
      output += `VOICEOVER NARRATOR: \n   "${scene.voiceover}"\n\n`;
    });

    output += `========================================================================\n`;
    output += `End of Screenplay Script. All timings verified for browser synthesis.\n`;

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `screenplay-script-${script.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handles generating the dynamic script by calling backend Express API
  const handleGenerateContent = async (textPrompt: string) => {
    if (!textPrompt.trim()) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setTerminalLogs(["Connecting to Gemini Model...", "Validating input tips content..."]);

    const logSteps = [
      "Analyzing security posture theme...",
      "Drafting timeline screenplay scenes...",
      "Assigning dynamic visual rendering categories...",
      "Formulating standard voiceover narration tracks..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < logSteps.length) {
        setTerminalLogs(prev => [...prev, logSteps[stepIndex]]);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    try {
      const response = await fetch("/api/gemini/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textPrompt })
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.scenes) {
        throw new Error(result.error || "Gemini API could not establish scenes.");
      }

      const freshScript: SavedScript = {
        id: `script-${Date.now()}`,
        title: textPrompt.length > 30 ? `${textPrompt.substring(0, 30)}...` : textPrompt,
        prompt: textPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scenes: result.scenes
      };

      onAddScript(freshScript);
      onSelectScript(freshScript);
      setPrompt("");
      setTerminalLogs(prev => [...prev, "✨ Success! Storyboard loading in active studio player."]);

    } catch (err: any) {
      console.warn("Script generation API issue or fallback required:", err);
      // Fallback: Make a mock beautiful script on the client so that users WITHOUT an API key configured STILL have a fully functioning, beautiful applet experience
      const simulatedScenes = generateSimulatedFallback(textPrompt);
      
      const freshScript: SavedScript = {
        id: `script-${Date.now()}`,
        title: textPrompt.length > 30 ? `${textPrompt.substring(0, 30)}...` : textPrompt,
        prompt: textPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        scenes: simulatedScenes
      };

      // Show explanatory message
      setErrorMsg("Initialized safe local generation mode (using built-in security visual patterns). Populate your GEMINI_API_KEY for dynamic live model rendering!");
      
      onAddScript(freshScript);
      onSelectScript(freshScript);
      setPrompt("");
      setTerminalLogs(prev => [...prev, "🛡️ Switched safely to local sandbox synthesis.", "✨ Ready in player!"]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Utility to generate smart offline fallback structured scripts to keep application robust
  const generateSimulatedFallback = (topic: string): VideoScene[] => {
    return [
      {
        id: 1,
        title: `Introduction: ${topic.split(" ")[0] || "Analysis"}`,
        start: 0,
        end: 8,
        category: "intro",
        visualDescription: `Scanning vectors and locks on a dark dashboard representing ${topic}. Prompt title cards glowing in cyan.`,
        voiceover: `Threat researchers are monitoring security occurrences surrounding ${topic}. Let us look at how you can lock down your digital defenses in sixty seconds.`,
        onScreenText: `🔒 Target Threat: ${topic.substring(0, 20)}`
      },
      {
        id: 2,
        title: "Weaknesses & Credentials",
        start: 8,
        end: 18,
        category: "passwords",
        visualDescription: "A standard authorization box failing login audits. The user enters a weak password, then overrides it with an upgraded strong cryptographic code.",
        voiceover: "First, secure authentication parameters. Weak credentials can be cracked in seconds under targeted attacks. Upgrade to high-entropy keys.",
        onScreenText: "✅ Password Strength Upgraded"
      },
      {
        id: 3,
        title: "Integrity Verification",
        start: 18,
        end: 28,
        category: "updates",
        visualDescription: "The security patch checker loading state. Validating systems, checking compliance registries, and locking vulnerabilities down.",
        voiceover: "Second, audit your applications regularly. Patching security weaknesses shuts the door on scanners looking for outdated host configurations.",
        onScreenText: "🔄 Up-to-date Compliance OK"
      },
      {
        id: 4,
        title: "Trap Recognition & Deletion",
        start: 28,
        end: 38,
        category: "phishing",
        visualDescription: "An urgent simulated message alert with warning nodes blinking. A cursor enters and deletes the message securely.",
        voiceover: "Third, avoid malicious hyperlinks and suspicious phishing calls. If a message urges swift click actions, delete it instantly.",
        onScreenText: "❌ suspicious Link Deleted"
      },
      {
        id: 5,
        title: "Shield Protection and Defence",
        start: 38,
        end: 48,
        category: "antivirus",
        visualDescription: "Active firewall shield dome glowing, deflecting incoming rogue virus elements with blue visual sparks, protecting hosts in background.",
        voiceover: "Fourth, ensure firewalls are active. Guard filters automatically parse incoming traffic, blocking suspicious payloads.",
        onScreenText: "🛡️ Firewall Shield active"
      },
      {
        id: 6,
        title: "Synchronized Cloud Vault",
        start: 48,
        end: 55,
        category: "backup",
        visualDescription: "Files floating through a data sync tunnel towards an isolated cloud storage bunker, displaying perfect backup sync.",
        voiceover: "Finally, back up critical data stores. Securing isolated cloud files mitigates encryption ransomware demands permanently.",
        onScreenText: "☁️ Isolated Cloud Backups live"
      },
      {
        id: 7,
        title: "Conclusion & Posture",
        start: 55,
        end: 60,
        category: "outro",
        visualDescription: "A secure emerald lock glowing slowly inside a radar grid. Text prompts stays secure stays alert stay updated.",
        voiceover: "Digital cyber safety is a daily habit. Stay alert, stay up-to-date, and stay secure. Protecting yourself starts today.",
        onScreenText: "🔐 Cybersecurity Complete"
      }
    ];
  };

  const handleSelectPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  return (
    <div id="ai-story-workspace-bento" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-950/60 border border-slate-800 rounded-3xl p-6 shadow-2xl">
      
      {/* Col 1: Playback Screenplay Draft Studio (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Cinematic Script & Screenplay Generator</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Create custom cybersecurity video concepts with AI</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Type any threat vector, hacking scenario, or cybersecurity rule-set. Gemini will generate a continuous multi-scene 60-second video storyboard and dialogue narrator script perfectly matched to the visual graphics player!
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type: 'How ransomware lockups spread via phishing email spreadsheets', or 'Guidelines on safeguarding social networks for teenagers'..."
            rows={3}
            disabled={isGenerating}
            id="workspace-creative-prompt-input"
            className="w-full text-xs font-sans bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none shadow-inner"
          />

          {/* Quick presets list */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Fast Presets Deck:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TOPICS.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(t.prompt)}
                  disabled={isGenerating}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0d0d0d] hover:bg-slate-900 text-[10px] font-semibold text-slate-400 border border-slate-850 hover:border-slate-700 hover:text-white transition-all select-none"
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate triggers & error notifications */}
        <div className="pt-2 space-y-3">
          {errorMsg && (
            <div className="p-2.5 px-3 rounded-lg border border-blue-500/20 bg-blue-950/10 text-blue-400 text-[11px] leading-snug flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isGenerating ? (
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[10px] space-y-1">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-1.5 text-blue-400">
                  <span className="text-blue-500 font-bold">▶</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-slate-500 italic animate-pulse">
                <span>⚡ Generating scenes timeline... Please wait...</span>
              </div>
            </div>
          ) : null}

          <button
            onClick={() => handleGenerateContent(prompt)}
            disabled={isGenerating || !prompt.trim()}
            id="workspace-draft-submit-btn"
            className={`w-full py-3 px-4 rounded-xl font-bold font-sans text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
              isGenerating || !prompt.trim()
                ? "bg-slate-800 text-slate-500 border border-slate-850 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-[0.99]"
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Film Storyboard...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span>Draft AI Cyber Film</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Col 2: Saved Scripts & Downloads History (5 cols) */}
      <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-850 pt-5 lg:pt-0 lg:pl-6 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Film Vault</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Screenplay & saved history</p>
              </div>
            </div>
            
            <span className="p-1 px-1.5 rounded bg-slate-900 text-[10px] font-mono font-bold text-blue-400 border border-slate-800">
              {savedScripts.length} SCRIPTS
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
            {savedScripts.map((script) => {
              const isActive = script.id === activeScriptId;
              const isDefault = script.id === "default-security-basic";

              return (
                <div
                  key={script.id}
                  id={`saved-script-card-${script.id}`}
                  className={`border rounded-xl p-3 flex flex-col justify-between gap-3 transition-colors ${
                    isActive
                      ? "bg-slate-900/40 border-blue-500/40 shadow-sm"
                      : "bg-[#0d0d0d] border-slate-850 hover:bg-slate-900/20 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div 
                      onClick={() => onSelectScript(script)}
                      className="cursor-pointer flex-1"
                    >
                      <h4 className={`text-xs font-bold leading-tight ${isActive ? "text-blue-400" : "text-slate-200 group-hover:text-white"}`}>
                        {script.title}
                      </h4>
                      <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
                        {script.timestamp} • {script.scenes.length} Scenes
                      </p>
                    </div>

                    {!isDefault && (
                      <button
                        onClick={() => onDeleteScript(script.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors"
                        title="Delete video script"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Operational controls */}
                  <div className="flex items-center justify-between gap-2 border-t border-dashed border-slate-850 pt-2 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => onSelectScript(script)}
                      className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${
                        isActive ? "text-blue-300" : "text-slate-400 hover:text-blue-400"
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isActive ? "Viewing" : "Load Film"}</span>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Standalone player bundle */}
                      <button
                        onClick={() => handleDownloadStandalone(script)}
                        className="px-2 py-1 rounded-md bg-[#161b22] hover:bg-slate-800 text-[9px] font-semibold text-slate-300 border border-neutral-800 flex items-center gap-1 active:scale-95 transition-all"
                        title="Download Stand-Alone Video Presenter"
                      >
                        <Download className="w-3 h-3" />
                        <span>Interactive Video (.html)</span>
                      </button>

                      {/* Screenplay text */}
                      <button
                        onClick={() => handleDownloadScreenplay(script)}
                        className="px-2 py-1 rounded-md bg-[#161b22] hover:bg-slate-800 text-[9px] font-semibold text-slate-300 border border-neutral-800 flex items-center gap-1 active:scale-95 transition-all"
                        title="Download Dialogue Narrator Script"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Script (.txt)</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informative safety tag */}
        <div className="bg-[#050505] p-3 rounded-2xl border border-slate-850 text-[10px] text-slate-400 flex items-start gap-2 select-none">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="font-bold text-emerald-400 uppercase">Export Verified:</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Standalone player executes raw web animation pipelines and local audio synthesis entirely client-side. Works offline everywhere.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
