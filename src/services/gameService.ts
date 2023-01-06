import { Ground } from "../types/ground.model";
import { Novelty } from "../types/novelty.model";
import { Player } from "../types/player.model";
import { Sentient } from "../types/sentient.model";

class GameService {
    players: { [v: string]: Player } = {};

    playerTurn: string = '';

    gameState: string = 'new';

    renderCount: number = 0;

    renderFn = () => {};

    commonGroud: Ground = {
        id: 'commonGround',
        owner: '',
        name: 'Common Ground',
        type: 'ground',
        occupants: [],
        connections: [],
        level: 0,
    };
    cardRef: { [v: string]: Ground | Sentient | Novelty } = {
        commonGround: this.commonGroud,
    };

    setRenderFn(fn: () => void) {
        this.renderFn = fn;
    }

    startGame() {
        this.addPlayer('player1');
        this.addPlayer('player2');

        this.playerTurn = 'player1';
        this.gameState = 'started';

        this.renderFn();
    }

    drawCard(playerName: string) {
        const player = this.players[playerName];
        if (player.deck.length > 0) {
            const cardId = player.deck.pop();
            if (cardId) {
                player.hand.push(cardId);
            }
        }
        this.renderFn()
    }

    addPlayer(playerName: string) {
        const player: Player = {
            id: playerName,
            name: playerName,
            deck: [],
            hand: [],
            entrance: {
                id: `${playerName}entrance`,
                owner: playerName,
                name: `${playerName}'s Entrance`,
                type: 'ground',
                occupants: [],
                connections: [],
                level: 0,
            },
            dungeon: [],
            garrison: {
                id: `${playerName}garrison`,
                owner: playerName,
                name: `${playerName}'s Garrison`,
                type: 'ground',
                occupants: [],
                connections: [],
                level: 0,
            },
            discard: [],
            resources: {},
        };

        this.cardRef[`${playerName}entrance`] = player.entrance;
        this.cardRef[`${playerName}garrison`] = player.garrison;

        this.commonGroud.connections.push(`${playerName}entrance`);
        player.entrance.connections.push('commonGround');
        player.entrance.connections.push(`${playerName}garrison`);
        player.garrison.connections.push(`${playerName}entrance`);

        // generate deck
        for (let i = 0; i < 10; i++) {
            const ground: Ground = {
                id: `${playerName}ground${i}`,
                owner: playerName,
                name: `${playerName}'s Ground ${i}`,
                type: 'ground',
                occupants: [],
                connections: [],
                level: Math.round(Math.random() * 3),
            };
            this.cardRef[`${playerName}ground${i}`] = ground;
            player.deck.push(`${playerName}ground${i}`);
        }

        for (let i = 0; i < 10; i++) {
            const novelty: Novelty = {
                id: `${playerName}novelty${i}`,
                owner: playerName,
                name: `${playerName}'s Novelty ${i}`,
                type: 'novelty',
                cost: 0,
                level: Math.round(Math.random() * 7),
            };
            this.cardRef[`${playerName}novelty${i}`] = novelty;
            player.deck.push(`${playerName}novelty${i}`);
        }

        for (let i = 0; i < 10; i++) {
            const sentient: Sentient = {
                id: `${playerName}sentient${i}`,
                owner: playerName,
                name: `${playerName}'s Sentient ${i}`,
                type: 'sentient',
                cost: 0,
                level: Math.round(Math.random() * 7),
                attack: Math.round(Math.random() * 6),
                health: Math.round(Math.random() * 6),
                speed: Math.round(Math.random() * 6),
            };
            this.cardRef[`${playerName}sentient${i}`] = sentient;
            player.deck.push(`${playerName}sentient${i}`);
        }

        // shuffle deck
        for (let i = player.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
        }

        this.players[playerName] = player;
    }


}

const gameService = new GameService();


////////////////////////////////////////////
export default gameService;
