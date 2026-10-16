import React from 'react';
import { MessageSquare, Users, Compass, BookOpen, Key, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { getActiveApiKey } from '../hooks/useGemini';

export default function Navbar({ activeTab, setActiveTab, onOpenApiKeyModal, isOfflineMode }) {
  const apiKey = getActiveApiKey();
  const hasKey = apiKey && apiKey !== 'offline' && apiKey !== 'your_gemini_api_key_here';

  return (
    <header className="sticky top-0 z-40 bg-[#07070f]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('chat')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-blue-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#07070f] rounded-[10px] flex items-center justify-center text-lg">
              ⏳
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-white tracking-tight">EUREKA ECHOES</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                2.0
              </span>
            </div>
            <p className="text-[11px] text-white/40 hidden sm:block">
              Council of Polymaths & Socratic Historical AI
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Socratic Chat</span>
            <span className="md:hidden">Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('council')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'council'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Council of Polymaths</span>
            <span className="md:hidden">Debate</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Subject Matrix</span>
            <span className="md:hidden">Tracks</span>
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'research'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Research Paper</span>
            <span className="md:hidden">Paper</span>
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
              hasKey
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/30'
            }`}
            title="Click to view or change API mode"
          >
            <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="hidden sm:inline font-mono text-[11px]">
              {hasKey ? 'Gemini 2.5 Flash' : 'Offline Knowledge Base'}
            </span>
            <Key className="w-3 h-3 opacity-70" />
          </button>
        </div>
      </div>
    </header>
  );
}
