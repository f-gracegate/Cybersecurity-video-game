/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, ShieldAlert, FileAudio, PlayCircle, KeyRound, 
  HelpCircle, Monitor, BookOpen, ExternalLink, HelpCircle as HelpIcon 
} from 'lucide-react';
import { DEFAULT_SCENES } from './data';
import { NarratorSettings, VideoScene, SavedScript } from './types';
import { VideoPlayer } from './components/VideoPlayer';
import { Controls } from './components/Controls';
import { ScriptSidebar } from './components/ScriptSidebar';
import { QuizCompanion } from './components/QuizCompanion';
import { AIPresentationWorkspace } from './components/AIPresentationWorkspace';
import { synths } from './components/AudioSynthesizer';

const defaultSavedScript: SavedScript = {
  id: "default-security-basic",
  title: "Protect Your Computer in 60 Seconds (Default)",
  prompt: "Use strong passwords with letters, numbers, and symbols. Always update your computer. Avoid malicious links. Backup your critical files.",
  timestamp: "Default",
  scenes: DEFAULT_SCENES
};

export default function App() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [narratorSettings, setNarratorSettings] = useState<NarratorSettings>({
    voiceEnabled: true,
    soundEffectsEnabled: true,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  });

  const [savedScripts, setSavedScripts] = useState<SavedScript[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cyber-cinematic-scripts");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn("Failed loading cyber scripts:", e);
        }
      }
    }
    return [defaultSavedScript];
  });

  const [activeScriptId, setActiveScriptId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storedActive = localStorage.getItem("cyber-cinematic-active-id");
      if (storedActive) return storedActive;
    }
    return "default-security-basic";
  });

  const activeScript = savedScripts.find(s => s.id === activeScriptId) || defaultSavedScript;
  const scenes = activeScript.scenes;

  // Persist film scripts to browser caches
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cyber-cinematic-scripts", JSON.stringify(savedScripts));
    }
  }, [savedScripts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cyber-cinematic-active-id", activeScriptId);
    }
  }, [activeScriptId]);

  const duration = scenes.length > 0 ? scenes[scenes.length - 1].end : 60;
  const lastSpokenSceneIdRef = useRef<number>(-1);

  // Core system voice-changer warmup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
          }
        };
      }
    }
  }, []);

  // Compute active scene from timer position
  const getCurrentScene = (time: number): VideoScene => {
    const active = scenes.find(
      (scene) => time >= scene.start && time < scene.end
    );
    if (!active) {
      if (time >= duration) return scenes[scenes.length - 1];
      return scenes[0];
    }
    return active;
  };

  const currentScene = getCurrentScene(currentTime);

  // Trigger browser SpeechSynthesis to narrate a scene vocalization
  const speakSceneVoiceover = (scene: VideoScene, settings: NarratorSettings) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Halt current speaking to avoid audio collision
    window.speechSynthesis.cancel();
    
    if (!settings.voiceEnabled) return;
    
    try {
      const utterance = new SpeechSynthesisUtterance(scene.voiceover);
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      
      const voices = window.speechSynthesis.getVoices();
      // Prioritize standard high-fidelity voices
      const firstEnVoice = voices.find(v => v.lang.startsWith('en'));
      if (firstEnVoice) {
        utterance.voice = firstEnVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("TTS speaking error:", err);
    }
  };

  // Timed playhead clock ticker loop
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime((prev) => {
          const nextVal = prev + 0.1;
          if (nextVal >= duration) {
            setIsPlaying(false);
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            lastSpokenSceneIdRef.current = -1;
            return duration; // Cap on finish
          }
          return Math.round(nextVal * 10) / 10; // Tenths precision normalization
        });
      }, 100);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying]);

  // Synchronize narration on explicit play/pause interactions
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      lastSpokenSceneIdRef.current = -1;
    } else {
      speakSceneVoiceover(currentScene, narratorSettings);
      lastSpokenSceneIdRef.current = currentScene.id;
    }
  }, [isPlaying]);

  // Synchronize narration on timed scene boundaries crossings
  useEffect(() => {
    if (isPlaying && currentScene.id !== lastSpokenSceneIdRef.current) {
      speakSceneVoiceover(currentScene, narratorSettings);
      lastSpokenSceneIdRef.current = currentScene.id;
    }
  }, [currentScene.id, isPlaying, narratorSettings.rate, narratorSettings.voiceEnabled]);

  // Handle timeline manual drag scrubbing
  const handleScrub = (time: number) => {
    const capped = Math.max(0, Math.min(duration, Math.round(time * 10) / 10));
    setCurrentTime(capped);
    
    const targetScene = getCurrentScene(capped);
    if (isPlaying) {
      speakSceneVoiceover(targetScene, narratorSettings);
      lastSpokenSceneIdRef.current = targetScene.id;
    } else {
      lastSpokenSceneIdRef.current = -1;
    }
  };

  // Handle sidebar row clicks
  const handleSelectScene = (scene: VideoScene) => {
    handleScrub(scene.start);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    lastSpokenSceneIdRef.current = -1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleNarratorChange = (newSettings: NarratorSettings) => {
    setNarratorSettings(newSettings);
    synths.setEnabled(newSettings.soundEffectsEnabled);
  };

  const handleSelectScript = (script: SavedScript) => {
    setIsPlaying(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActiveScriptId(script.id);
    setCurrentTime(0);
    lastSpokenSceneIdRef.current = -1;
  };

  const handleAddScript = (script: SavedScript) => {
    setSavedScripts(prev => {
      const filtered = prev.filter(s => s.id !== script.id);
      return [...filtered, script];
    });
  };

  const handleDeleteScript = (id: string) => {
    if (id === "default-security-basic") return;
    setSavedScripts(prev => {
      const next = prev.filter(s => s.id !== id);
      if (activeScriptId === id) {
        setActiveScriptId("default-security-basic");
        setIsPlaying(false);
        setCurrentTime(0);
        lastSpokenSceneIdRef.current = -1;
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      
      {/* Decorative cyber ambient headers */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-950/15 via-transparent to-transparent pointer-events-none z-0" />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 z-10 relative space-y-8">
        
        {/* Header Hero Board */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 pb-6 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                Interactive Presenter
              </span>
              <span className="text-[10px] text-neutral-500 font-mono select-none">UTC 2026</span>
            </div>
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-neutral-100 tracking-tight leading-none">
              “{activeScript.title}”
            </h1>
            <p className="text-sm text-neutral-400 mt-1.5 max-w-2xl font-sans">
              Experience the 1-minute cybersecurity training film. Click play to watch real-time neon vector animations, simulated hacking occurrences, and voice guide narrations in high-fidelity.
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 select-none">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-wider">
              Studio Playhead Ready
            </span>
          </div>
        </header>

        {/* Primary Interactive Section Layout Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Visualizer Player and controls (7 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 16:9 Canvas Viewport */}
            <VideoPlayer 
              currentTime={currentTime}
              currentSceneId={currentScene.id}
              isPlaying={isPlaying}
              soundEffectsEnabled={narratorSettings.soundEffectsEnabled}
              currentScene={currentScene}
            />

            <div className="bg-[#0a0a0a]/90 border border-slate-800 rounded-2xl p-5 shadow-inner relative flex flex-col justify-center items-center h-28 text-center select-none overflow-hidden">
              <span className="absolute top-2.5 left-4 text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                Closed Captioning (Narrator Subtitles)
              </span>
              <p className={`text-sm sm:text-base tracking-wide font-sans leading-relaxed px-4 transition-all duration-300 max-w-2xl ${
                isPlaying ? 'text-blue-300 font-medium' : 'text-slate-400 italic'
              }`}>
                “{currentScene.voiceover}”
              </p>
            </div>

            {/* Range Scrubber and volume/rate metrics deck */}
            <Controls 
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
              onScrub={handleScrub}
              scenes={scenes}
              currentSceneId={currentScene.id}
              narratorSettings={narratorSettings}
              onChangeNarrator={handleNarratorChange}
            />

          </div>

          {/* Screenplay & Sidebar (4 cols) */}
          <div className="lg:col-span-4 h-full md:h-[610px] min-h-[400px]">
            <ScriptSidebar 
              scenes={scenes}
              currentSceneId={currentScene.id}
              currentTime={currentTime}
              onSelectScene={handleSelectScene}
            />
          </div>

        </section>

        {/* Divider representing bottom layout */}
        <div className="border-t border-neutral-900 pt-2" />

        {/* Custom Companion Widgets bento box */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 select-none">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="font-sans font-bold text-lg text-neutral-100 tracking-tight">
              Interactive Posture Checklist & Sandbox Labs
            </h2>
          </div>
          
          <QuizCompanion />
        </section>

      </main>

      {/* Humble Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/30 py-6 text-center select-none shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px] font-mono">
          <p>© 2026 Cybersecurity Training Lab. All actions local.</p>
          <div className="flex items-center gap-3">
            <span>🛡 AES-256 Verified Applet</span>
            <span>🧩 Built with Tailwind 4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
