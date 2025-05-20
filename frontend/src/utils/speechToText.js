import { useState, useEffect, useRef, useCallback } from "react";

export function useSpeechToText(options = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Default options
  const defaultOptions = {
    lang: "en-US",
    interimResults: true,
    continuous: false,
    onStart: null,
    onEnd: null,
    onError: null,
    onResult: null,
  };

  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError("Speech Recognition not supported in this browser");
      return;
    }

    recognitionRef.current = new SR();
    recognitionRef.current.lang = mergedOptions.lang;
    recognitionRef.current.interimResults = mergedOptions.interimResults;
    recognitionRef.current.continuous = mergedOptions.continuous;

    recognitionRef.current.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(t);
      if (mergedOptions.onResult) mergedOptions.onResult(t, e);
    };

    recognitionRef.current.onend = () => {
      if (listening && mergedOptions.continuous) {
        recognitionRef.current?.start();
      } else {
        setListening(false);
      }
      if (mergedOptions.onEnd) mergedOptions.onEnd();
    };

    recognitionRef.current.onerror = (e) => {
      console.error("Speech recognition error", e.error);
      setError(e.error);
      setListening(false);
      if (mergedOptions.onError) mergedOptions.onError(e);
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [listening, mergedOptions]);

  const start = useCallback(() => {
    if (recognitionRef.current && !listening) {
      setTranscript("");
      setError(null);
      try {
        recognitionRef.current.start();
        setListening(true);
        if (mergedOptions.onStart) mergedOptions.onStart();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setError(err);
      }
    }
  }, [listening, mergedOptions]);

  const stop = useCallback(() => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, [listening]);

  return { transcript, listening, start, stop, error };
}
