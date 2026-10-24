import React from 'react';
import { GAME_INSTRUCTIONS } from '../utils/gameInstructions';

interface InstructionsModalProps {
  gameKey: 'Crazyeight' | 'blackjack' | 'tictactoe'| 'maths'| 'coding'|'casino';
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ gameKey, onClose }) => {
  const data = GAME_INSTRUCTIONS[gameKey];

  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal instructions-modal-card">
        <div className="instructions-header">
          <h3>📋 {data.title} - Operational Protocol</h3>
          <button className="close-icon-btn" onClick={onClose}>×</button>
        </div>

        <div className="instructions-body">
          <section className="ins-section">
            <h4>🎯 Mission Objective</h4>
            <p>{data.objective}</p>
          </section>

          <section className="ins-section">
            <h4>⚡ Core Rules Matrix</h4>
            <ul>
              {data.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </section>

          <section className="ins-section">
            <h4>💡 Strategic Tactical Tips</h4>
            <ul>
              {data.tips.map((tip, idx) => (
                <li key={idx} className="tip-item"><span>PRO-TIP:</span> {tip}</li>
              ))}
            </ul>
          </section>
        </div>

        <button className="start-btn close-action-btn" onClick={onClose}>
          Acknowledge & Sync ⚡
        </button>
      </div>
    </div>
  );
};