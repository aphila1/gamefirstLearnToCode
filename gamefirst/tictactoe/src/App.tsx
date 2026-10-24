import { useState, useEffect, useRef } from "react";
import GameHub from "./components/GameHub";
import DevTerminal from "./components/games/learntocode/DevTerminal";
import PlayerDashboard from "./components/PlayerDashboard";
import StudioPortfolio from "./components/StudioPortfolio";
import UberAppWrapper from "./components/UberAppWrapper";
import ServicesPage from "./components/ServicesPage";
import { InstructionsModal } from "./components/InstructionsModal";
import AuthModal from "./components/AuthModal";
import "./App.css";
import { useStudio } from "./context/StudioContext";

type ScreenView =
  | "hub"
  | "coding"
  | "profile"
  | "studio"
  | "uber"
  | "services";
type GameStage = "menu" | "active";

interface ScoreState {
  playerX: number;
  playerO: number;
  draws: number;
}

export default function App() {
  // Pull database profile status directly from our global context brain
  const { profile, levelInfo, loading } = useStudio();

  const [gameType, setGameType] = useState<"classic" | "super">("classic");

  const [currentScreen, setCurrentScreen] = useState<ScreenView>(() => {
    const savedScreen = sessionStorage.getItem("studio_screen");
    return (savedScreen as ScreenView) || "hub";
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [gameStage, setGameStage] = useState<GameStage>("menu");
  const [isAiMode, setIsAiMode] = useState<boolean>(false);
  const [resetToggle, setResetToggle] = useState<number>(0);
  const [gameStatusText, setGameStatusText] = useState<string>("Select Mode");
  const [scores, setScores] = useState<ScoreState>({
    playerX: 0,
    playerO: 0,
    draws: 0,
  });

  // Navigation Dropdown UI States
  const [projectsOpen, setProjectsOpen] = useState<boolean>(false);
  const [servicesOpen, setServicesOpen] = useState<boolean>(false);
  const [infoGameKey, setInfoGameKey] = useState<
    | "coding"
    | null
  >(null);

  // Reference hooks to track menu borders for click-away detection
  const projectsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  useEffect(() => {
    sessionStorage.setItem("studio_screen", currentScreen);
    if (currentScreen !== "tictactoe") {
      setGameStage("menu");
    }
  }, [currentScreen]);
  const [aiDifficulty, setAiDifficulty] = useState<
    "easy" | "medium" | "master"
  >("easy");

  // Event listener to close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        projectsRef.current &&
        !projectsRef.current.contains(event.target as Node)
      ) {
        setProjectsOpen(false);
      }
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show a clean initialization layout if database profile is sync loading
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0b0f19",
          color: "#3b82f6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          LET'S START...
        </div>
      </div>
    );
  }
  function handleGameOutcome(outcome: "X" | "O" | "draw") {
    
  }

  // Handles initializing matches with custom AI scaling and token fee balances
  const { updateTokens } = useStudio();
  async function startMatch(
    
  ) {
    setIsAiMode(vsAi);

    if (vsAi) {
      setAiDifficulty(selectedDifficulty);

      // 🤖 PREMIUM MONETIZATION GATEWAY FOR MASTER OR SUPER MODES
      if (selectedDifficulty === "master" || selectedType === "super") {
        const tokenBalance = profile ? Number(profile.tokens) : 0;

        if (tokenBalance < 2.0) {
          alert(
            "❌ INSUFFICIENT VAULT BALANCES! Elite matrix modes require 2.0 Arcade Tokens to breach. Farm tokens in Multiplication Blitz!",
          );
          return; // Block match initialization entirely
        }

        // Deduct the entry fee securely from their profile account
        if (profile) {
          try {
            await updateTokens(tokenBalance - 2.0);
            alert(
              `🤖 Vault handshake success: 2.0 Tokens deducted. Entering Unbeatable ${selectedType === "super" ? "Super" : "Master"} Simulation...`,
            );
          } catch (err) {
            console.error("Token gateway verification failed:", err);
            return;
          }
        }
      }

      const diffLabel = selectedDifficulty.toUpperCase();
      setGameStatusText(`AI [${diffLabel}] Turn (X)`);
    } else {
      setGameStatusText("Player X's Turn");
    }

    setGameType(selectedType); // Store the type choice
    setGameStage("active");
  }

  return (
    <div className="studio-app-wrapper">
      {/* 1. UNIVERSAL NAVIGATION HEADER */}
      <nav className="studio-navbar">
        <div
          className="nav-brand-group"
          onClick={() => setCurrentScreen("hub")}
        >
          <span className="brand-logo">🌌</span>
          <span className="brand-name">Keamsy Swift Tech</span>
        </div>

        {/* Dynamic Hamburger Button Icon Element */}
        <button
          className="hamburger-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "×" : "☰"}
        </button>

        <div
          className={`nav-actions-group ${isMobileMenuOpen ? "mobile-open" : ""}`}
        >
          <button
            className={`nav-link ${currentScreen === "studio" ? "active" : ""}`}
            onClick={() => setCurrentScreen("studio")}
          >
            About Us
          </button>

          {/* DROPDOWN node: SERVICES */}
          <div className="nav-dropdown-wrapper" ref={servicesRef}>
            <button
              className={`nav-link dropdown-toggle ${currentScreen === "services" ? "active" : ""}`}
              onClick={() => {
                setServicesOpen(!servicesOpen);
                setProjectsOpen(false);
              }}
            >
              Services ▾
            </button>
            {servicesOpen && (
              <div className="dropdown-menu-card">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setCurrentScreen("services");
                    setServicesOpen(false);
                  }}
                >
                  🌐 Web & App Development
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setCurrentScreen("services");
                    setServicesOpen(false);
                  }}
                >
                  🔌 Network Installations
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setCurrentScreen("services");
                    setServicesOpen(false);
                  }}
                >
                  ⚡ Fibre Optic Solutions
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setCurrentScreen("services");
                    setServicesOpen(false);
                  }}
                >
                  🛠️ IT Technician Support
                </div>
              </div>
            )}
          </div>

          {/* DROPDOWN node: PROJECTS */}
          <div className="nav-dropdown-wrapper" ref={projectsRef}>
            <button
              className="nav-link dropdown-toggle"
              onClick={() => {
                setProjectsOpen(!projectsOpen);
                setServicesOpen(false);
              }}
            >
              Projects ▾
            </button>
            {projectsOpen && (
              <div className="dropdown-menu-card">
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dropdown-item"
                  style={{ textDecoration: "none", display: "block" }}
                  onClick={() => setProjectsOpen(false)}
                >
                  🚗 E-Hailing Platform Clone ↗
                </a>
                <div className="dropdown-item-disabled">🚀 Next Project...</div>
              </div>
            )}
          </div>

          {/* NEW LIVE DATABASE DRIVEN USER DISCOVERY BADGE */}
          {profile ? (
            <div
              className="user-profile-badge"
              onClick={() => setCurrentScreen("profile")}
            >
              <span className="user-avatar">👾</span>
              <div className="user-meta">
                <span className="user-name">{profile.username}</span>
                <span className="user-xp">
                  LVL {levelInfo.currentLevel} ({profile.xp} XP)
                </span>
              </div>
            </div>
          ) : (
            /* Trigger the state opening function flag if clicked as a guest node [PDF: 0.1.5] */
            <div
              className="user-profile-badge"
              onClick={() => setIsAuthOpen(true)}
            >
              <span className="user-avatar">👤</span>
              <div className="user-meta">
                <span className="user-name">Guest Player</span>
                <span className="user-xp">Click to Sign In</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 2. CORE VIEWPORT CONTENT SYSTEM */}
      <div className="studio-viewport-content">
        {currentScreen === "hub" && (
          <GameHub
            onSelectGame={(gameId) => setCurrentScreen(gameId as ScreenView)}
          />
        )}

        {currentScreen === "profile" && (
          <PlayerDashboard onBack={() => setCurrentScreen("hub")} />
        )}

        {currentScreen === "studio" && (
          <StudioPortfolio
            onNavigateGame={(gameId) => setCurrentScreen(gameId as ScreenView)}
          />
        )}

        {currentScreen === "services" && <ServicesPage />}

        {currentScreen === "uber" && (
          <UberAppWrapper onBackToHub={() => setCurrentScreen("hub")} />
        )}

        {currentScreen === "Crazyeight" && (
          <div className="mounted-game-canvas">
            <CrazyEight
              onExit={() => setCurrentScreen("hub")}
              onTriggerRules={() => setInfoGameKey("Crazyeight")}
            />
          </div>
        )}

        {currentScreen === "coding" && (
          <DevTerminal
            onExit={() => setCurrentScreen("hub")}
            onTriggerRules={() => setInfoGameKey("coding")}
          />
        )}

        {infoGameKey && (
          <InstructionsModal
            gameKey={infoGameKey}
            onClose={() => setInfoGameKey(null)}
          />
        )}
        {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
      </div>
    </div>
  );
}
