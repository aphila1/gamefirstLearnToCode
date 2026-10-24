export default function StudioPortfolio({ onNavigateGame }: { onNavigateGame: (id: string) => void }) {
  return (
    <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
      <h2>🌌 Keamsy Swift Tech Studio Portfolio</h2>
      <p>Corporate layout and team details rendering soon.</p>
      <button 
        className="quit-btn" 
        onClick={() => onNavigateGame('hub')}
        style={{ marginTop: '20px', cursor: 'pointer' }}
      >
        ← Return to Arcade Hub
      </button>
    </div>
  );
}