import React, { useState, useEffect } from 'react';
import { Users, Play, Pause, FastForward, RotateCcw, Award, BookOpen, Volume2, VolumeX, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { figures } from '../data/figures';
import { councilDebates } from '../data/offlineSimulations';
import { generateCouncilTurn } from '../hooks/useGemini';
import { useSpeech } from '../hooks/useSpeech';

export default function CouncilDebate({ onInspectCitations }) {
  const [selectedDebate, setSelectedDebate] = useState(councilDebates[0]);
  const [activeCouncil, setActiveCouncil] = useState(['turing', 'einstein', 'socrates', 'ada']);
  const [customTopic, setCustomTopic] = useState('');
  const [speeches, setSpeeches] = useState(councilDebates[0].rounds || []);
  const [synthesis, setSynthesis] = useState(councilDebates[0].synthesis || '');
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const { speak, stop, isSpeaking, currentId } = useSpeech();

  // Load preset debate
  const handleSelectPreset = (debate) => {
    stop();
    setSelectedDebate(debate);
    setActiveCouncil(debate.participants);
    setSpeeches(debate.rounds || []);
    setSynthesis(debate.synthesis || '');
    setCurrentSpeakerIndex(0);
    setIsAutoPlaying(false);
  };

  // Trigger next speaker turn
  const handleGenerateNextTurn = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      // Pick next figure in council sequence
      const nextFigureId = activeCouncil[speeches.length % activeCouncil.length];
      const figure = figures.find(f => f.id === nextFigureId) || figures[0];

      const topicText = selectedDebate ? selectedDebate.topic : customTopic;
      const priorTurns = speeches.map(s => {
        const fig = figures.find(f => f.id === s.figureId);
        return {
          figureName: fig ? fig.name : s.figureId,
          speech: s.speech,
        };
      });

      const nextTurn = await generateCouncilTurn(figure, topicText, priorTurns);

      setSpeeches(prev => [...prev, nextTurn]);
      setCurrentSpeakerIndex(speeches.length);

      // Play audio narration for the newly generated speech
      speak(nextTurn.speech, `council-turn-${speeches.length}`);

      if (speeches.length >= 5 && !synthesis) {
        setSynthesis(`The Council has deliberated across foundational axes: ${activeCouncil.map(id => figures.find(f => f.id === id)?.name).join(', ')}. Epistemic consensus reveals that technical metrics cannot be separated from moral virtue and material distribution.`);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Failed to generate council turn:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset debate
  const handleResetDebate = () => {
    stop();
    setIsAutoPlaying(false);
    if (selectedDebate) {
      setSpeeches(selectedDebate.rounds || []);
      setSynthesis(selectedDebate.synthesis || '');
    } else {
      setSpeeches([]);
      setSynthesis('');
    }
  };

  // Export debate transcript as markdown
  const handleExportTranscript = () => {
    const topic = selectedDebate ? selectedDebate.title : customTopic;
    let md = `# The Council of Polymaths — Debate Transcript\n\n`;
    md += `**Topic:** ${topic}\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Council Members:** ${activeCouncil.map(id => figures.find(f => f.id === id)?.name).join(', ')}\n\n`;
    md += `## Arguments & Treatises Cited\n\n`;

    speeches.forEach((turn, idx) => {
      const fig = figures.find(f => f.id === turn.figureId);
      md += `### Round ${idx + 1}: ${fig?.name || turn.figureId} (${fig?.years || ''})\n`;
      md += `> ${turn.speech}\n\n`;
      md += `*Primary Citation:* ${turn.citation}\n\n---\n\n`;
    });

    if (synthesis) {
      md += `## Council Epistemic Synthesis\n\n${synthesis}\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `council-debate-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono uppercase tracking-widest mb-1.5">
              <Users className="w-4 h-4" /> Multi-Agent Socratic Debate Assembly
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The Council of Polymaths
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Watch history's greatest intellects challenge each other's assumptions in real-time, grounding every rebuttal in primary treatises and historical epistemology.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportTranscript}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Transcript</span>
            </button>

            <button
              onClick={handleResetDebate}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
              title="Reset debate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Preset Debates Switcher */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-mono uppercase text-white/40 mr-1">Presets:</span>
          {councilDebates.map(debate => (
            <button
              key={debate.id}
              onClick={() => handleSelectPreset(debate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedDebate?.id === debate.id
                  ? 'bg-purple-600/80 border-purple-400 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {debate.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Council Members Assembly Podium */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {activeCouncil.map((figId, index) => {
          const fig = figures.find(f => f.id === figId) || figures[0];
          const isCurrentSpeaker = speeches[currentSpeakerIndex]?.figureId === figId;

          return (
            <div
              key={fig.id}
              onClick={() => {
                const speechIdx = speeches.findIndex(s => s.figureId === figId);
                if (speechIdx !== -1) setCurrentSpeakerIndex(speechIdx);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isCurrentSpeaker
                  ? 'border-purple-400 bg-purple-950/40 shadow-lg shadow-purple-500/20 scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:bg-white/8'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border border-white/10"
                  style={{ background: `${fig.accentDark}40` }}
                >
                  {fig.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-xs text-white truncate">{fig.name}</h4>
                  <p className="text-[10px] text-white/40 truncate">{fig.domain}</p>
                </div>
              </div>

              <div className="text-[10px] italic text-white/70 line-clamp-1 border-l pl-1.5" style={{ borderColor: fig.accent }}>
                "{fig.famousQuote}"
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Debate Stage & Turns */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-white/10 bg-black/30 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/40 font-mono uppercase tracking-wider">Current Deliberation</div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-white">
              {selectedDebate?.title || customTopic || 'Socratic Assembly'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateNextTurn}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating Turn...' : 'Advance Next Turn'}</span>
            </button>
          </div>
        </div>

        {/* Turn-by-turn speeches */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[500px] overflow-y-auto scrollbar-thin">
          {speeches.map((turn, i) => {
            const fig = figures.find(f => f.id === turn.figureId) || figures[0];
            const isSpeakingTurn = isSpeaking && currentId === `council-turn-${i}`;

            return (
              <div
                key={i}
                className="p-5 rounded-2xl border transition-all animate-slide-up relative"
                style={{
                  background: `linear-gradient(135deg, ${fig.accentDark}15, rgba(10,12,25,0.85))`,
                  borderColor: `${fig.accent}30`,
                }}
              >
                {/* Speaker Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border border-white/10"
                      style={{ background: `${fig.accentDark}50` }}
                    >
                      {fig.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-white">{fig.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: fig.accent + '40', color: fig.accent }}>
                          Round {i + 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50">{fig.domain}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speak(turn.speech, `council-turn-${i}`)}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                        isSpeakingTurn ? 'text-amber-400' : 'text-white/60 hover:text-white'
                      }`}
                      title={isSpeakingTurn ? 'Stop reading' : 'Listen with Speech Synthesis'}
                    >
                      {isSpeakingTurn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Speech content */}
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal whitespace-pre-line">
                  {turn.speech}
                </p>

                {/* Primary Citation Badge */}
                {turn.citation && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-white/50 font-mono flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-purple-400" /> Grounded In:
                    </span>
                    <span className="text-purple-300 font-medium italic">
                      {turn.citation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Synthesis Box */}
        {synthesis && (
          <div className="p-5 border-t border-white/10 bg-gradient-to-r from-purple-950/40 via-blue-950/40 to-slate-950/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold mb-1">
                Council Epistemic Resolution & Synthesis
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                {synthesis}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
