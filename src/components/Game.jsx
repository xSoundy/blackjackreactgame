import React, {useState} from 'react';

const Game = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameStatus, setGameStatus] = useState('not started');

    const initializeDeck = () => {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Q', 'K', 'A'];
        const newDeck = [];

        suits.forEach(suit => {
            values.forEach(value => {
                newDeck.push({suit, value});
            });
        });
        
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        setDeck(newDeck)
    }

    const dealCards = () => {
        const updatedDeck = [...deck];
        const newPlayerHand = [updatedDeck.pop(), updatedDeck.pop()];
        const newDealerHand = [updatedDeck.pop(), updatedDeck.pop()];
        setDeck(updatedDeck);
        setPlayerHand(newPlayerHand);
        setDealerHand(newDealerHand);
    }

    const startGame = () => {
        initializeDeck();
        //setTimeout(() => {
            if (deck.length > 0) {
                dealCards();
            }
        //}, 100);
        setGameStatus('playing');
    }

    return (
        <div>
            <button onClick={startGame}>Start Game</button>
            <div>
                <h2>Player Hand</h2>
                {playerHand.map((card, index) => (
                    <div key={index}>{card.value} of {card.suit}</div>
                ))}
            </div>
            <div>
                <h2>Dealer Hand</h2>
                {dealerHand.map((card, index) => (
                    <div key={index}>{card.value} of {card.suit}</div>
                ))}
            </div>    
        </div>
    );
};

export default Game;