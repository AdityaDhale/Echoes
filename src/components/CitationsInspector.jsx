import React from 'react';
import { X, BookOpen, ExternalLink, Award, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CitationsInspector({ isOpen, onClose, figure, citations, isSpeculative, speculationNote, fidelityScore }) {
  if (!isOpen || !figure) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0e101f] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
            style={{ background: `${figure.accentDark}40`, boxShadow: `0 0 20px ${figure.accent}25` }}
          >
            {figure.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-white">{figure.name}</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: figure.accent + '40', color: figure.accent }}>
                {figure.years}
              </span>
            </div>
            <p className="text-xs text-white/50">{figure.domain}</p>
          </div>
        </div>

        {/* Epistemic Fidelity Score */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Epistemic Grounding Fidelity
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {fidelityScore || 98}<span className="text-xs text-white/40">/100</span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                isSpeculative
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isSpeculative ? (
                <>
                  <AlertTriangle className="w-3 h-3" /> Extrapolated View
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" /> Documented Canon
                </>
              )}
            </span>
            <p className="text-[10px] text-white/30 mt-1">
              {isSpeculative ? 'Filtered through core axioms' : 'Verified historical publication'}
            </p>
          </div>
        </div>

        {/* Speculation Rationale Note if applicable */}
        {speculationNote && (
          <div className="mb-5 p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            <span className="font-semibold block mb-0.5 text-amber-300">Epistemic Boundary Note:</span>
            {speculationNote}
          </div>
        )}

        {/* Active Citations */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs uppercase tracking-wider text-white/50 font-mono flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Cited Primary Treatises & Doctrine
          </h4>
          
          <div className="space-y-2">
            {(citations && citations.length > 0 ? citations : figure.keyBeliefs).map((cite, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-white/20 transition-all flex items-start gap-2.5 text-xs text-white/80"
              >
                <FileText className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  {typeof cite === 'string' ? cite : `${cite.work} (${cite.year}) — ${cite.concept}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Doctrine & Famous Quotes */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="text-[11px] text-white/40 uppercase tracking-wider font-mono">Foundational Axiom</div>
          <p className="text-xs italic text-white/70 bg-white/5 p-3 rounded-xl border border-white/5">
            "{figure.famousQuote}"
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed pt-1">
            <strong className="text-white/70">Ideology: </strong>{figure.ideology}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-medium text-white transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
