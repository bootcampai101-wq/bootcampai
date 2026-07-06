import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2 } from "lucide-react";

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef(false);

  const attemptPlay = (audio: HTMLAudioElement) => {
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked — will play on first user interaction
      });
  };

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/Cerita Tentang Gunung Dan Laut.mp4");
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = "auto";
    audioRef.current = audio;

    const handleReady = () => {
      setIsLoaded(true);
      attemptPlay(audio);
    };

    audio.addEventListener("canplaythrough", handleReady, { once: true });
    audio.addEventListener("loadeddata", handleReady, { once: true });

    // Listen for first user interaction to unblock autoplay
    const handleInteraction = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;
      if (!audio.paused) return;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    };

    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("keydown", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true });

    // Cleanup
    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("canplaythrough", handleReady);
      audio.removeEventListener("loadeddata", handleReady);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[200] flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-card/90 backdrop-blur-lg border border-border/50 rounded-xl px-4 py-2 shadow-soft text-xs text-foreground/80 whitespace-nowrap"
          >
            {isLoaded ? (
              isPlaying ? "Klik untuk mute" : "Putar musik latar"
            ) : "Memuat..."}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group"
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
      >
        {/* Glow effect */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            />
          )}
        </AnimatePresence>

        {/* Pulse rings when playing */}
        <AnimatePresence>
          {isPlaying && (
            <>
              <motion.span
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-primary/40"
              />
              <motion.span
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                className="absolute inset-0 rounded-full border border-primary/40"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main button */}
        <div className={`relative flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300 ${
          isPlaying
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            : "bg-card/90 backdrop-blur-lg border border-border/50 text-foreground/70 hover:text-foreground hover:border-primary/50 shadow-soft"
        }`}>
          {isLoaded ? (
            isPlaying ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <Music className="h-5 w-5" />
            )
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin" />
          )}
        </div>
      </motion.button>
    </div>
  );
};

export default BackgroundMusic;
