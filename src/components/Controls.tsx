/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX,
  ChevronRight, Layers, AudioLines
} from 'lucide-react';
import { NarratorSettings, VideoScene } from '../types';

interface ControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onScrub: (time: number) => void;
  scenes: VideoScene[];
  currentSceneId: number;
  narratorSettings: NarratorSettings;
  onChangeNarrator: (settings: NarratorSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
  onReset,
  onScrub,
  scenes,
  currentSceneId,
  narratorSettings,
  onChangeNarrator
}) => {
  // Helpers for time string encoding
  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="video-controls-deck" className="bg-[#0a0a0a]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      
      {/* 1. Timeline Scrubber and Scene Segments */}
      <div className="space-y-1.5">
        <div className="relative">
          {/* Segment visual bars in background representing are boundaries */}
          <div className="absolute inset-x-0 h-1 top-2.5 flex pointer-events-none rounded-full overflow-hidden">
            {scenes.map((scene) => {
              const rectWidth = ((scene.end - scene.start) / duration) * 100;
              const isSelected = currentSceneId === scene.id;
              return (
                <div 
                  key={scene.id}
                  style={{ width: `${rectWidth}%` }}
                  className={`h-full border-r border-slate-900 transition-all ${
                    isSelected 
                      ? 'bg-blue-600/50' 
                      : scene.end <= currentTime 
                      ? 'bg-blue-800/20' 
                      : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Actual Range input element */}
          <input 
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => onScrub(parseFloat(e.target.value))}
            id="timeline-main-scrub-input"
            className="w-full relative h-6 bg-transparent outline-none appearance-none cursor-pointer slider-thumb-cyan z-10 accent-blue-500"
          />
        </div>

        {/* Scene division labels under scrubber */}
        <div className="flex justify-between text-[10px] font-mono font-medium text-slate-500 px-1 select-none">
          {scenes.map((scene) => (
            <button 
              key={scene.id}
              onClick={() => onScrub(scene.start)}
              className={`hover:text-blue-400 transition-colors ${
                currentSceneId === scene.id ? 'text-blue-400 font-bold' : ''
              }`}
            >
              0:{scene.start < 10 ? `0${scene.start}` : scene.start}
            </button>
          ))}
          <span>0:{duration}</span>
        </div>
      </div>

      {/* 2. Audio settings and playback Deck Grid */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
        
        {/* Playback Actions Deck */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            id="control-play-button"
            onClick={onTogglePlay}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all shadow-md ${
              isPlaying 
                ? 'bg-blue-600 text-white font-bold hover:bg-blue-500 scale-[0.98]' 
                : 'bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button 
            id="control-reset-button"
            onClick={onReset}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300 transition-all"
            title="Reset video"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Timing counter tags */}
          <div className="h-11 px-3 bg-[#050505] border border-slate-800 rounded-xl flex items-center justify-center gap-1.5 font-mono text-xs shadow-inner">
            <span className="text-blue-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Narrator Speech Settings Panel */}
        <div className="bg-[#050505]/60 border border-slate-800 p-2.5 px-4 rounded-xl flex flex-wrap items-center gap-4 text-xs w-full md:w-auto shadow-inner">
          <div className="flex items-center gap-1.5">
            <AudioLines className="w-4 h-4 text-blue-500" />
            <span className="font-sans font-bold text-slate-300 uppercase text-[10px] tracking-wider">Voice Guide</span>
          </div>

          {/* Toggle voices */}
          <button 
            onClick={() => onChangeNarrator({ ...narratorSettings, voiceEnabled: !narratorSettings.voiceEnabled })}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              narratorSettings.voiceEnabled 
                ? 'bg-blue-950/40 text-blue-400 border border-blue-500/20' 
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            {narratorSettings.voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>TTS Narrator</span>
          </button>

          {/* Voice rate speech setting slider */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Speed:</span>
            <input 
              type="range"
              min="0.7"
              max="1.5"
              step="0.1"
              value={narratorSettings.rate}
              onChange={(e) => onChangeNarrator({ ...narratorSettings, rate: parseFloat(e.target.value) })}
              className="w-16 accent-blue-500"
            />
            <span className="text-[10px] text-blue-300 font-mono font-bold">{narratorSettings.rate}x</span>
          </div>

          <div className="border-r border-slate-800 h-4 self-center hidden sm:block" />

          {/* Sound FX Toggle */}
          <button 
            onClick={() => onChangeNarrator({ ...narratorSettings, soundEffectsEnabled: !narratorSettings.soundEffectsEnabled })}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              narratorSettings.soundEffectsEnabled
                ? 'bg-blue-900/40 text-blue-400 border border-blue-500/20' 
                : 'bg-slate-900 text-slate-505 border border-slate-800'
            }`}
          >
            <span>Synth FX</span>
          </button>
        </div>

      </div>

      {/* 3. Segment Row Pills to instantly skip */}
      <div className="flex items-center gap-2 flex-wrap text-xs select-none">
        <span className="text-[10px] text-slate-500 uppercase font-mono font-bold mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> JUMP:
        </span>
        {scenes.map((scene) => (
          <button 
            key={scene.id}
            onClick={() => onScrub(scene.start)}
            className={`px-2 py-1 rounded-md text-[10px] font-medium border transition-all ${
              currentSceneId === scene.id 
                ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' 
                : 'bg-[#050505] border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Scene {scene.id}
          </button>
        ))}
      </div>
    </div>
  );
};
