import type { GameInfo } from "../gameConfig";
import "./GameCard.css";

interface GameCardProps {
  game: GameInfo;
  onLaunch: (id: string) => void;
}

export default function GameCard({ game, onLaunch }: GameCardProps) {
  const isComingSoon = game.title.includes("Coming Soon");

  // Check if the thumbnail is an image path/URL (e.g., starts with /src, http, or ends in .png)
  const isImagePath = game.thumbnail.length > 4;

  return (
    <div className={`studio-game-card ${isComingSoon ? "coming-soon" : ""}`}>
      {/* Updated Thumbnail Container */}
      <div className="card-thumbnail">
        {isImagePath ? (
          <img
            src={game.thumbnail}
            alt={`${game.title} thumbnail`}
            className="thumbnail-image"
          />
        ) : (
          game.thumbnail
        )}
      </div>

      <div onClick={() => onLaunch(game.id)}>
        <div className="card-content">
          <div className="card-header-row">
            <h3>{game.title}</h3>
            <span
              className={`difficulty-badge ${game.difficulty.toLowerCase()}`}
            >
              {game.difficulty}
            </span>
          </div>

          <p>{game.description}</p>

          <div className="card-tags">
            {game.tags.map((tag) => (
              <span key={tag} className="tag-badge">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
