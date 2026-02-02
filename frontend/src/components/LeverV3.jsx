import React, { useState } from 'react';
import './LeverV3.css';

// Версия 3: Кнопка-рычаг с пружинным эффектом
function LeverV3({ onPull, disabled }) {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setPulled(true);
    onPull();
    setTimeout(() => setPulled(false), 400);
  };

  return (
    <div className="lever-v3-container">
      <div 
        className={`lever-v3 ${pulled ? 'pulled' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
      >
        <div className="lever-v3-housing">
          <div className="lever-v3-slot" />
        </div>
        <div className="lever-v3-handle">
          <div className="lever-v3-grip">
            <div className="lever-v3-grip-lines" />
          </div>
          <div className="lever-v3-rod" />
        </div>
      </div>
    </div>
  );
}

export default LeverV3;
