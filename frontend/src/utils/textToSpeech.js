export function speak(text, options = {}) {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Default options
  const defaultOptions = {
    lang: "en-US",
    rate: 0.95,
    pitch: 1,
    volume: 1,
    onEnd: null,
    onError: null,
  };

  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };

  // Apply options
  utterance.lang = mergedOptions.lang;
  utterance.rate = mergedOptions.rate;
  utterance.pitch = mergedOptions.pitch;
  utterance.volume = mergedOptions.volume;

  if (mergedOptions.onEnd) {
    utterance.onend = mergedOptions.onEnd;
  }

  if (mergedOptions.onError) {
    utterance.onerror = mergedOptions.onError;
  }

  window.speechSynthesis.speak(utterance);
}

// Optional: Add a function to get available voices
export function getVoices() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
}
