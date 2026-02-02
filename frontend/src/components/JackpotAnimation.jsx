import React from 'react';
import './JackpotAnimation.css';

function JackpotAnimation() {
  return (
    <div className="jackpot-overlay">
      <div className="jackpot-text">
        <span>🎉</span>
        <span>J</span>
        <span>A</span>
        <span>C</span>
        <span>K</span>
        <span>P</span>
        <span>O</span>
        <span>T</span>
        <span>!</span>
        <span>🎉</span>
      </div>
      <div className="confetti">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ['#ffd700', '#ff0000', '#00ff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>
      <div className="coins">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="coin"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`
            }}
          >
            💰
          </div>
        ))}
      </div>
    </div>
  );
}

export default JackpotAnimation;
