import React, { useState } from 'react';
import './LeverV1.css';

// Версия 1: Классический вертикальный рычаг - шарик сверху, тянем вниз
function LeverV1({ onPull, disabled }) {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setPulled(true);
    onPull();
    setTimeout(() => setPulled(false), 600);
  };

  return (
    <div className="lever-v1-container">
      <div 
        className={`lever-v1 ${pulled ? 'pulled' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
      >
        <div className="lever-v1-ball">
          <div className="lever-v1-shine" />
        </div>
        <div className="lever-v1-stick" />
        <div className="lever-v1-base" />
      </div>
    </div>
  );
}

export default LeverV1;
