import { useCallback, useRef } from 'react';

const LABELS_PT = {
  agua: 'Água',
  comer: 'Comer',
  brincar: 'Brincar',
  mais: 'Mais',
  dormir: 'Dormir',
  nao: 'Não',
};

export function useSound() {
  const utteranceRef = useRef(null);

  const speak = useCallback((text, options = {}) => {
    if (!window.speechSynthesis) return;

    // Cancelar fala em curso
    window.speechSynthesis.cancel();

    const label = LABELS_PT[text] || text;
    const utterance = new SpeechSynthesisUtterance(label);

    utterance.lang = 'pt-BR';
    utterance.rate = options.rate ?? 0.85;
    utterance.pitch = options.pitch ?? 1.1;
    utterance.volume = options.volume ?? 1.0;

    // Tentar usar voz feminina em PT-BR
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoice = voices.find(
      (v) =>
        v.lang.includes('pt-BR') ||
        v.lang.includes('pt_BR') ||
        v.name.includes('Brazil')
    );
    if (ptBrVoice) utterance.voice = ptBrVoice;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return { speak, stop, isSupported };
}
