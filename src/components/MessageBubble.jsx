import React, { useState } from 'react';
import { BookOpen, Volume2, VolumeX, Copy, Check, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function MessageBubble({ message, figure, onInspectCitations, onSpeak, isSpeakingThis }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Figure Avatar */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg border border-white/10 mt-1 cursor-pointer transition-transform hover:scale-105"
          style={{ background: `${figure.accentDark}55`, boxShadow: `0 0 14px ${figure.accent}33` }}
          onClick={() => onInspectCitations(figure, message.citations, message.isSpeculative, message.speculationNote, message.fidelityScore)}
          title="Click to view citations & epistemic grounding"
        >
          {figure.emoji}
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {/* Name and Meta header */}
        {!isUser && (
          <div className="flex items-center gap-2 ml-1 text-xs">
            <span className="font-semibold" style={{ color: figure.accent }}>
              {figure.name}
            </span>
            <span className="text-[10px] text-white/30 font-mono">
              {figure.years}
            </span>

            {/* Speculation status badge */}
            {message.isSpeculative ? (
              <span 
                onClick={() => onInspectCitations(figure, message.citations, message.isSpeculative, message.speculationNote, message.fidelityScore)}
                className="cursor-pointer inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 hover:bg-amber-500/20 transition-colors"
                title={message.speculationNote || 'Extrapolated from documented philosophy'}
              >
                <AlertTriangle className="w-2.5 h-2.5" /> Extrapolated
              </span>
            ) : (
              <span 
                onClick={() => onInspectCitations(figure, message.citations, message.isSpeculative, message.speculationNote, message.fidelityScore)}
                className="cursor-pointer inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors"
                title="Verified historical primary canon"
              >
                <CheckCircle2 className="w-2.5 h-2.5" /> Grounded Canon
              </span>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`
            px-4 py-3.5 rounded-2xl text-sm leading-relaxed shadow-lg
            ${isUser
              ? 'bg-gradient-to-r from-purple-700 to-blue-700 text-white rounded-tr-sm border border-white/20'
              : 'rounded-tl-sm border border-white/10 text-white/95'
            }
          `}
          style={
            !isUser
              ? {
                  background: `linear-gradient(135deg, ${figure.accentDark}20, rgba(12,14,28,0.92))`,
                  borderColor: `${figure.accent}30`,
                }
              : {}
          }
        >
          {/* Paragraphs */}
          <div className="space-y-3 font-normal">
            {message.content.split('\n\n').map((para, i) => (
              <p key={i} className="leading-relaxed whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>

          {/* Citations pill footer for model messages */}
          {!isUser && message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <button
                onClick={() => onInspectCitations(figure, message.citations, message.isSpeculative, message.speculationNote, message.fidelityScore)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 hover:text-purple-200 border border-purple-500/20 transition-all text-[11px]"
              >
                <BookOpen className="w-3 h-3 text-purple-400" />
                <span>{message.citations.length} Verified Citation{message.citations.length > 1 ? 's' : ''}</span>
              </button>

              <div className="flex items-center gap-1.5 text-white/40">
                <button
                  onClick={() => onSpeak(message.content, `msg-${message.timestamp}`)}
                  className={`p-1 rounded-md hover:bg-white/10 transition-colors ${isSpeakingThis ? 'text-amber-400' : 'hover:text-white'}`}
                  title={isSpeakingThis ? 'Stop reading' : 'Read aloud with audio synthesis'}
                >
                  {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleCopy}
                  className="p-1 rounded-md hover:bg-white/10 hover:text-white transition-colors"
                  title="Copy text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 px-1 text-[10px] text-white/30 font-mono">
          <span>
            {new Date(message.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.isFallback && (
            <span className="text-amber-400/80">· Historical Archive Mode</span>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-sm mt-1 shadow-md">
          🧑
        </div>
      )}
    </div>
  );
}
