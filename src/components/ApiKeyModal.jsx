import React, { useState } from 'react';
import { Key, ShieldCheck, Zap, X, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { getActiveApiKey, setActiveApiKey } from '../hooks/useGemini';

export default function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [keyInput, setKeyInput] = useState(getActiveApiKey() || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setActiveApiKey(keyInput);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onKeyUpdated();
      onClose();
    }, 600);
  };

  const handleSwitchToOffline = () => {
    setKeyInput('');
    setActiveApiKey('');
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onKeyUpdated();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f111e] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white">Execution Engine & API Settings</h3>
            <p className="text-xs text-white/50">Configure Gemini 2.5 Flash or Offline Demo Mode</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Mode comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center gap-2 font-semibold text-emerald-400 mb-1">
                <Zap className="w-4 h-4" /> Live Gemini Mode
              </div>
              <p className="text-white/60 text-[11px] leading-relaxed">
                Connects directly to Google GenAI (`gemini-2.5-flash`). Enables infinite unscripted conversations and custom debate prompts.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-950/20">
              <div className="flex items-center gap-2 font-semibold text-blue-400 mb-1">
                <ShieldCheck className="w-4 h-4" /> Offline Knowledge Base
              </div>
              <p className="text-white/60 text-[11px] leading-relaxed">
                Zero configuration required. Instant responses, verified historical primary citations, and pre-scripted polymath debates.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <label className="block text-xs font-medium text-white/70">
              Google Gemini API Key:
            </label>
            <div className="relative">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy... or leave blank for offline mode"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-purple-500 focus:bg-white/8 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
              <span>Saved locally in your browser storage.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 underline"
              >
                Get free key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSwitchToOffline}
                className="flex-1 py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium transition-all"
              >
                Use Offline Mode
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-300" /> : 'Save & Connect'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
