import React, { useState } from 'react';
import './Lever.css';

function Lever({ onPull, disabled }) {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setPulled(true);
    onPull();
    
    setTimeout(() => setPulled(false), 600);
  };

  return (
    <div className="lever-container">
      <div className="lever-base" />
      <div 
        className={`lever ${pulled ? 'pulled' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
      >
        <div className="lever-ball">
          <div className="lever-shine" />
        </div>
        <div className="lever-stick" />
      </div>
    </div>
  );
}

export default Lever;