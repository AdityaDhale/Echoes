import { useState, useEffect, useRef } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text, id = 'global', options = {}) => {
    if (!synthRef.current) return;

    if (isSpeaking && currentId === id) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentId(null);
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.95;
    utterance.pitch = options.pitch || 1.0;
    
    // Choose voice based on preference or language
    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Daniel')));
      if (preferred) utterance.voice = preferred;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentId(id);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentId(null);
    };

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentId(null);
    }
  };

  return { speak, stop, isSpeaking, currentId };
}
