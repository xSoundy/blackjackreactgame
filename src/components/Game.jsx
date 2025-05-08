import React, { useEffect, useState } from 'react';

// Initialize all the game variables and states using React's useState hook
const Game = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameResult, setGameResult] = useState('');
    const [playerTurn, setPlayerTurn] = useState(true);
    const [dealerDrawing, setDealerDrawing] = useState(false);

    // Builds a full deck of 52 playing cards and then shuffles them into a random order using the math.random() function
    const initializeDeck = () => {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Q', 'K', 'A'];
        const newDeck = [];

        suits.forEach(suit => {
            values.forEach(value => {
                newDeck.push({ suit, value });
            });
        });

        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck;
    }

    // const dealCards = () => {
    //     setDeck(prevDeck => {
    //         const updatedDeck = [...prevDeck];
    //         const newPlayerHand = [updatedDeck.pop(), updatedDeck.pop()];
    //         const newDealerHand = [updatedDeck.pop(), updatedDeck.pop()];

    //         setPlayerHand(newPlayerHand);
    //         setDealerHand(newDealerHand);
    //         return updatedDeck;
    //     })
    // }

    // Clears previous state, shuffles a fresh deck, deals cards, and updates states
    const startGame = () => {
        setPlayerHand([]);
        setDealerHand([]);
        setGameResult('');
        setPlayerTurn(true);
        setDealerDrawing(false);

        const newDeck = initializeDeck();
        const newPlayerHand = [newDeck.pop(), newDeck.pop()];
        const newDealerHand = [newDeck.pop(), newDeck.pop()];

        setPlayerHand(newPlayerHand);
        setDealerHand(newDealerHand);
        setDeck(newDeck);
    }

    // Deals two cards to player and dealer when the deck is full (52 cards)
    useEffect(() => {
        if (deck.length === 52) {
            dealCards();
        }
    }, [deck])

    // Calculates the value of a hand in blackjack, accounting for Aces being worth 1 or 11 and face cards being worth 10
    // The function iterates through the hand, summing the values of the cards and adjusting for Aces as needed
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

    //const playerHit = () => {
    //    if (playerTurn) {
    //        setDeck(prevDeck => {
    //            const updatedDeck = [...prevDeck];
    //            const card = updatedDeck.pop();
    //
    //            setPlayerHand(prevHand => {
    //                const newHand = [...prevHand, card];
    //
    //                if (calculateHandValue(newHand) > 21) {
    //                    setGameResult('Player busts! Dealer wins!');
    //                    setPlayerTurn(false);
    //                }
    //
    //                return newHand;
    //            })
    //            return updatedDeck;
    //        })
    //    }
    //};


    // The playerHit function is called when the player chooses to hit. It draws a card from the deck and adds it to the player's hand.
    // If the player's hand value exceeds 21, the game result is set to "Player busts! Dealer wins!" and the player's turn ends.
    const playerHit = () => {
        if (!playerTurn || deck.length === 0) return;

        const updatedDeck = [...deck];
        const newCard = updatedDeck.pop();

        if (!newCard) {
            setGameResult('No more cards in the deck!');
            return;
        }

        const newPlayerHand = [...playerHand, newCard];
        setPlayerHand(newPlayerHand);
        setDeck(updatedDeck);

        const handValue = calculateHandValue(newPlayerHand);
        if (handValue > 21) {
            setGameResult('Player busts! Dealer wins!');
            setPlayerTurn(false);
        }
    }

    // The playerStand function is called when the player chooses to stand. It ends the player's turn and starts the dealer's drawing phase.
    // The dealer will draw cards until their hand value is 17 or higher, or they bust.
    const playerStand = () => {
        setPlayerTurn(false);
        setDealerDrawing(true);
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

    // The dealerTurn function is called when the dealer's turn begins. It draws cards until the dealer's hand value is 17 or higher.
    // If the dealer busts, the game result is set to "Dealer busts! Player wins!" and the game ends.
    useEffect(() => {
        if (dealerDrawing) {
            const dealerValue = calculateHandValue(dealerHand);

            if (dealerValue < 17) {
                const drawDealerCard = setTimeout(() => {
                    if (deck.length === 0) {
                        setGameResult('No more cards in the deck!');
                        setDealerDrawing(false);
                    }

                    const updatedDeck = [...deck];
                    const card = updatedDeck.pop();
                    const newDealerHand = [...dealerHand, card];

                    setDealerHand(newDealerHand);
                    setDeck(updatedDeck);

                    const newHandValue = calculateHandValue(newDealerHand);
                    if (newHandValue > 21) {
                        setGameResult('Dealer busts! Player wins!');
                        setDealerDrawing(false);
                    }
                }, 500)
                return () => clearTimeout(drawDealerCard);
            } else {
                setDealerDrawing(false);
                determineWinner();
            }
        }
    }, [dealerDrawing, dealerHand, deck]);

    // The determineWinner function is called at the end of the game to compare the player's and dealer's hand values and determine the winner.
    // It sets the game result based on the comparison and ends the player's turn.
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

    // The displayCard function is used to render a card with its value and suit. It uses symbols for the suits and applies color based on the suit.
    // The function returns a styled span element with the card's value and suit symbol.
    const displayCard = (card) => {
        if (!card) return null;

        const suitSymbols = {
            Hearts: "♥",
            Diamonds: "♦",
            Clubs: "♣",
            Spades: "♠",
        };

        const color =
            card.suit === "Hearts" || card.suit === "Diamonds"
                ? "red"
                : "black";

        return (
            <span style={{ color, marginRight: '10px', fontSize: '18px' }}>
                {card.value} {suitSymbols[card.suit]}
            </span>
        )
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Blackjack</h1>

            {/* CHANGED: Added styling to button */}
            <button
                onClick={startGame}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                Start New Game
            </button>

            <div style={{ marginBottom: '20px' }}>
                {/* ADDED: Display hand value */}
                <h2>Player's Hand ({calculateHandValue(playerHand)})</h2>
                {/* CHANGED: Enhanced card display */}
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {playerHand.map((card, index) => (
                        <div key={index} style={{
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            padding: '10px',
                            margin: '5px',
                            minWidth: '50px',
                            textAlign: 'center'
                        }}>
                            {displayCard(card)}
                        </div>
                    ))}
                </div>
                {/* CHANGED: Added styling to buttons */}
                <button
                    onClick={playerHit}
                    disabled={!playerTurn}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: playerTurn ? '#2196F3' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: playerTurn ? 'pointer' : 'not-allowed',
                        marginRight: '10px'
                    }}
                >
                    Hit
                </button>
                <button
                    onClick={playerStand}
                    disabled={!playerTurn}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: playerTurn ? '#FF9800' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: playerTurn ? 'pointer' : 'not-allowed'
                    }}
                >
                    Stand
                </button>
            </div>

            <div>
                {/* ADDED: Display hand value */}
                <h2>Dealer's Hand ({calculateHandValue(dealerHand)})</h2>
                {/* CHANGED: Enhanced card display */}
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {dealerHand.map((card, index) => (
                        <div key={index} style={{
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            padding: '10px',
                            margin: '5px',
                            minWidth: '50px',
                            textAlign: 'center'
                        }}>
                            {displayCard(card)}
                        </div>
                    ))}
                </div>
            </div>

            {/* CHANGED: Enhanced game result display */}
            {gameResult && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '20px'
                }}>
                    {gameResult}
                </div>
            )}

            {/* ADDED: Display remaining cards count */}
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                Cards remaining in deck: {deck.length}
            </div>
        </div>
    );
};

// Export the Game component as the default export of this module
export default Game;

   //<div>
        //    <button onClick={startGame}>Start Game</button>
        //    <div>
        //        <h2>Player Hand</h2>
        //        {playerHand.map((card, index) => (
        //            <div key={index}>{card.value} of {card.suit}</div>
        //        ))}
        //        <button onClick={playerHit} disabled={!playerTurn}>Hit</button>
        //        <button onClick={playerStand} disabled={!playerTurn}>Stand</button>
        //    </div>
        //    <div>
        //        <h2>Dealer Hand</h2>
        //        {dealerHand.map((card, index) => (
        //            <div key={index}>{card.value} of {card.suit}</div>
        //        ))}
        //    </div>
        //    {gameResult && <h2>{gameResult}</h2>}
        //</div>