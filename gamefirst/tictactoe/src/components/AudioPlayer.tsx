import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  // 1. Point directly to the file in your public folder
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize the audio object safely
    audioRef.current = new Audio("/studio-theme.mp3");
    audioRef.current.loop = true; // Loops your beat indefinitely
    audioRef.current.volume = 0.25; // Keeps it at a comfortable background level

    // Clean up and stop the music if the component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Browsers require this user click trigger to allow audio playback
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio playback blocked by browser:", err));
    }
  };

  return (
    <div className="audio-control-container" style={{ margin: "15px 0" }}>
      <button
        className={`audio-btn ${isPlaying ? "playing" : ""}`}
        onClick={togglePlayback}
        style={{
          padding: "8px 16px",
          borderRadius: "8px",
          background: isPlaying ? "#6366f1" : "#1e293b",
          color: "#fff",
          border: "1px solid #6365f100",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: isPlaying ? "0 0 15px rgba(99, 102, 241, 0.4)" : "none",
        }}
      >
        {isPlaying ? "🎵 Soundtrack: ON" : "🔇 Soundtrack: OFF"}
      </button>
    </div>
  );
}
