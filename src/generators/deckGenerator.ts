import { Ground } from "../types/ground.model";
import { Novelty } from "../types/novelty.model";
import { Sentient } from "../types/sentient.model";

export const generateDeck = (options: { playerName: string, playerId: string }): Array< Ground | Sentient | Novelty > => {
    const { playerName, playerId } = options;
    const deck: Array<Ground | Sentient | Novelty> = [];
    // generate deck
    for (let i = 0; i < 10; i++) {
        const ground: Ground = {
            id: `${playerId}ground${i}`,
            owner: playerName,
            name: `${playerName}'s Ground ${i}`,
            type: 'ground',
            occupants: [],
            connections: [],
            level: Math.round(Math.random() * 3),
        };
        deck.push(ground);
    }

    for (let i = 0; i < 5; i++) {
        const novelty: Novelty = {
            id: `${playerId}novelty${i}`,
            owner: playerName,
            name: `${playerName}'s Novelty ${i}`,
            type: 'novelty',
            cost: {
                hand: Math.round(Math.random() * 2),
                ground: Math.round(Math.random() * 2),
            },
            level: Math.round(Math.random() * 7),
        };
        deck.push(novelty);
    }

    for (let i = 0; i < 10; i++) {
        const sentient: Sentient = {
            id: `${playerId}sentient${i}`,
            owner: playerName,
            name: `${playerName}'s Sentient ${i}`,
            type: 'sentient',
            cost: {
                hand: Math.round(Math.random() * 2),
                ground: Math.round(Math.random() * 2),
            },
            level: Math.round(Math.random() * 7),
            attack: Math.round(Math.random() * 6),
            health: Math.round(Math.random() * 6),
            speed: Math.round(Math.random() * 6),
        };
        deck.push(sentient);
    }

    // shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}