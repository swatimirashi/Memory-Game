import React, { useState, useEffect } from 'react';
import './App.css';

const images = [
  'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
  'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg', 'img10.jpg'
];

const generateCards = () => {
  const doubledImages = [...images, ...images];
  const shuffledCards = shuffleCards(doubledImages);
  return shuffledCards.map((img, index) => ({
    id: index,
    img: img,
    isFlipped: false,
    isMatched: false
  }));
};

const shuffleCards = (cardsArray) => {
  for (let i = cardsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
  }
  return cardsArray;
};

const App = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(90);

  const startGameSound = new Audio('/sounds/start.mp3');
  const clickSound = new Audio('/sounds/flip.mp3');
  const matchSound = new Audio('/sounds/matches.mp3');
  const winSound = new Audio('/sounds/win.mp3');
  const gameOverSound = new Audio('/sounds/game_over.mp3');


  useEffect(() => {
    if (countdown === 0 || matchedCards.length === images.length) {
      setGameOver(true);
      if (matchedCards.length === images.length) {
        winSound.play();
      } else {
        gameOverSound.play();
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, matchedCards]);

  const handleCardClick = (index) => {
    if (gameOver || cards[index].isFlipped || cards[index].isMatched || flippedCards.length === 2) return;

    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);
    setFlippedCards([...flippedCards, index]);

    clickSound.play();

    if (flippedCards.length === 1) {
      const firstCardIndex = flippedCards[0];
      const secondCardIndex = index;

      if (cards[firstCardIndex].img === cards[secondCardIndex].img) {
        updatedCards[firstCardIndex].isMatched = true;
        updatedCards[secondCardIndex].isMatched = true;
        setMatchedCards([...matchedCards, cards[firstCardIndex].img]);

        setScore(score + 20);
        setCards(updatedCards);
        setFlippedCards([]);
        matchSound.play();
      } else {
        setTimeout(() => {
          updatedCards[firstCardIndex].isFlipped = false;
          updatedCards[secondCardIndex].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setCountdown(90);
    setGameOver(false);
    startGameSound.play();
  };

  return (
    <div className="game-container">
      <div className="header">
        <div className="countdown">Time left: {countdown}s</div>
        <div className="score">Score: {score}</div>
        {gameOver && (
          <div className="game-over">
            {matchedCards.length === images.length ? "You win the game!!" : "Game Over!"}
          </div>
        )}
      </div>

      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <img src={card.isFlipped || card.isMatched ? `images/${card.img}` : 'images/back.jpg'} alt="Card" />
          </div>
        ))}
      </div>

      <button className="start-again" onClick={resetGame}>Start Again</button>
    </div>
  );
};

export default App;
