import React, { useState, useEffect, useMemo } from 'react';
import './Reel.css';

const ALL_SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '7️⃣', '💎'];

// Разные последовательности для разных слотов
const REEL_SEQUENCES = [
  ['🍒', '💎', '🍋', '⭐', '🍊', '7️⃣', '🍇'],
  ['🍇', '🍒', '7️⃣', '🍋', '💎', '🍊', '⭐'],
  ['⭐', '🍊', '🍒', '💎', '7️⃣', '🍇', '🍋']
];

function Reel({ symbol, spinning, reelIndex = 0 }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFinal, setShowFinal] = useState(true);
  const [finalSymbol, setFinalSymbol] = useState(symbol);
  
  // Создаём ленту с финальным символом в конце
  const spinSymbols = useMemo(() => {
    const sequence = REEL_SEQUENCES[reelIndex % REEL_SEQUENCES.length];
    const symbols = [];
    // 20 повторов последовательности
    for (let i = 0; i < 20; i++) {
      symbols.push(...sequence);
    }
    // Добавляем финальный символ в конец
    symbols.push(symbol);
    return symbols;
  }, [symbol, reelIndex]);
  
  useEffect(() => {
    if (spinning) {
      setIsAnimating(true);
      setShowFinal(false);
    } else {
      // Когда spinning = false, показываем финальный символ
      setFinalSymbol(symbol);
      setIsAnimating(false);
      setShowFinal(true);
    }
  }, [spinning, symbol]);
  
  return (
    <div className="reel">
      <div className="reel-window">
        {isAnimating && !showFinal ? (
          <div className="reel-strip spinning">
            {spinSymbols.map((s, i) => (
              <div key={i} className="reel-symbol">{s}</div>
            ))}
          </div>
        ) : (
          <div className="reel-symbol final">{finalSymbol}</div>
        )}
      </div>
    </div>
  );
}

export default Reel;