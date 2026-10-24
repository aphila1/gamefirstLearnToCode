import { useStudio } from '../context/StudioContext';
import './PlayerDashboard.css'; // 🌟 Clean separation of concerns

interface PlayerDashboardProps {
  onBack: () => void;
}

export default function PlayerDashboard({ onBack }: PlayerDashboardProps) {
  const { profile, levelInfo, signOut } = useStudio();

  if (!profile) {
    return (
      <div className="dashboard-loading-container">
        <p>Synchronizing player data nodes...</p>
        <button onClick={onBack} className="dashboard-back-btn">← Return to Hub</button>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header Layout */}
      <div className="dashboard-header-row">
        <button onClick={onBack} className="dashboard-back-btn">← Return to Hub</button>
        <h1 className="dashboard-title">Player Profile Matrix</h1>
      </div>

      {/* Primary Infrastructure Grid */}
      <div className="dashboard-grid-container">
        
        {/* Card 1: Player Card Identifier */}
        <div className="dashboard-card text-center">
          <h2 className="dashboard-username">{profile.username}</h2>
          <p className="dashboard-status-tag">Status: Authenticated</p>
          <button onClick={signOut} className="dashboard-logout-btn">Disconnect Session</button>
        </div>

        {/* Card 2: Level Progression Status */}
        <div className="dashboard-card col-span-2">
          <h3 className="dashboard-card-title">Progression Node</h3>
          <div className="dashboard-level-row">
            <span className="dashboard-level-label">Current Level</span>
            <span className="dashboard-level-number">{levelInfo.currentLevel}</span>
          </div>

          {/* Outer Slider Track */}
          <div className="dashboard-xp-track">
            <div 
              className="dashboard-xp-fill" 
              style={{ width: `${levelInfo.progressPercentage}%` }} 
            />
          </div>

          <div className="dashboard-xp-details-row">
            <span>Progress: {Math.round(levelInfo.progressPercentage)}%</span>
            <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP to Next Level</span>
          </div>
        </div>

        {/* Card 3: Wallet Vault */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Wallet Vault</h3>
          <div className="dashboard-stat-row">
            <span className="dashboard-stat-emoji">🪙</span>
            <div>
              <div className="dashboard-stat-value">{profile.tokens}</div>
              <div className="dashboard-stat-label">Arcade Tokens</div>
            </div>
          </div>
        </div>

        {/* Card 4: Stats Hub */}
        <div className="dashboard-card col-span-2">
          <h3 className="dashboard-card-title">Match Analytics</h3>
          <div className="dashboard-analytics-grid">
            <div className="dashboard-analytics-box">
              <div className="dashboard-box-val">{profile.xp}</div>
              <div className="dashboard-box-label">Total Lifetime XP</div>
            </div>
            <div className="dashboard-analytics-box">
              <div className="dashboard-box-val">Online</div>
              <div className="dashboard-box-label">Network State</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}