// Audio Engine: Natural Studio Neural TTS with Intelligent Web Speech API Fallback & Sound Effects

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let currentAudio: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Pre-load system speech synthesis voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: 'flip' | 'learned' | 'inProgress' | 'click' | 'complete') {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'flip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'learned') {
      // Pleasant upward two-tone chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'inProgress') {
      // Warm mid tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(370, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'complete') {
      // Celebration chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + i * 0.07);
        g.gain.setValueAtTime(0.05, now + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        o.start(now + i * 0.07);
        o.stop(now + 0.5);
      });
    }
  } catch {
    // Ignore audio context errors silently
  }
}

/**
 * Find the highest-quality Chinese voice available in the user's browser/system.
 */
function getBestWebSpeechVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const zhVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('zh') ||
      v.name.toLowerCase().includes('chinese') ||
      v.name.toLowerCase().includes('mandarin') ||
      v.name.includes('中文') ||
      v.name.includes('普通话')
  );

  if (zhVoices.length === 0) return null;

  // Rank voices by quality and dialect
  const ranked = zhVoices.map((v) => {
    let score = 0;
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();

    // Prefer Mainland Mandarin (zh-CN)
    if (lang === 'zh-cn' || lang === 'zh_cn') score += 30;
    else if (lang.startsWith('zh')) score += 15;

    // Prefer Natural / Neural / Enhanced / Premium voices
    if (name.includes('natural') || name.includes('neural')) score += 60;
    if (name.includes('enhanced') || name.includes('premium')) score += 50;
    if (name.includes('xiaoxiao') || name.includes('yunxi') || name.includes('yunjian')) score += 45;
    if (name.includes('google') || name.includes('siri') || name.includes('apple')) score += 35;
    if (name.includes('tingting') || name.includes('meijia') || name.includes('sinji') || name.includes('sin-ji')) score += 25;

    // Penalize robotic compact/legacy voices
    if (name.includes('compact')) score -= 30;

    return { voice: v, score };
  });

  ranked.sort((a, b) => b.score - a.score);
  return ranked[0].voice;
}

/**
 * Fallback synthesizer using Web Speech API with optimal natural parameters
 */
function speakWithWebSpeech(text: string, rate: number = 0.92): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate; // 0.92 sounds significantly less stretched and robotic than 0.8
    utterance.pitch = 1.0;

    const bestVoice = getBestWebSpeechVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Web Speech fallback error:', e);
  }
}

/**
 * Generates natural Google Neural Studio TTS audio URL for Mandarin Putonghua
 */
function getNaturalTtsUrl(text: string): string {
  const clean = text.trim();
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=${encodeURIComponent(clean)}`;
}

/**
 * Preloads audio for seamless, zero-latency playback
 */
export function preloadChineseAudio(text: string): void {
  if (typeof window === 'undefined' || !text) return;
  try {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = getNaturalTtsUrl(text);
  } catch {
    // Ignore preloading errors
  }
}

/**
 * High-definition Natural Mandarin Pronunciation Engine.
 * Plays studio-quality native neural audio, with seamless fallback to best system voice.
 */
export function speakChinese(text: string, rate: number = 1.0): void {
  if (!text || typeof window === 'undefined') return;

  // 1. Immediately cancel any currently playing audio or speech synthesis
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // 2. Play high-fidelity studio neural audio
  try {
    const audioUrl = getNaturalTtsUrl(text);
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    // Apply playback rate if requested (default 1.0 is standard native cadence)
    if (rate && rate !== 1.0) {
      audio.playbackRate = rate;
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to enhanced Web Speech API if network or audio element fails
        speakWithWebSpeech(text, Math.min(1.0, Math.max(0.85, rate)));
      });
    }

    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
    };

    audio.onerror = () => {
      // Offline or network error -> fallback to Web Speech API
      speakWithWebSpeech(text, Math.min(1.0, Math.max(0.85, rate)));
    };
  } catch {
    // Fallback if Audio constructor fails
    speakWithWebSpeech(text, rate);
  }
}
