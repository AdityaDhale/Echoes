import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FigureSelector from './components/FigureSelector';
import ChatInterface from './components/ChatInterface';
import CouncilDebate from './components/CouncilDebate';
import SubjectMatrix from './components/SubjectMatrix';
import ResearchPaperView from './components/ResearchPaperView';
import CitationsInspector from './components/CitationsInspector';
import ApiKeyModal from './components/ApiKeyModal';
import { figures } from './data/figures';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCouncilFigures, setSelectedCouncilFigures] = useState([figures[0], figures[1]]);
  
  // Citations Inspector modal state
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorFigure, setInspectorFigure] = useState(null);
  const [inspectorCitations, setInspectorCitations] = useState([]);
  const [inspectorIsSpeculative, setInspectorIsSpeculative] = useState(false);
  const [inspectorSpecNote, setInspectorSpecNote] = useState('');
  const [inspectorFidelity, setInspectorFidelity] = useState(98);

  // API Key modal
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [keyRefreshCounter, setKeyRefreshCounter] = useState(0);

  const handleSelectFigure = (figure) => {
    setSelectedFigure(figure);
    setActiveTab('chat');
  };

  const handleBackToGallery = () => {
    setSelectedFigure(null);
  };

  const handleToggleCouncilFigure = (figure) => {
    if (selectedCouncilFigures.some(f => f.id === figure.id)) {
      setSelectedCouncilFigures(prev => prev.filter(f => f.id !== figure.id));
    } else {
      if (selectedCouncilFigures.length >= 4) {
        alert('The Council can hold up to 4 members simultaneously.');
        return;
      }
      setSelectedCouncilFigures(prev => [...prev, figure]);
    }
  };

  const handleStartCouncilWithFigures = () => {
    setActiveTab('council');
  };

  const handleOpenCitationsInspector = (figure, citations, isSpeculative, specNote, fidelity) => {
    setInspectorFigure(figure);
    setInspectorCitations(citations || []);
    setInspectorIsSpeculative(Boolean(isSpeculative));
    setInspectorSpecNote(specNote || '');
    setInspectorFidelity(fidelity || 98);
    setInspectorOpen(true);
  };

  const handleSelectCategoryDilemma = (category, dilemma) => {
    setActiveTab('council');
  };

  const handleInterviewFigure = (fig) => {
    setSelectedFigure(fig);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#07070f] text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Dynamic Starfield & Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#07070f] to-slate-950" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-1/6 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl bg-blue-600 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl bg-purple-600 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'chat') setSelectedFigure(null);
        }}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
      />

      {/* Hero Header for Top-Level Browsing */}
      {!selectedFigure && activeTab === 'chat' && (
        <header className="relative z-10 px-4 sm:px-6 pt-8 pb-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-mono tracking-widest uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            EurekaDev Hackathon 2026 · Coding & Research Tracks
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-3">
            EUREKA ECHOES
          </h1>
          <p className="text-white/60 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
            Engage with 25 of history’s greatest minds. Every response strictly grounded in verified primary treatises, historical epistemology, and Socratic dialectic.
          </p>
        </header>
      )}

      {/* Content Container */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        {activeTab === 'chat' && (
          selectedFigure ? (
            <ChatInterface
              figure={selectedFigure}
              onBack={handleBackToGallery}
              onInspectCitations={handleOpenCitationsInspector}
            />
          ) : (
            <FigureSelector
              onSelect={handleSelectFigure}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedCouncilFigures={selectedCouncilFigures}
              onToggleCouncilFigure={handleToggleCouncilFigure}
              onStartCouncilWithFigures={handleStartCouncilWithFigures}
            />
          )
        )}

        {activeTab === 'council' && (
          <CouncilDebate
            onInspectCitations={handleOpenCitationsInspector}
          />
        )}

        {activeTab === 'matrix' && (
          <SubjectMatrix
            onSelectCategoryDilemma={handleSelectCategoryDilemma}
            onInterviewFigure={handleInterviewFigure}
          />
        )}

        {activeTab === 'research' && (
          <ResearchPaperView />
        )}
      </main>

      {/* Footer */}
      {!selectedFigure && (
        <footer className="relative z-10 flex-shrink-0 text-center py-6 text-white/30 text-xs font-mono border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>EurekaDev 2026 · Hybrid Coding & Research Track Submission</span>
            <span>Google Gemini 2.5 Flash API · React 18 · TailwindCSS</span>
          </div>
        </footer>
      )}

      {/* Citations Inspector Modal */}
      <CitationsInspector
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        figure={inspectorFigure}
        citations={inspectorCitations}
        isSpeculative={inspectorIsSpeculative}
        speculationNote={inspectorSpecNote}
        fidelityScore={inspectorFidelity}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onKeyUpdated={() => setKeyRefreshCounter(c => c + 1)}
      />
    </div>
  );
}
