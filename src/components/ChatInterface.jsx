import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, BookOpen, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sendMessageToFigure } from '../hooks/useGemini';
import MessageBubble from './MessageBubble';
import { useSpeech } from '../hooks/useSpeech';

export default function ChatInterface({ figure, onBack, onInspectCitations }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { speak, stop, isSpeaking, currentId } = useSpeech();

  // Figure-specific suggestions
  const suggestions = [
    `What do you think about modern artificial intelligence and machine learning?`,
    `How does your core philosophy address modern wealth inequality and automation?`,
    `If you could witness one modern scientific breakthrough, what would you ask?`,
    `What advice would you give to researchers working on high-stakes global challenges?`
  ];

  // Welcome message on mount
  useEffect(() => {
    const welcomeText = figure.id === 'einstein'
      ? "Greetings, my friend. I am Albert Einstein. Step into my study in Princeton. Whether you wish to discuss the curved geometry of spacetime, the determinism of physical law, or the moral obligations of our scientific age—I am at your service. Tell me, what questions occupy your thoughts?"
      : figure.id === 'turing'
      ? "Good day. Alan Turing here. Do pull up a chair. I am quite accustomed to parsing difficult codes and investigating what mechanical procedures can accomplish. Are we investigating computable numbers, morphological biology, or perhaps the imitation game? Let us begin with clear definitions."
      : figure.id === 'socrates'
      ? "Greetings, citizen. I am Socrates of Athens. I must warn you: I possess no wisdom of my own, save this one small thing—that I know that I know nothing. But if you are willing to examine your assumptions and seek virtue together, let us begin our dialogue."
      : `Greetings. I am ${figure.name}. In my lifetime (${figure.years}), I dedicated my mind to ${figure.domain}. As I once noted: "${figure.famousQuote}" How may I assist your inquiry today?`;

    const welcome = {
      role: 'model',
      content: welcomeText,
      timestamp: Date.now(),
      citations: figure.keyBeliefs.map(b => `${figure.name} Documented Doctrine: ${b}`),
      isSpeculative: false,
      fidelityScore: 100,
    };
    setMessages([welcome]);
    setTimeout(() => inputRef.current?.focus(), 200);

    return () => {
      stop();
    };
  }, [figure]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setError(null);
    const userMsg = { role: 'user', content: text, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Build valid history pairs
      const history = updatedMessages
        .filter((_, idx) => idx > 0 || updatedMessages.length === 1)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await sendMessageToFigure(figure, history, text);

      const modelMsg = {
        role: 'model',
        content: response.content,
        timestamp: Date.now(),
        citations: response.citations,
        isSpeculative: response.isSpeculative,
        speculationNote: response.speculationNote,
        fidelityScore: response.fidelityScore,
        isFallback: response.isFallback,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during dialogue synthesis.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    stop();
    setMessages([
      {
        role: 'model',
        content: `Conversation refreshed with ${figure.name}. What topic shall we explore?`,
        timestamp: Date.now(),
        citations: [],
        isSpeculative: false,
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto w-full glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10"
        style={{ background: `linear-gradient(135deg, ${figure.accentDark}25, rgba(10,12,24,0.9))` }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Gallery</span>
          </button>

          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border border-white/10 flex-shrink-0"
            style={{ background: `${figure.accentDark}50`, boxShadow: `0 0 16px ${figure.accent}30` }}
          >
            {figure.emoji}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base text-white">{figure.name}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: figure.accent + '40', color: figure.accent }}>
                {figure.years}
              </span>
            </div>
            <p className="text-xs text-white/50 truncate max-w-xs sm:max-w-md">{figure.domain}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onInspectCitations(figure, figure.keyBeliefs.map(b => `${figure.name} Axiom: ${b}`), false, '', 100)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 hover:text-purple-200 border border-purple-500/20 text-xs font-medium transition-all"
            title="Inspect historical treatises and citations"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Citations Canon</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Clear & restart conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 scrollbar-thin">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            figure={figure}
            onInspectCitations={onInspectCitations}
            onSpeak={speak}
            isSpeakingThis={isSpeaking && currentId === `msg-${msg.timestamp}`}
          />
        ))}

        {/* Loading state */}
        {loading && (
          <div className="flex gap-3 items-start animate-fade-in">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border border-white/10 flex-shrink-0 animate-pulse"
              style={{ background: `${figure.accentDark}50` }}
            >
              {figure.emoji}
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-sm border text-xs"
              style={{ background: `${figure.accentDark}20`, borderColor: `${figure.accent}30` }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: figure.accent, animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: figure.accent, animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: figure.accent, animationDelay: '300ms' }} />
                <span className="italic text-white/60 ml-1">
                  Synthesizing Socratic response from {figure.name}'s historical canon...
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested Inquiries */}
      {messages.length <= 2 && (
        <div className="px-4 sm:px-6 py-2 border-t border-white/5 bg-black/20">
          <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" /> Socratic Inquiries:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {suggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all text-left"
              >
                {q.length > 55 ? q.slice(0, 52) + '...' : q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 border-t border-white/10 bg-[#07070f]/90 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Address ${figure.name} (e.g. "How would you solve modern climate tipping points?")...`}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
