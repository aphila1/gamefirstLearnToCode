import { useState } from "react";
import { supabase } from "../supabaseClient";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // 1. Register account credentials securely with Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // 2. Insert username mapping row inside our profiles table records
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              { id: data.user.id, username: username, xp: 0, tokens: 0 },
            ]);

          if (profileError) throw profileError;
        }

        setMessage({
          text: "🚀 Registration complete! Check your email inbox to confirm validation details.",
          isError: false,
        });
      } else {
        // Handle explicit Sign-in procedures
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        onClose(); // Automatically drop modal frame away once session validates
      }
    } catch (error: any) {
      setMessage({
        text:
          error.message || "An unexpected authentication exception occurred.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <h2>
            {isSignUp
              ? "🌌 Access Mainframe Registration"
              : "🔐 Initialize Session"}
          </h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {message && (
          <div
            style={{
              ...styles.alert,
              backgroundColor: message.isError ? "#7f1d1d" : "#064e3b",
              borderColor: message.isError ? "#ef4444" : "#10b981",
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.formLayout}>
          {isSignUp && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Player Callsign (Username)</label>
              <input
                type="text"
                required
                placeholder="GamerArchitect_01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Comms Relay Endpoint (Email)</label>
            <input
              type="email"
              required
              placeholder="player@arcade.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Security Vector Matrix (Password)
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading
              ? "Processing Cryptographic Handshake..."
              : isSignUp
                ? "Create Profile Matrix"
                : "Establish Link"}
          </button>
        </form>

        <div style={styles.toggleFooter}>
          <button
            style={styles.toggleBtn}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
          >
            {isSignUp
              ? "Already mapped? Switch to Authentication Link"
              : "Need authorization? Create a local Profile Node"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Minimal static style map to protect your GPU/CPU clock layout operations
const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(2, 6, 23, 0.85)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    fontFamily: "sans-serif",
  },
  modalCard: {
    background: "#1e293b",
    width: "100%",
    maxWidth: "420px",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #334155",
    color: "#fff",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#64748b",
    fontSize: "1.75rem",
    cursor: "pointer",
  },
  alert: {
    padding: "12px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    marginBottom: "16px",
    border: "1px solid",
    color: "#f8fafc",
  },
  formLayout: { display: "flex", flexDirection: "column", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#94a3b8",
    fontWeight: "bold",
  },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    padding: "10px 12px",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "0.95rem",
  },
  submitBtn: {
    background: "#3b82f6",
    border: "none",
    color: "#fff",
    padding: "12px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
  toggleFooter: {
    marginTop: "20px",
    borderTop: "1px solid #334155",
    paddingTop: "16px",
    textAlign: "center",
  },
  toggleBtn: {
    background: "transparent",
    border: "none",
    color: "#60a5fa",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};
