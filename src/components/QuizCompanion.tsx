/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Key, ShieldCheck, Mail, AlertTriangle, EyeOff, CheckCircle, 
  RefreshCw, Cpu, Database, Save, ArrowRight
} from 'lucide-react';

export const QuizCompanion: React.FC = () => {
  // 1. Password checker state variables
  const [testPassword, setTestPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  // Simple client-side entropy evaluator
  const evaluatePassword = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-neutral-800' };
    let points = 0;
    if (pwd.length >= 8) points += 1;
    if (pwd.length >= 12) points += 1;
    if (/[A-Z]/.test(pwd)) points += 1;
    if (/[a-z]/.test(pwd)) points += 1;
    if (/[0-9]/.test(pwd)) points += 1;
    if (/[@$!%*?&#]/.test(pwd)) points += 1;

    if (points <= 2) return { score: 20, label: 'Extremely Weak ❌', color: 'bg-red-500 text-red-100', rating: 'weak' };
    if (points <= 4) return { score: 50, label: 'Moderate / Vulnerable ⚠️', color: 'bg-amber-500 text-neutral-950', rating: 'medium' };
    return { score: points * 14.5, label: 'Military-Grade Safe ✅', color: 'bg-emerald-500 text-neutral-950', rating: 'strong' };
  };

  const scoreDetails = evaluatePassword(testPassword);

  // 2. Incident Phishing Sandbox state
  const PHISHING_EMAILS = [
    {
      id: 1,
      sender: "PayPai Service <support@paypaI-updates-login.info>",
      subject: "⚠️ CRITICAL ALERT: Account Suspended. Login Immediately!",
      body: "We discovered unusual activity. Choose this link below to authenticate your identity immediately or face lifetime freeze.",
      linkText: "ACTIVATE SECURE ACCOUNT",
      isPhishing: true,
      hint: "Look closely at the sender domain spelling, 'paypaI' ends with a capital 'I' instead of 'l', and the domain '.info' is highly irregular."
    },
    {
      id: 2,
      sender: "Google Security Team <no-reply@accounts.google.com>",
      subject: "New sign-in info on Linux device",
      body: "A new login was recorded on a computer near Dublin, Ireland. If this was you, no action is required.",
      linkText: "Check login activity",
      isPhishing: false,
      hint: "Sent from the official '@accounts.google.com' address and does not demand urgent actions or passwords via inline links."
    }
  ];

  const [currentEmailIdx, setCurrentEmailIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const activeEmail = PHISHING_EMAILS[currentEmailIdx];

  const handleQuizAnswer = (isP: boolean) => {
    setSelectedAnswer(isP);
    if (isP === activeEmail.isPhishing) {
      setQuizScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentEmailIdx((currentEmailIdx + 1) % PHISHING_EMAILS.length);
  };

  return (
    <div id="quiz-companion-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
      
      {/* CARD 1: Real-time Password Strength Lab */}
      <div className="bg-[#0a0a0a]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="p-1 px-[7px] bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Interactive Password Strength Lab
              </h3>
              <p className="text-[10px] text-slate-500">Practice Scene 2: Check Entropy and Resistance</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Type any password pattern here to test how fast computers could crack it. 
            Remember the lesson: <strong>Never use the same password twice</strong>.
          </p>

          <div className="space-y-3">
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Type password..."
                className="w-full bg-[#050505] border border-slate-800 focus:border-blue-500 duration-200 rounded-xl py-2.5 pl-3.5 pr-11 text-xs font-mono text-white"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-505 hover:text-slate-350"
              >
                👁️
              </button>
            </div>

            {/* Quick Presets matching Video */}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-slate-550 uppercase font-mono">Failsafe Presets:</span>
              <button 
                onClick={() => { setTestPassword('123456'); setShowPassword(true); }}
                className="bg-[#050505] border border-red-950 px-2 py-0.5 rounded text-red-500 font-mono hover:bg-slate-900 cursor-pointer"
              >
                123456
              </button>
              <button 
                onClick={() => { setTestPassword('G7@pL!92x'); setShowPassword(true); }}
                className="bg-[#050505] border border-emerald-950 px-2 py-0.5 rounded text-emerald-400 font-mono hover:bg-slate-900 font-bold cursor-pointer"
              >
                G7@pL!92x
              </button>
            </div>

            {/* Strength readout bar slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-405 font-medium">Password Integrity Result:</span>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                  {scoreDetails.label}
                </span>
              </div>
              <div className="h-2 w-full bg-[#050505] border border-slate-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    scoreDetails.rating === 'weak' 
                      ? 'bg-red-500' 
                      : scoreDetails.rating === 'medium' 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${scoreDetails.score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 font-mono">
            CRACK RESISTANCE METRIC
          </div>
          <span className="text-[10px] p-1 bg-[#050505] text-slate-400 rounded px-1.5 font-mono">
            {scoreDetails.rating === 'weak' ? '⏱️ Cracked in 1 Millisecond' : scoreDetails.rating === 'medium' ? '⏱️ Cracked in 2 Days' : '⚔️ Uncrackable (Trillions of Years)'}
          </span>
        </div>
      </div>

      {/* CARD 2: Scene 4 Spot the Phishing Scam Widget */}
      <div className="bg-[#0a0a0a]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="p-1 px-[7px] bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Spot-the-Scam Email Sandbox
              </h3>
              <p className="text-[10px] text-slate-500">Practice Scene 4: Recognize and Deflect Scams</p>
            </div>
            <span className="ml-auto p-1 bg-[#050505] text-slate-400 rounded text-[9px] font-mono font-bold">
              QUIZ SCORE: {quizScore}
            </span>
          </div>

          <p className="text-[11px] text-slate-405 leading-relaxed">
            Phishing emails are designed to steal your information. Test your reflexes on the mock email below:
          </p>

          <div className="bg-[#050505] border border-slate-800 rounded-xl p-3.5 space-y-2.5 relative">
            <div className="text-[10px] space-y-1 pb-1.5 border-b border-slate-800">
              <p><span className="text-slate-505">SENDER:</span> <span className="font-mono text-slate-300 font-bold">{activeEmail.sender}</span></p>
              <p><span className="text-slate-505">SUBJECT:</span> <span className="text-slate-200 font-semibold">{activeEmail.subject}</span></p>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              “{activeEmail.body}”
            </p>

            <span className="inline-block bg-[#0a0a0a] border border-slate-800/80 text-[9px] font-mono text-blue-400 px-2.5 py-1 rounded select-none">
              👉 {activeEmail.linkText}
            </span>

            {/* Answer select buttons */}
            {!showExplanation ? (
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => handleQuizAnswer(false)}
                  className="flex-1 py-1.5 bg-slate-900 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-semibold font-sans border border-slate-800/80 cursor-pointer"
                >
                  🟢 Looks Safe / Keep
                </button>
                <button 
                  onClick={() => handleQuizAnswer(true)}
                  className="flex-1 py-1.5 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/20 rounded-lg text-xs font-semibold font-sans cursor-pointer"
                >
                  🚨 Phishing / Spam Trash
                </button>
              </div>
            ) : (
              <div className="pt-2 text-[11px] space-y-2">
                <div className={`p-2 rounded-lg font-medium ${
                  selectedAnswer === activeEmail.isPhishing 
                    ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-950/40 border border-red-500/20 text-red-400'
                }`}>
                  {selectedAnswer === activeEmail.isPhishing ? '🎉 CORRECT DECISION!' : '❌ VULNERABLE DISCOVERED!'}
                </div>
                <p className="text-slate-405 leading-normal">
                  <span className="font-bold text-slate-200">Director Tip:</span> {activeEmail.hint}
                </p>
                <button 
                  onClick={handleNextQuiz}
                  className="py-1 px-3 bg-[#0a0a0a] border border-slate-800 text-blue-400 hover:text-blue-300 rounded text-[10px] font-mono font-bold flex items-center gap-1 mt-1 ml-auto cursor-pointer"
                >
                  Next Trial <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
