import React from 'react';
import { Compass, Users, MessageSquare, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { eurekaCategories } from '../data/eurekaCategories';
import { figures } from '../data/figures';

export default function SubjectMatrix({ onSelectCategoryDilemma, onInterviewFigure }) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-mono uppercase tracking-widest mb-1.5">
          <Compass className="w-4 h-4" /> EurekaDev 2026 Innovation Matrix
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Cross-Disciplinary Subject Categories
        </h2>
        <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          Explore the 6 core tracks of the EurekaDev Hackathon. Launch targeted multi-agent polymath debates or 1-on-1 Socratic interviews on defining challenges of our era.
        </p>
      </div>

      {/* 6 Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {eurekaCategories.map((cat) => {
          const recFigures = cat.recommendedFigures
            .map(id => figures.find(f => f.id === id))
            .filter(Boolean);

          return (
            <div
              key={cat.id}
              className="glass-card rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border border-white/10"
                    style={{ background: cat.accent + '25', borderColor: cat.accent + '40' }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">{cat.name}</h3>
                    <span className="text-[10px] font-mono uppercase text-white/40">Track Category</span>
                  </div>
                </div>

                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Recommended Figures */}
                <div className="mb-4">
                  <div className="text-[10px] font-mono uppercase text-white/40 mb-1.5">Recommended Polymaths:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {recFigures.map(fig => (
                      <button
                        key={fig.id}
                        onClick={() => onInterviewFigure(fig)}
                        className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 transition-all"
                        title={`Interview ${fig.name}`}
                      >
                        <span>{fig.emoji}</span>
                        <span>{fig.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured Prompts */}
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-mono uppercase text-white/40">Featured Dilemmas:</div>
                  {cat.prompts.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectCategoryDilemma(cat, p)}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 hover:bg-white/8 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-white/90 group-hover:text-purple-300">
                        <span>{p.title}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[10px] text-purple-400/80 font-mono">{p.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action */}
              <button
                onClick={() => onSelectCategoryDilemma(cat, cat.prompts[0])}
                className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-purple-600/30 text-white text-xs font-semibold border border-white/10 hover:border-purple-500/40 flex items-center justify-center gap-1.5 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Launch Council on {cat.name.split(' ')[0]}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
