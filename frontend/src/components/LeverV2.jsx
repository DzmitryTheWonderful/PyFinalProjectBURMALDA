import React, { useState } from 'react';
import './LeverV2.css';

// Версия 2: Боковой рычаг - наклоняется вправо
function LeverV2({ onPull, disabled }) {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setPulled(true);
    onPull();
    setTimeout(() => setPulled(false), 600);
  };

  return (
    <div className="lever-v2-container">
      <div 
        className={`lever-v2 ${pulled ? 'pulled' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
      >
        <div className="lever-v2-arm">
          <div className="lever-v2-ball">
            <div className="lever-v2-shine" />
          </div>
          <div className="lever-v2-stick" />
        </div>
        <div className="lever-v2-pivot" />
      </div>
    </div>
  );
}

export default LeverV2;
