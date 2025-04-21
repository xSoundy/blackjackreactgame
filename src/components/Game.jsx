import React, {useEffect, useState} from 'react';

const Game = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameResult, setGameResult] = useState('');
    const [playerTurn, setPlayerTurn] = useState(true);
    const [dealerDrawing, setDealerDrawing] = useState(false);

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
        setDeck(prevDeck => {
            const updatedDeck = [...prevDeck];
            const newPlayerHand = [updatedDeck.pop(), updatedDeck.pop()];
            const newDealerHand = [updatedDeck.pop(), updatedDeck.pop()];
        
            setPlayerHand(newPlayerHand);
            setDealerHand(newDealerHand);
            return updatedDeck;
        })
    }

    const startGame = () => {
        setPlayerHand([]);
        setDealerHand([]);
        setGameResult('');
        setPlayerTurn(true);
        setDealerDrawing(false);
        initializeDeck();
    }

    useEffect(() => {
        if (deck.length === 52) {
            dealCards();
        }
    }, [deck])

    const calculateHandValue = (hand) => {
        let value = 0;
        let aceCount = 0;
        hand.forEach(card => {
            if (['Jack', 'Q', 'K'].includes(card.value)) {
                value += 10;
            } else if (card.value === 'A') {
                aceCount += 1;
                value += 11;
            } else {
                value += parseInt(card.value);
            }
        })
        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount -= 1;
        }
        return value;
    }

    const playerHit = () => {
        if (playerTurn) {
            setDeck();
            const updatedDeck = [...deck];
            const newPlayerHand = [...playerHand, updatedDeck.pop()];
            
            setPlayerHand(newPlayerHand);
            if (calculateHandValue(newPlayerHand) > 21) {
                setGameResult('Player busts! Dealer wins!');
                setPlayerTurn(false);
            }
        }
    }

    const playerStand = () => {
        setPlayerTurn(false);
        dealerTurn();
    }

    //const dealerTurn = () => {
    //    let dealerHandValue = calculateHandValue(dealerHand);
    //    while (dealerHandValue < 17) {
    //        const updatedDeck = [...deck];
    //        const newDealerHand = [...dealerHand, updatedDeck.pop()];
    //        setDeck(updatedDeck);
    //        setDealerHand(newDealerHand);
    //        dealerHandValue = calculateHandValue(newDealerHand);
    //    }
    //    determineWinner();
    //}

    useEffect(() => {
        if (dealerDrawing) {
            const dealerValue = calculateHandValue(dealerHand);
            
            if (dealerValue < 17) {
                const drawDealerCard = setTimeout(() => {
                    setDeck(prevDeck => {
                        if (prevDeck.length === 0) {
                            setGameResult('No more cards in the deck!');
                            setDealerDrawing(false);
                            return prevDeck;
                        }
                        const updatedDeck = [...prevDeck];
                        const card = updatedDeck.pop();
                        setDealerHand(prevHand => [...prevHand, card]);
                        return updatedDeck;
                    })
                }, 500)
                return () => clearTimeout(drawDealerCard);
            } else {
                setDealerDrawing(false);
                determineWinner();
            }
        }
    }, [dealerDrawing, dealerHand]);

    const determineWinner = () => {
        const playerHandValue = calculateHandValue(playerHand);
        const dealerHandValue = calculateHandValue(dealerHand);
        if (dealerHandValue > 21) {
            setGameResult('Dealer busts! Player wins!');
        } else if (playerHandValue > dealerHandValue) {
            setGameResult('Player wins!');
        } else if (playerHandValue < dealerHandValue) {
            setGameResult('Dealer wins!');
        } else {
            setGameResult('It\'s a tie!');
        }
        setPlayerTurn(false);
    };

    return (
        <div>
            <button onClick={startGame}>Start Game</button>
            <div>
                <h2>Player Hand</h2>
                {playerHand.map((card, index) => (
                    <div key={index}>{card.value} of {card.suit}</div>
                ))}
                <button onClick={playerHit} disabled={!playerTurn}>Hit</button>
                <button onClick={playerStand} disabled={!playerTurn}>Stand</button>
            </div>
            <div>
                <h2>Dealer Hand</h2>
                {dealerHand.map((card, index) => (
                    <div key={index}>{card.value} of {card.suit}</div>
                ))}
            </div>
            {gameResult && <h2>{gameResult}</h2>}   
        </div>
    );
};

export default Game;