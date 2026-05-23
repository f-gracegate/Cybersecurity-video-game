/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoScene {
  id: number;
  title: string;
  start: number; // in seconds
  end: number; // in seconds
  visualDescription: string;
  voiceover: string;
  onScreenText: string;
  category: 'intro' | 'passwords' | 'updates' | 'phishing' | 'antivirus' | 'backup' | 'outro';
}

export interface NarratorSettings {
  voiceEnabled: boolean;
  soundEffectsEnabled: boolean;
  rate: number;
  pitch: number;
  volume: number;
}

export interface SavedScript {
  id: string;
  title: string;
  prompt?: string;
  timestamp: string;
  scenes: VideoScene[];
}
