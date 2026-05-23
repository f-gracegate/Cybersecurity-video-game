/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VideoScene } from '../types';
import { Play, Clipboard, Eye, FileText, CheckCircle, ChevronRight, MessageSquareCode } from 'lucide-react';

interface ScriptSidebarProps {
  scenes: VideoScene[];
  currentSceneId: number;
  currentTime: number;
  onSelectScene: (scene: VideoScene) => void;
}

export const ScriptSidebar: React.FC<ScriptSidebarProps> = ({
  scenes,
  currentSceneId,
  currentTime,
  onSelectScene
}) => {
  return (
    <div id="script-shot-sidebar" className="bg-[#0a0a0a]/90 border border-slate-800 rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl">
      {/* Sidebar title */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0d0d0d]/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <Clipboard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Storyboard Nodes
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Scenario Timeline Sheet</p>
          </div>
        </div>
        <span className="p-1 px-1.5 rounded bg-slate-900 text-[9px] font-mono font-bold text-blue-400">
          7 SCENES
        </span>
      </div>

      {/* Screenplay layout stack */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {scenes.map((scene) => {
          const isActive = currentSceneId === scene.id;
          const isFished = currentTime >= scene.end;
          
          // Calculate internal active percentage progress inside this individual scene
          const sceneDuration = scene.end - scene.start;
          const progressInScene = Math.max(0, Math.min(1, (currentTime - scene.start) / sceneDuration));

          return (
            <div 
              key={scene.id}
              onClick={() => onSelectScene(scene)}
              id={`sidebar-scene-row-${scene.id}`}
              className={`group/row relative text-left border rounded-xl p-3.5 transition-all duration-300 cursor-pointer ${
                isActive 
                  ? 'border-blue-500 bg-slate-900 shadow-[0_0_15px_rgba(37,99,235,0.06)] border-l-4 border-l-blue-500' 
                  : isFished
                  ? 'border-slate-850 bg-[#0d0d0d]/40 hover:bg-slate-900/40 opacity-70 border-l-4 border-l-transparent'
                  : 'border-slate-800 bg-transparent hover:border-slate-700 hover:bg-slate-900/65 border-l-4 border-l-transparent'
              }`}
            >
              {/* Timing Badge on Top Right */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  isActive 
                    ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30' 
                    : 'bg-[#050505] text-slate-500 border border-slate-800'
                }`}>
                  {scene.start < 10 ? `0:0${scene.start}` : `0:${scene.start}`} – {scene.end < 10 ? `0:0${scene.end}` : `0:${scene.end}`}
                </span>
              </div>

              {/* Scene Row Number & Title */}
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-dashed border-slate-800">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : isFished
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {scene.id}
                </div>
                <div>
                  <h4 className={`text-xs font-bold leading-none ${
                    isActive ? 'text-white font-medium italic' : 'text-slate-300'
                  }`}>
                    {scene.title}
                  </h4>
                </div>
              </div>

              {/* Progress track when and only when active scene */}
              {isActive && (
                <div id={`scene-pb-track-${scene.id}`} className="h-1 w-full bg-[#050505] rounded-full mb-3 overflow-hidden p-[1px] border border-slate-800">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${progressInScene * 100}%` }}
                  />
                </div>
              )}

              {/* Details Expand Panels */}
              <div className="space-y-2 text-[11px] leading-relaxed">
                {/* Visual Description block */}
                <div className="flex items-start gap-1.5">
                  <Eye className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-slate-200' : 'text-slate-500'}`} />
                  <p className="text-slate-400">
                    <strong className="text-slate-300 font-medium">Visual: </strong>
                    {scene.visualDescription}
                  </p>
                </div>

                {/* Voiceover details block */}
                <div className="flex items-start gap-1.5 bg-[#050505]/65 p-2 rounded border border-slate-800">
                  <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <p className="text-slate-300 font-sans italic">
                    <strong className="text-slate-400 not-italic font-bold">Narration: </strong>
                    “{scene.voiceover}”
                  </p>
                </div>

                {/* Overlaid texts requirements */}
                <div className="flex items-start gap-1.5 text-[10px] uppercase font-mono tracking-wider">
                  <MessageSquareCode className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                  <p className="text-slate-500 font-semibold">
                    <strong className="text-slate-400 font-bold font-sans tracking-normal capitalize">Overlay Text: </strong>
                    <span className={isActive ? 'text-blue-400 font-medium' : 'text-slate-500'}>
                      {scene.onScreenText.replace(/\n/g, ' • ')}
                    </span>
                  </p>
                </div>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 scale-y-0 group-hover/row:scale-y-100 transition-transform duration-200" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
