import React, { useState, useEffect } from 'react';
import Reel from './Reel';
import LeverV2 from './LeverV2';
import JackpotAnimation from './JackpotAnimation';
import BrokeAnimation from './BrokeAnimation';
import './SlotMachine.css';

const API_URL = 'http://localhost:5000/api';

const SPIN_PHRASES = [
  "Помогите мне!",
  "Меня держат тут силой",
  "Что на этот раз?",
  "Красиво крутится!",
  "Погэмблим?"
];

function SlotMachine() {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [message, setMessage] = useState('Потяни рычаг!');
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(1);
  const [win, setWin] = useState(false);
  const [jackpot, setJackpot] = useState(false);
  const [broke, setBroke] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalJackpots, setTotalJackpots] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/state`)
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance);
        setBet(data.bet);
        setWinStreak(data.win_streak || 0);
        setTotalWins(data.total_wins || 0);
        setTotalJackpots(data.total_jackpots || 0);
      })
      .catch(() => {});
  }, []);

  const changeBet = async (change) => {
    if (spinning[0] || spinning[1] || spinning[2] || broke) return;
    
    try {
      const response = await fetch(`${API_URL}/bet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change })
      });
      const data = await response.json();
      setBet(data.bet);
    } catch (error) {
      let newBet = bet + change;
      if (newBet < 1) newBet = 1;
      if (newBet > 10) newBet = 10;
      if (newBet > balance) newBet = balance;
      setBet(newBet);
    }
  };

  const spin = async () => {
    if (spinning[0] || spinning[1] || spinning[2] || broke) return;
    
    // Запускаем все барабаны
    setSpinning([true, true, true]);
    
    // Случайная фраза с шансом 1/2
    if (Math.random() < 0.5) {
      const randomPhrase = SPIN_PHRASES[Math.floor(Math.random() * SPIN_PHRASES.length)];
      setMessage(randomPhrase);
    } else {
      setMessage('...');
    }
    
    setWin(false);
    setJackpot(false);

    try {
      const response = await fetch(`${API_URL}/spin`, {
        method: 'POST'
      });
      const data = await response.json();
      
      // Останавливаем барабаны постепенно с задержкой 0.7с
      setTimeout(() => {
        setReels(prev => [data.reels[0], prev[1], prev[2]]);
        setSpinning(prev => [false, prev[1], prev[2]]);
      }, 2500);
      
      setTimeout(() => {
        setReels(prev => [prev[0], data.reels[1], prev[2]]);
        setSpinning(prev => [prev[0], false, prev[2]]);
      }, 3200);
      
      setTimeout(() => {
        setReels(prev => [prev[0], prev[1], data.reels[2]]);
        setSpinning([false, false, false]);
        setMessage(data.message);
        setBalance(data.balance);
        setBet(data.bet);
        setWin(data.win);
        setJackpot(data.jackpot);
        setBroke(data.broke);
        
        // Обновляем статистику с сервера
        setWinStreak(data.win_streak);
        setTotalWins(data.total_wins);
        setTotalJackpots(data.total_jackpots);
      }, 3900);
      
    } catch (error) {
      setTimeout(() => {
        setMessage('Ошибка сервера');
        setSpinning([false, false, false]);
      }, 2500);
    }
  };

  const resetBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/reset`, {
        method: 'POST'
      });
      const data = await response.json();
      setBalance(data.balance);
      setBet(data.bet);
      setMessage(data.message);
      setBroke(false);
      setWin(false);
      setJackpot(false);
      // Статистика приходит с сервера
      setWinStreak(data.win_streak);
      setTotalWins(data.total_wins);
      setTotalJackpots(data.total_jackpots);
    } catch (error) {
      setBalance(100);
      setBet(1);
      setBroke(false);
      setMessage('Баланс восстановлен!');
      setWinStreak(0);
      setTotalWins(0);
      setTotalJackpots(0);
    }
  };

  const isSpinning = spinning[0] || spinning[1] || spinning[2];

  return (
    <div className="game-container">
      {/* Статистика слева */}
      <div className="stats-left">
        <div className="stat-box">
          <span className="stat-label">ПОБЕДЫ</span>
          <span className="stat-value">{totalWins}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">ДЖЕКПОТЫ</span>
          <span className="stat-value jackpot-stat">{totalJackpots}</span>
        </div>
      </div>

      <div className="slot-machine">
        {jackpot && <JackpotAnimation />}
        {broke && <BrokeAnimation />}
        
        <div className="machine-top">
          <h1 className="title">🎰 BURMALDA 🎰</h1>
          <div className="lights">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`light ${win ? 'winning' : ''} ${jackpot ? 'jackpot' : ''}`} />
            ))}
          </div>
        </div>
        
        <div className="balance-display">
          <span className="balance-label">БАЛАНС:</span>
          <span className="balance-value">{balance}</span>
        </div>

        <div className="machine-body">
          <div className="reels-container">
            <div className="reels-frame">
              {reels.map((symbol, index) => (
                <Reel 
                  key={index} 
                  symbol={symbol} 
                  spinning={spinning[index]}
                  reelIndex={index}
                />
              ))}
            </div>
          </div>
          
          <div className={`message ${win ? 'win-message' : ''} ${broke ? 'broke-message' : ''} ${jackpot ? 'jackpot-message' : ''}`}>
            {message}
          </div>

          <div className="bet-controls">
            <button 
              className="bet-btn minus" 
              onClick={() => changeBet(-1)}
              disabled={isSpinning || broke || bet <= 1}
            >
              -1
            </button>
            <div className="bet-display">
              <span className="bet-label">СТАВКА</span>
              <span className="bet-value">{bet}</span>
            </div>
            <button 
              className="bet-btn plus" 
              onClick={() => changeBet(1)}
              disabled={isSpinning || broke || bet >= 10 || bet >= balance}
            >
              +1
            </button>
          </div>
        </div>
        
        {/* Рычаг */}
        <div className="lever-container">
          <LeverV2 onPull={spin} disabled={isSpinning || broke} />
        </div>

        <button className="reset-btn" onClick={resetBalance}>
          🔄 СБРОС БАЛАНСА
        </button>

        {/* Серия побед справа сверху под углом */}
        {winStreak >= 2 && (
          <div className="win-streak-floating">
            🔥 x{winStreak} СЕРИЯ!
          </div>
        )}
      </div>
    </div>
  );
}

export default SlotMachine;