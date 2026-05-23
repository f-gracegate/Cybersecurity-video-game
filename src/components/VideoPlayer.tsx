/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, Shield, Lock, ShieldCheck, Mail, Trash2, 
  RefreshCw, CheckCircle, Smartphone, AlertTriangle, Key, HardDrive, CloudLightning,
  ChevronRight, CircleX, CheckCircle2, Cloud
} from 'lucide-react';
import { synths } from './AudioSynthesizer';
import { VideoScene } from '../types';

interface VideoPlayerProps {
  currentTime: number;
  currentSceneId: number;
  isPlaying: boolean;
  soundEffectsEnabled: boolean;
  currentScene?: VideoScene;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentTime,
  currentSceneId,
  isPlaying,
  soundEffectsEnabled,
  currentScene
}) => {
  // Audio trigger hooks to ensure sound effects fire exactly at designated timeline beats
  const [lasthit, setLastHit] = useState<number>(-1);

  const weakPasswordText = currentScene?.onScreenText?.includes("❌")
    ? currentScene.onScreenText.split("❌")[1]?.split("✅")[0]?.trim() || "123456"
    : "123456";
  const strongPasswordText = currentScene?.onScreenText?.includes("✅")
    ? currentScene.onScreenText.split("✅")[1]?.trim() || "G7@pL!92x"
    : "G7@pL!92x";

  useEffect(() => {
    if (!isPlaying || !soundEffectsEnabled) return;

    const rounded = Math.floor(currentTime * 10) / 10; // tenth-second precision

    // Scene 1 Beats (0 - 5)
    if (rounded === 0.2) {
      synths.playScanner();
    }
    if (rounded === 2.5) {
      synths.playScanner();
    }

    // Scene 2 Beats (5 - 15)
    if (rounded === 6.5) {
      synths.playScanner(); // Warning buzzer for weak password
    }
    if (rounded === 10.5) {
      synths.playPasswordUpgrade(); // Upgraded success chime!
    }

    // Scene 3 Beats (15 - 25)
    if (rounded >= 16.5 && rounded <= 21.5 && Math.floor(rounded * 2) !== lasthit) {
      // Periodic clicks while mounting updates
      setLastHit(Math.floor(rounded * 2));
      synths.playUpdateProgress();
    }
    if (rounded === 22.5) {
      synths.playUpdateComplete(); // Beautiful resolution chord
    }

    // Scene 4 Beats (25 - 38)
    if (rounded === 26.2) {
      synths.playScanner(); // phishing email slides in alert
    }
    if (rounded === 34.0) {
      synths.playPhishingSwoosh(); // Trash swoosh shred
    }

    // Scene 5 Beats (38 - 48)
    if ((rounded === 40.2 || rounded === 42.5 || rounded === 44.8 || rounded === 46.5) && Math.floor(rounded * 10) !== lasthit) {
      setLastHit(Math.floor(rounded * 10));
      synths.playShieldDeflect(); // Core virus bounce sound
    }

    // Scene 6 Beats (48 - 55)
    if ((rounded === 49.5 || rounded === 51.5 || rounded === 53.5) && Math.floor(rounded * 10) !== lasthit) {
      setLastHit(Math.floor(rounded * 10));
      synths.playCloudSync(); // document upload chimes
    }

    // Scene 7 Beats (55 - 60)
    if (rounded === 56.5) {
      synths.playSafeClick(); // Vault shut latch sound
    }

  }, [currentTime, isPlaying, soundEffectsEnabled, lasthit]);

  // Binary array for falling green code matrix in Intro
  const [binaryColumns] = useState(() => 
    Array.from({ length: 15 }, () => Array.from({ length: 10 }, () => Math.round(Math.random())))
  );

  return (
    <div id="video-frame-viewport" className="relative w-full aspect-video bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col justify-between p-6 select-none group">
      {/* Absolute Cinematic Glare overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] z-20" />
      
      {/* 60fps Scanline CRT Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.4)_100%)] opacity-70 z-10" />

      {/* Dynamic Content Switching Based on Scene ID */}
      <div className="absolute inset-0 flex items-center justify-center p-8 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* =======================================
              SCENE 1: Intro (0:00 - 0:05)
             ======================================= */}
          {currentSceneId === 1 && (
            <motion.div 
              key="scene-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center"
            >
              {/* Scrolling Matrix Rain */}
              <div className="absolute inset-0 flex justify-between px-6 opacity-15 select-none text-[10px] font-mono text-emerald-500 timeline-matrix pointer-events-none">
                {binaryColumns.map((col, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [-100, 300] }}
                    transition={{ repeat: Infinity, duration: 4 + (i % 3), ease: 'linear', delay: i * 0.1 }}
                    className="flex flex-col space-y-1"
                  >
                    {col.map((val, idx) => (
                      <span key={idx}>{val}</span>
                    ))}
                  </motion.div>
                ))}
              </div>

              {/* Central Glowing Shield and Laptop UI */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  className="relative mb-4 flex items-center justify-center"
                  animate={{ y: [-4, 4] }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3, ease: 'easeInOut' }}
                >
                  <div className="absolute w-24 h-24 rounded-full bg-blue-600/25 blur-xl animate-pulse" />
                  <div className="relative p-6 border border-blue-500/30 rounded-2xl bg-neutral-900/80 shadow-[0_0_30px_rgba(37,99,235,0.15)] flex justify-center items-center">
                    <Laptop className="w-16 h-16 text-blue-450 stroke-[1.5]" />
                  </div>
                  
                  {/* Floating Warning Alerts around laptop */}
                  <motion.div 
                    initial={{ scale: 0, x: -60, y: -40 }}
                    animate={{ scale: currentTime >= 1.5 ? 1 : 0 }}
                    className="absolute p-2 bg-red-950/90 border border-red-500/60 rounded-lg shadow-lg flex items-center gap-1.5 text-[10px] font-bold text-red-400"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Hacker Attempt Blocked</span>
                  </motion.div>

                  <motion.div 
                    initial={{ scale: 0, x: 80, y: 30 }}
                    animate={{ scale: currentTime >= 3.0 ? 1 : 0 }}
                    className="absolute p-2 bg-amber-950/90 border border-amber-500/60 rounded-lg shadow-lg flex items-center gap-1.5 text-[10px] font-bold text-amber-400"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>IPS Trigger Filtered</span>
                  </motion.div>
                </motion.div>

                {/* Main On-screen overlay text */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="bg-neutral-900/90 border border-blue-500/40 px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.2)] flex items-center gap-2.5"
                >
                  <Lock className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="text-sm tracking-wide font-sans font-medium text-neutral-100">
                    {currentScene ? currentScene.onScreenText : "🔒 Protect Your Computer"}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* =======================================
              SCENE 2: Strong Passwords (0:05 - 0:15)
             ======================================= */}
          {currentSceneId === 2 && (
            <motion.div 
              key="scene-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center p-4"
            >
              <div className="max-w-md w-full border border-neutral-800 bg-neutral-900/90 p-5 rounded-2xl shadow-2xl relative">
                {/* Simulated Login Browser Header */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">secure-login.portal</span>
                  <Key className="w-3.5 h-3.5 text-neutral-500" />
                </div>

                {/* Action Frame State Switching based on timeline */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-neutral-400 font-medium block mb-1">USERNAME</label>
                    <input 
                      disabled
                      value="admin_security@local"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-neutral-300 font-mono disabled:opacity-80"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 font-medium block mb-1">PASSWORD INPUT</label>
                    <div className="relative">
                      {/* Weak password period: 5.0 to 10.0s */}
                      {currentTime < 10.0 ? (
                        <motion.div 
                          className="w-full bg-neutral-950 border border-red-500/40 text-red-400 rounded-lg py-2 px-3 text-xs font-mono flex items-center justify-between shadow-[0_0_10px_rgba(239,68,68,0.05)]"
                          animate={{ x: [0, -4, 4, -4, 4, 0] }}
                          transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 0.4 }}
                        >
                          <span className="tracking-wider font-semibold">{weakPasswordText}</span>
                          <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                            <CircleX className="w-3.5 h-3.5" /> Weak
                          </span>
                        </motion.div>
                      ) : (
                        /* Strong password period: 10.0 to 15.0s */
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-full bg-neutral-950 border border-emerald-500/40 text-emerald-400 rounded-lg py-2 px-3 text-xs font-mono flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        >
                          <span className="tracking-wider font-bold">{strongPasswordText}</span>
                          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" /> Strong
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Password comparison indicator bar */}
                  <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500">Strength Meter:</span>
                    <div className="flex gap-1 h-1.5 w-1/2 bg-neutral-950 rounded-full overflow-hidden p-0.5">
                      {currentTime < 10.0 ? (
                        <div className="w-1/4 h-full bg-red-500 rounded-full transition-all duration-300" />
                      ) : (
                        <motion.div 
                          initial={{ width: "25%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-emerald-500 rounded-full" 
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating overlay to output text requirements */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[110%] flex justify-between items-center text-xs text-neutral-300 py-1.5 px-3 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg font-mono">
                  <span className="text-red-500 flex items-center gap-1">❌ {weakPasswordText}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">✅ {strongPasswordText}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* =======================================
              SCENE 3: Software Updates (0:15 - 0:25)
             ======================================= */}
          {currentSceneId === 3 && (
            <motion.div 
              key="scene-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4"
            >
              {/* OS Security Center */}
              <div className="max-w-md w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl p-5 relative">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1 px-1.5 border border-blue-500/30 rounded-lg bg-blue-500/10 text-blue-400 font-bold">
                      <RefreshCw className={`w-3.5 h-3.5 ${currentTime < 22.0 ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-200">{currentScene ? currentScene.title : "OS Security Patch Manager"}</h4>
                      <p className="text-[9px] text-neutral-500">{currentScene ? currentScene.onScreenText : "Checking repository security updates..."}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono p-1 bg-neutral-950 border border-neutral-800 rounded text-blue-400">v4.14-STABLE</span>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-4 py-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-300 font-medium">
                      {currentTime < 22.0 ? 'Downloading system package blocks...' : 'System Fully Patched & Operational'}
                    </span>
                    <span className="text-[11px] font-mono text-blue-400 font-bold">
                      {currentTime < 22.0 ? `${Math.min(99, Math.floor(((currentTime - 15) / 7) * 100))}%` : '100%'}
                    </span>
                  </div>

                  {/* Horizontal progress meter */}
                  <div className="h-2.5 w-full bg-neutral-950 rounded-full border border-neutral-800 p-0.5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full"
                      style={{ 
                        width: currentTime < 22.0 
                          ? `${((currentTime - 15) / 7) * 100}%` 
                          : '100%' 
                      }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>

                  {/* Locking Security Modules */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className={`p-2 rounded-lg border text-center transition-colors duration-300 ${currentTime >= 17 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-neutral-950 border-neutral-800/60 text-neutral-600'}`}>
                      <span className="text-[8px] font-mono font-bold block">KERN_HOTFIX</span>
                      <span className="text-[9px] font-semibold">{currentTime >= 17 ? '✅ Applied' : 'Pending'}</span>
                    </div>
                    <div className={`p-2 rounded-lg border text-center transition-colors duration-300 ${currentTime >= 19 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-neutral-950 border-neutral-800/60 text-neutral-600'}`}>
                      <span className="text-[8px] font-mono font-bold block">NET_FIREWALL</span>
                      <span className="text-[9px] font-semibold">{currentTime >= 19 ? '✅ Safe' : 'Pending'}</span>
                    </div>
                    <div className={`p-2 rounded-lg border text-center transition-colors duration-300 ${currentTime >= 22 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-neutral-950 border-neutral-800/60 text-neutral-600'}`}>
                      <span className="text-[8px] font-mono font-bold block">CERT_VERIFY</span>
                      <span className="text-[9px] font-semibold">{currentTime >= 22 ? '✅ Active' : 'Pending'}</span>
                    </div>
                  </div>
                </div>

                {/* Full confirmation check circle */}
                <AnimatePresence>
                  {currentTime >= 22.0 && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0 bg-neutral-900/95 flex flex-col justify-center items-center rounded-2xl gap-2 border border-emerald-500/30"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.4 }}
                      >
                        <ShieldCheck className="w-16 h-16 text-emerald-400" />
                      </motion.div>
                      <span className="text-sm font-semibold text-neutral-100">All Software Up-To-Date</span>
                      <span className="text-[10px] text-neutral-400">Security holes fixed. Hackers locked out.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>
            </motion.div>
          )}

          {/* =======================================
              SCENE 4: Avoid Suspicious Links (0:25 - 0:38)
             ======================================= */}
          {currentSceneId === 4 && (
            <motion.div 
              key="scene-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center p-4 overflow-hidden"
            >
              <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-4 relative flex flex-col h-[210px]">
                {/* Simulated Email App Mail Client */}
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2.5 mb-2.5">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-neutral-200">Inbox Tracker</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    <span className="text-[9px] text-red-400 font-mono">1 ALERT</span>
                  </div>
                </div>

                {/* List of Simulated Emails */}
                <div className="space-y-1.5 flex-1 overflow-hidden relative">
                  {/* Legitimate email */}
                  <div className="bg-neutral-950 border border-neutral-800/40 p-2 rounded-lg opacity-40 flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-neutral-300">Internal HR Hub</p>
                      <p className="text-[9px] text-neutral-500">Weekly Staff Schedule update attached...</p>
                    </div>
                    <span className="text-[9px] text-neutral-600 font-mono">10:45 AM</span>
                  </div>

                  {/* Highlighted Mock Phishing Email (0:25 - 0:33 is visible, deleted at 0:34) */}
                  <AnimatePresence>
                    {currentTime < 34.0 ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, x: 200 }}
                        className="bg-red-950/20 border border-red-500/30 p-2.5 rounded-lg flex flex-col gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.06)] relative overflow-hidden"
                      >
                        {/* Red danger pulsing ring in background */}
                        <div className="absolute top-1 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[8px] font-bold">
                          <AlertTriangle className="w-2.5 h-2.5" /> PHISHING ATTEMPT
                        </div>
                        <div>
                          <p className="font-bold text-red-400 text-xs">🎁 {currentScene ? currentScene.title : "CONGRATS_WINNER_902"}</p>
                          <p className="text-[10px] text-neutral-300 font-medium">{currentScene ? currentScene.onScreenText : "YOU WON A NEW MACBOOK MAX PRO! CLICK BUTTON HERE NOW!"}</p>
                        </div>
                        <div className="flex gap-1.5">
                          {/* Highly tempting shiny clickable phishing button */}
                          <button disabled className="bg-gradient-to-r from-red-600 to-amber-500 text-neutral-100 font-extrabold text-[9px] px-2.5 py-1 rounded-md shadow-md animate-pulse">
                            REDEEM MACBOOK INSTANTLY
                          </button>
                        </div>

                        {/* Animated computer mouse pointer that represents the caution */}
                        {currentTime >= 30.0 && (
                          <motion.div 
                            initial={{ x: -250, y: 30 }}
                            animate={{ x: 120, y: 5 }}
                            transition={{ duration: 2.2, ease: 'easeOut' }}
                            className="absolute pointer-events-none z-30"
                          >
                            <svg className="w-5 h-5 text-neutral-100 filter drop-shadow-md fill-white" viewBox="0 0 24 24">
                              <path d="M4.5 4.5l14 7-6 1.5 4.5 5.5-2.5 1.5-4.5-5.5-5.5 4.5z" />
                            </svg>
                          </motion.div>
                        )}
                        
                      </motion.div>
                    ) : (
                      /* After deletion spacer/confirmation */
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 border border-emerald-500/20 bg-emerald-950/10 rounded-lg flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold h-[70px]"
                      >
                        <Trash2 className="w-4 h-4 animate-bounce" />
                        <span>Phishing Scam Safely Deleted & Purged</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Legitimate email 2 */}
                  <div className="bg-neutral-950 border border-neutral-800/40 p-2 rounded-lg opacity-40 flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-neutral-300">Local Bank Alerts</p>
                      <p className="text-[9px] text-neutral-500">Your online bank e-statement is ready for review...</p>
                    </div>
                    <span className="text-[9px] text-neutral-600 font-mono">Yesterday</span>
                  </div>
                </div>

                {/* Action feedback slide warnings */}
                <div className="absolute right-4 bottom-16">
                  {currentTime >= 29.0 && currentTime < 34.0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-2 bg-red-600 text-white rounded-lg text-[9px] font-bold shadow-lg flex items-center gap-1.5 border border-red-400"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>DO NOT CLICK LINKS</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* =======================================
              SCENE 5: Antivirus & Firewall (0:38 - 0:48)
             ======================================= */}
          {currentSceneId === 5 && (
            <motion.div 
              key="scene-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden"
            >
              {/* Defense simulation */}
              <div className="relative flex flex-col items-center justify-center w-full max-w-sm">
                
                {/* Pulsing neon shield orbits */}
                <div className="absolute w-52 h-52 rounded-full border border-blue-500/20 animate-ping opacity-25" />
                
                {/* Shield Circle representing Firewall */}
                <motion.div 
                  className="relative p-6 border-2 border-blue-500/50 rounded-full bg-blue-950/20 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex justify-center items-center z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Shield className="w-14 h-14 text-blue-400 stroke-[1.5]" />
                  <span className="absolute text-[8px] font-mono tracking-widest text-blue-300 bottom-2.5 font-bold animate-pulse">
                    FIREWALL ON
                  </span>
                </motion.div>

                {/* Central laptop component */}
                <div className="relative mt-2 p-3 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-20 flex items-center gap-2">
                  <Laptop className="w-6 h-6 text-neutral-400" />
                  <span className="text-[10px] font-mono text-neutral-400">Host Protection: Protected</span>
                </div>

                {/* Particles of virus attacks flying from bounds of video and exploding on shield */}
                {isPlaying && (
                  <>
                    {/* Attack Particle 1 */}
                    <motion.div 
                      key={`v1-${Math.floor(currentTime / 2)}`}
                      className="absolute w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-0"
                      initial={{ x: -160, y: -60 }}
                      animate={{ x: -30, y: -25, opacity: [1, 1, 0], scale: [1, 1.2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn' }}
                    />
                    {/* Flame impact 1 */}
                    <motion.div 
                      className="absolute w-6 h-6 rounded-full bg-blue-500 pointer-events-none blur-sm opacity-0"
                      initial={{ x: -30, y: -25 }}
                      animate={{ opacity: [0, 0.8, 0], scale: [0.2, 1.5, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
                    />

                    {/* Attack Particle 2 */}
                    <motion.div 
                      key={`v2-${Math.floor(currentTime / 2)}`}
                      className="absolute w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-0"
                      initial={{ x: 160, y: 40 }}
                      animate={{ x: 30, y: 15, opacity: [1, 1, 0], scale: [1, 1.2, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeIn', delay: 0.3 }}
                    />
                    {/* Flame impact 2 */}
                    <motion.div 
                      className="absolute w-6 h-6 rounded-full bg-blue-500 pointer-events-none blur-sm opacity-0"
                      initial={{ x: 30, y: 15 }}
                      animate={{ opacity: [0, 0.8, 0], scale: [0.2, 1.5, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
                    />

                    {/* Attack Particle 3 (Trojan payload) */}
                    <motion.div 
                      key={`v3-${Math.floor(currentTime / 2)}`}
                      className="absolute w-4 h-4 text-xs font-mono font-bold text-red-500 z-0 flex items-center justify-center"
                      initial={{ x: -120, y: 70 }}
                      animate={{ x: -25, y: 22, opacity: [1, 1, 0], scale: [1, 1.3, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeIn', delay: 0.6 }}
                    >
                      ☠️
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* =======================================
              SCENE 6: Backup Your Data (0:48 - 0:55)
             ======================================= */}
          {currentSceneId === 6 && (
            <motion.div 
              key="scene-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4"
            >
              <div className="max-w-md w-full grid grid-cols-5 gap-4 items-center">
                {/* Local Storage Machine */}
                <div className="col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-col items-center gap-2 shadow-lg">
                  <HardDrive className="w-8 h-8 text-indigo-400 stroke-[1.5]" />
                  <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-widest">Local Files</span>
                  
                  {/* Miniature localized documents */}
                  <div className="w-full space-y-1">
                    <div className="bg-neutral-950 p-1 rounded text-[8px] font-mono text-neutral-400 flex justify-between">
                      <span>📄 Taxes.xlsx</span>
                      <span className="text-emerald-500 font-bold">100% OK</span>
                    </div>
                    <div className="bg-neutral-950 p-1 rounded text-[8px] font-mono text-neutral-400 flex justify-between">
                      <span>🖼 Photos_zip.tar</span>
                      <span className="text-emerald-500 font-bold">100% OK</span>
                    </div>
                  </div>
                </div>

                {/* Floating Sync Pipeline */}
                <div className="col-span-1 flex flex-col items-center justify-center relative">
                  <div className="absolute w-[120%] border-t border-dashed border-blue-500/30 top-1/2 -translate-y-1/2 scale-x-[2]" />
                  <motion.div 
                    animate={{ x: [-20, 20] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="z-10 text-blue-400 text-xs"
                  >
                    📂
                  </motion.div>
                </div>

                {/* Secure Secure Cloud Backup Vault */}
                <div className="col-span-2 bg-gradient-to-br from-blue-950/40 to-slate-900/30 border border-blue-500/30 rounded-xl p-3 flex flex-col items-center gap-2 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-700 to-blue-500" />
                  <Cloud className="w-9 h-9 text-blue-400 stroke-[1.5] animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Cloud Backup</span>
                  
                  {/* Status Indicator bubble */}
                  <div className="p-1 px-1.5 rounded-full bg-blue-950 border border-blue-500/30 text-[8px] text-blue-400 font-bold flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                    <span>SYNCHRONIZED_SECURE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* =======================================
              SCENE 7: Outro (0:55 - 1:00)
             ======================================= */}
          {currentSceneId === 7 && (
            <motion.div 
              key="scene-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full bg-neutral-950 flex flex-col items-center justify-center p-4 text-center select-none"
            >
              {/* Heavy pulsing halo behind lock */}
              <div className="absolute w-44 h-44 rounded-full bg-emerald-500/5 blur-3xl animate-pulse" />

              <motion.div 
                initial={{ scale: 0.7, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80 }}
                className="relative p-6 border border-emerald-500/40 bg-neutral-900/80 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.15)] flex justify-center items-center mb-5"
              >
                <Lock className="w-16 h-16 text-emerald-400 stroke-[1.5]" />
                {/* Checkmark loop on shoulder */}
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-neutral-950 rounded-full border border-neutral-950 shadow">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </motion.div>

              {/* Glowing title with slide-in typography */}
              <motion.h3 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-sans font-bold text-neutral-100 text-lg sm:text-xl tracking-tight max-w-sm mb-1"
              >
                🔐 Cybersecurity Starts With You
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.4 }}
                className="text-[11px] text-neutral-400 font-mono tracking-wider uppercase"
              >
                STAY ALERT • STAY UPDATED • STAY SECURE
              </motion.p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Synchronized floating Overlay Text badge at the bottom of the visible frame */}
      <div id="video-onscreen-badge" className="absolute top-4 left-4 z-40 bg-neutral-900/90 border border-neutral-800/80 p-2.5 py-1 px-3 rounded-lg shadow-md font-sans text-xs font-semibold text-neutral-100 flex items-center gap-1.5 backdrop-blur">
        <span className="w-2 h-2 rounded-full bg-blue-450 animate-pulse" />
        <pre className="font-sans m-0 p-0 text-[10px] uppercase tracking-wider text-neutral-300">Live Shot Overlay</pre>
      </div>
    </div>
  );
};
