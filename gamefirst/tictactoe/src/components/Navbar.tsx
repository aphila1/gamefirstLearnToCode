import { useStudio } from "../context/StudioContext";

export default function Navbar() {
  // Pull real-time details from your virtual player membership card
  const { profile, levelInfo, signOut } = useStudio();

  // If the user isn't logged in yet, don't show the navbar stats
  if (!profile) {
    return (
      <nav style={styles.navContainer}>
        <div style={styles.logo}>🎮 ArcadeHub</div>
        <div style={{ color: "#94a3b8" }}>Please log in to track progress</div>
      </nav>
    );
  }

  return (
    <nav style={styles.navContainer}>
      {/* Left side: Webapp Title */}
      <div style={styles.logo}>🎮 ArcadeHub</div>

      {/* Middle side: Dynamic Level & XP Bar Frame */}
      <div style={styles.xpWrapper}>
        <div style={styles.levelBadge}>
          LVL <span style={styles.boldText}>{levelInfo.currentLevel}</span>
        </div>

        <div style={styles.barAndLabelContainer}>
          {/* Outer Grey Track Bar */}
          <div style={styles.xpTrack}>
            {/* Inner Blue Fill Bar */}
            <div
              style={{
                ...styles.xpFill,
                width: `${levelInfo.progressPercentage}%`,
              }}
            />
          </div>
          {/* Subtext numbers */}
          <div style={styles.xpText}>
            {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP
            to Next Level
          </div>
        </div>
      </div>

      {/* Right side: Player Profile & Currency */}
      <div style={styles.profileSection}>
        <div style={styles.tokenBadge}>
          🪙 <span style={styles.boldText}>{profile.tokens}</span> Tokens
        </div>

        <div style={styles.usernameCard}>👤 {profile.username}</div>

        <button onClick={signOut} style={styles.logoutBtn}>
          Exit
        </button>
      </div>
    </nav>
  );
}

// ============================================================================
// CLEAN INLINE STYLES (No extra CSS files required)
// ============================================================================
const styles: Record<string, React.CSSProperties> = {
  navContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f172a", // Cyber dark background
    padding: "0.75rem 2rem",
    borderBottom: "1px solid #334155",
    color: "#fff",
    fontFamily: "system-ui, sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  xpWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#1e293b",
    padding: "8px 16px",
    borderRadius: "12px",
    border: "1px solid #4f5533",
    minWidth: "320px",
  },
  levelBadge: {
    background: "#3b82f6",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  barAndLabelContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: "4px",
  },
  xpTrack: {
    width: "100%",
    height: "10px",
    background: "#475569",
    borderRadius: "5px",
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
    borderRadius: "5px",
    transition: "width 0.4s ease-out", // Makes the bar slide smoothly when gaining XP!
  },
  xpText: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    textAlign: "right",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  tokenBadge: {
    background: "#1e293b",
    border: "1px solid #eab308", // Gold tint border
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    color: "#fde047",
  },
  usernameCard: {
    fontSize: "0.95rem",
    color: "#e2e8f0",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #ef4444",
    color: "#ef4444",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s",
  },
  boldText: {
    fontWeight: "bold",
  },
};
