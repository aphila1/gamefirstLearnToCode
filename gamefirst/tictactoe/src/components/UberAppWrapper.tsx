
export default function UberAppWrapper({ onBackToHub }: { onBackToHub: () => void }) {
  return (
    <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
      <h2>🚗 Uber Web Architecture Sandbox</h2>
      <p>Mapping grid engine routing module placeholder.</p>
      <button 
        className="quit-btn" 
        onClick={onBackToHub}
        style={{ marginTop: '20px', cursor: 'pointer' }}
      >
        ← Exit Sandbox Portal
      </button>
    </div>
  );
}