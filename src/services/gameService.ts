import { Ground } from "../types/ground.model";
import { Novelty } from "../types/novelty.model";
import { Player } from "../types/player.model";
import { Sentient } from "../types/sentient.model";

class GameService {
    players: { [v: string]: Player } = {};
    playerTurn: string = '';
    activePlayer: string = '';
    gameState: string = 'new';
    gameMessage: string = '';
    log: string[] = [];
    renderCount: number = 0;

    cardVoid: string[] = [];

    renderFn = () => { };

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

    selectedCard: any = {
        id: '',
        location: '',
    }

    setRenderFn(fn: () => void) {
        this.renderFn = fn;
    }

    setActivePlayer(playerName: string) {
        this.activePlayer = playerName;
        this.renderFn();
    }

    startGame() {
        this.addPlayer('player1');
        this.addPlayer('player2');

        this.playerTurn = 'player1';
        this.activePlayer = 'player1';

        this.gameState = 'started';
        this.addLogMessage(`Game started ${this.playerTurn} goes first`);
        this.renderFn();
    }

    drawCard(playerName: string) {
        const player = this.players[playerName];
        if (player.deck.length > 0) {
            const cardId = player.deck.pop();
            if (cardId) {
                player.hand.push(cardId);
            }
            this.addLogMessage(`${playerName} drew a card`);
        } else {
            this.gameState = 'ended';
            this.addLogMessage(`GAME OVER ${playerName} tried to draw a card but has no cards left in their deck`);
        }
        this.renderFn()
    }

    addLogMessage(message: string) {
        this.log.push(message);
        // this.renderFn();
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

        for (let i = 0; i < 5; i++) {
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

    selectCard(cardId: string, location: string) {

        if (this.selectedCard.id) {
            this.deselectCard();
        }

        this.selectedCard.id = cardId;
        this.selectedCard.location = location;

        this.removeCardFromLocation(cardId, location);

        this.addLogMessage(`${this.activePlayer} selected ${cardId} from ${location}`);
        this.renderFn();
    }

    clearSelectedCardInfo() {
        this.selectedCard.id = '';
        this.selectedCard.location = '';
    }

    deselectCard() {
        this.addCardToLocation(this.selectedCard.id, this.selectedCard.location);

        this.clearSelectedCardInfo();

        this.addLogMessage(`${this.activePlayer} deselected ${this.selectedCard.id} from ${this.selectedCard.location}`);
        this.renderFn();
    }

    addCardToLocation(cardId: string, location: string) {
        const locationArray = this.parseLocation(location);
        locationArray.push(cardId);
    }

    removeCardFromLocation(cardId: string, location: string) {
        const locationArray = this.parseLocation(location);
        const cardIndex = locationArray.indexOf(cardId);
        if (cardIndex > -1) {
            locationArray.splice(cardIndex, 1);
        }
    }

    parseLocation(locationString: string) {
        const splitLocation = locationString.split('.');
        const baseLocation = splitLocation.shift()
        let location: any = this.cardVoid
        if (!baseLocation) return location;

        if (baseLocation === 'players') {
            location = this.players;
            splitLocation.forEach((locationName) => {
                if (locationName && location[locationName] !== null) {
                    location = location[locationName];
                }
            })
        }
        return location
    }

    playCardHere(locationString: string) {
        this.addCardToLocation(this.selectedCard.id, locationString);
        this.addLogMessage(`${this.activePlayer} played ${this.selectedCard.id} to ${locationString}`);
        this.selectedCard.id = '';
        this.selectedCard.location = '';
        this.renderFn();
    }

    canPlayCardHere(locationString: string) {

        if (!this.selectedCard.id) return false;

        const cardSelected = this.cardRef[this.selectedCard.id];
        const selectedCardLocation = this.selectedCard.location.split('.');
        const selectedCardLocationType = selectedCardLocation[selectedCardLocation.length - 1];

        const targetLocation = locationString.split('.');
        const targetLocationType = targetLocation[targetLocation.length - 1];

        if (selectedCardLocationType === 'hand') {
            if (cardSelected.type === 'ground') {
                if (targetLocationType === 'dungeon') {
                    return targetLocation[1] === this.activePlayer;
                }
            }
        }
        return false
    }


}

const gameService = new GameService();


////////////////////////////////////////////
export default gameService;
