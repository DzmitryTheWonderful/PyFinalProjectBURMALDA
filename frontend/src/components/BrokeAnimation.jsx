import React from 'react';
import './BrokeAnimation.css';

function BrokeAnimation() {
  return (
    <div className="broke-overlay">
      <div className="broke-text">
        <span>Г</span>
        <span>О</span>
        <span>Е</span>
        <span>В</span>
        <span>&nbsp;</span>
        <span>Н</span>
        <span>А</span>
        <span>Г</span>
        <span>Р</span>
        <span>Е</span>
        <span>Л</span>
        <span>И</span>
      </div>
      <div className="explosions">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="explosion"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 1}s`
            }}
          >
            💥
          </div>
        ))}
      </div>
      <div className="fire">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="fire-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`
            }}
          >
            🔥
          </div>
        ))}
      </div>
      <div className="skulls">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="skull"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`
            }}
          >
            💀
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrokeAnimation;
