import React from 'react';
import { Search, Sparkles, MessageSquare, Plus, Check, Award } from 'lucide-react';
import { figures } from '../data/figures';

const categories = [
  { id: 'all', label: 'All Figures (25)' },
  { id: 'Philosophy', label: 'Philosophy & Ethics' },
  { id: 'Science', label: 'Science & Physics' },
  { id: 'Computing', label: 'Mathematics & AI' },
  { id: 'Politics', label: 'Politics & Justice' },
  { id: 'Economics', label: 'Economics & Labor' },
  { id: 'Strategy', label: 'Strategy & Leadership' },
];

function getCategoryMatch(figure, cat) {
  if (cat === 'all') return true;
  const domain = figure.domain.toLowerCase();
  const map = {
    Philosophy: ['philosophy', 'ethics', 'existential', 'stoic', 'socratic'],
    Science: ['physics', 'mathematics', 'biology', 'chemistry', 'natural science', 'cosmology', 'psychology'],
    Computing: ['computing', 'mathematics', 'turing', 'lovelace', 'computer'],
    Politics: ['politics', 'political', 'leadership', 'justice', 'diplomacy', 'rights'],
    Economics: ['economics', 'socialism', 'labor', 'production', 'marx'],
    Strategy: ['military', 'strategy', 'war', 'tzu'],
  };
  return (map[cat] || []).some((keyword) => domain.includes(keyword));
}

export default function FigureSelector({
  onSelect,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  selectedCouncilFigures = [],
  onToggleCouncilFigure,
  onStartCouncilWithFigures
}) {
  const filtered = figures.filter((f) => {
    const matchesSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.era.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.ideology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.keyBeliefs && f.keyBeliefs.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCat = getCategoryMatch(f, activeCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by genius name, doctrine (e.g. determinism, imitation game, surplus value)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Council Quick Bar if figures selected */}
        {selectedCouncilFigures.length > 0 && (
          <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 px-3 py-2 rounded-xl animate-fade-in">
            <span className="text-xs text-purple-200">
              Council: <strong>{selectedCouncilFigures.length}</strong> selected
            </span>
            <button
              onClick={onStartCouncilWithFigures}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all"
            >
              Launch Debate →
            </button>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-white/20 text-white shadow-md'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Figures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((figure) => {
          const isSelectedForCouncil = selectedCouncilFigures.some(f => f.id === figure.id);

          return (
            <div
              key={figure.id}
              className="group relative rounded-2xl p-5 border border-white/10 transition-all duration-300 hover:border-white/25 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${figure.accentDark}15, rgba(13,15,30,0.85))`,
              }}
            >
              {/* Background ambient glow on hover */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                style={{ background: figure.accent }}
              />

              <div>
                {/* Header with Emoji and Name */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10 flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        background: `${figure.accentDark}35`,
                        boxShadow: `0 0 16px ${figure.accent}25`,
                      }}
                    >
                      {figure.emoji}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-white group-hover:text-purple-200 transition-colors">
                        {figure.name}
                      </h3>
                      <p className="text-xs font-mono" style={{ color: figure.accent }}>
                        {figure.years}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/40">
                    {figure.era}
                  </span>
                </div>

                {/* Domain & Nationality */}
                <p className="text-xs text-white/60 mb-2 font-medium">
                  {figure.domain} · <span className="text-white/40">{figure.nationality}</span>
                </p>

                {/* Famous Quote */}
                <p className="text-xs italic text-white/80 border-l-2 pl-2.5 py-0.5 mb-3 line-clamp-2" style={{ borderColor: figure.accent + '80' }}>
                  "{figure.famousQuote}"
                </p>

                {/* Key Beliefs Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {figure.keyBeliefs.slice(0, 3).map((belief, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full border bg-white/5 text-white/60"
                      style={{ borderColor: figure.accent + '25' }}
                    >
                      {belief}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => onSelect(figure)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" style={{ color: figure.accent }} />
                  <span>Socratic Chat</span>
                </button>

                <button
                  onClick={() => onToggleCouncilFigure(figure)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all border ${
                    isSelectedForCouncil
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  title={isSelectedForCouncil ? 'Remove from Council debate' : 'Add to Council debate'}
                >
                  {isSelectedForCouncil ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">Council</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
