import React, {useState} from 'react';

const Game = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing');

    const initializeDeck = () => {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Q', 'K', 'A'];
        const newDeck = [];

        suits.forEach(suit => {
            values.forEach(value => {
                newDeck.push({suit, value});
            });
        });
        setDeck(newDeck);
    }
} 
