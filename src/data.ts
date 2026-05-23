/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoScene } from './types';

export const DEFAULT_SCENES: VideoScene[] = [
  {
    id: 1,
    title: "Intro",
    start: 0,
    end: 5,
    category: 'intro',
    visualDescription: "Dark background with glowing laptop graphics, warning popups, and scrolling cyber code rain.",
    voiceover: "Every day, hackers target thousands of computers. But protecting yourself is easier than you think.",
    onScreenText: "🔒 Protect Your Computer"
  },
  {
    id: 2,
    title: "Strong Passwords",
    start: 5,
    end: 15,
    category: 'passwords',
    visualDescription: "A mock login form showing a weak password '123456' crumbling and upgrading to a strong, high-entropy password 'G7@pL!92x'.",
    voiceover: "Use strong passwords with letters, numbers, and symbols. Never use the same password for multiple accounts.",
    onScreenText: "✅ Strong Passwords\n❌ 123456\n✅ G7@pL!92x"
  },
  {
    id: 3,
    title: "Software Updates",
    start: 15,
    end: 25,
    category: 'updates',
    visualDescription: "Operating system panel installing critical security patches, showing progress loading and core modules locking together.",
    voiceover: "Always update your computer and apps. Updates fix security weaknesses hackers can exploit.",
    onScreenText: "🔄 Update Regularly"
  },
  {
    id: 4,
    title: "Avoid Suspicious Links",
    start: 25,
    end: 38,
    category: 'phishing',
    visualDescription: "An email inbox appearing with a suspicious 'You Won!' message. A cursor hovers and moves it directly into the secure shredder.",
    voiceover: "Never click suspicious links or download unknown files. Phishing scams are designed to steal your information.",
    onScreenText: "⚠️ Beware of Fake Emails"
  },
  {
    id: 5,
    title: "Antivirus & Firewall",
    start: 38,
    end: 48,
    category: 'antivirus',
    visualDescription: "A neon defensive firewall shield surrounding a computer, deflecting rogue malware particles harmlessly away.",
    voiceover: "Use antivirus software and keep your firewall turned on to block harmful attacks.",
    onScreenText: "🛡 Antivirus + Firewall"
  },
  {
    id: 6,
    title: "Backup Your Data",
    start: 48,
    end: 55,
    category: 'backup',
    visualDescription: "A visual pipeline from local folder indices to a secure cloud icon, showing files synchronizing with lock confirmations.",
    voiceover: "Back up important files regularly so you never lose your data.",
    onScreenText: "☁️ Backup Your Files"
  },
  {
    id: 7,
    title: "Outro",
    start: 55,
    end: 60,
    category: 'outro',
    visualDescription: "A central vault/safe lock emblem securing itself, followed by futuristic brand typography and a cyber-ready check.",
    voiceover: "Stay alert. Stay updated. Stay secure.",
    onScreenText: "🔐 Cybersecurity Starts With You"
  }
];
