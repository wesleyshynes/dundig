import { generateDeck } from "../generators/deckGenerator";
import { generatePlayer } from "../generators/playerGenerator";
import { CardCost } from "../types/cost.model";
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

    selectedTarget: any = {
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
        this.addPlayer({ playerName: 'player1', playerId: 'player1' });
        this.addPlayer({ playerName: 'player2', playerId: 'player2' });

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
    }

    addPlayer(options: { playerName: string, playerId: string }) {
        const { playerName, playerId } = options;
        const player: Player = generatePlayer({ playerName, playerId });

        this.cardRef[`${playerId}entrance`] = player.entrance;
        this.cardRef[`${playerId}garrison`] = player.garrison;

        this.commonGroud.connections.push(`${playerId}entrance`);
        player.entrance.connections.push('commonGround');
        player.entrance.connections.push(`${playerId}garrison`);
        player.garrison.connections.push(`${playerId}entrance`);

        const playerDeck = generateDeck({ playerName, playerId })
        player.deck = playerDeck.map(card => {
            this.cardRef[card.id] = card;
            return card.id;
        });

        this.players[playerName] = player;
    }

    selectTarget(cardId: string, location: string) {
        if (this.selectedTarget.id) {
            this.deselectTarget();
        }

        this.selectedTarget.id = cardId;
        this.selectedTarget.location = location;

        this.addLogMessage(`${this.activePlayer} selected ${cardId} from ${location}`);
        this.renderFn();
    }

    clearSelectedTargetInfo() {
        this.selectedTarget.id = '';
        this.selectedTarget.location = '';
    }

    deselectTarget() {
        this.addLogMessage(`${this.activePlayer} deselected ${this.selectedTarget.id} from ${this.selectedTarget.location}`);
        this.clearSelectedTargetInfo();
        this.renderFn();
    }

    selectCard(cardId: string, location: string) {
        if (this.selectedCard.id) {
            this.deselectCard();
        }

        this.selectedCard.id = cardId;
        this.selectedCard.location = location;

        this.addLogMessage(`${this.activePlayer} selected ${cardId} from ${location}`);
        this.renderFn();
    }

    clearSelectedCardInfo() {
        this.selectedCard.id = '';
        this.selectedCard.location = '';
    }

    deselectCard() {
        this.addLogMessage(`${this.activePlayer} deselected ${this.selectedCard.id} from ${this.selectedCard.location}`);
        this.clearSelectedCardInfo();
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
        } else {
            location = this.cardRef
            splitLocation.forEach((locationName) => {
                if (locationName && location[locationName] !== null) {
                    location = location[locationName];
                }
            })
        }
        return location
    }

    playCardHere(locationString: string) {
        this.removeCardFromLocation(this.selectedCard.id, this.selectedCard.location);
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
                    // allow your own hand cards to be played to your dungeon
                    // todo: check level and size of dungeon
                    // todo: update the linking of the grounds
                    return targetLocation[1] === this.activePlayer && selectedCardLocation[1] === this.activePlayer;
                }
            }
        }
        return false
    }

    clearGroundOccupants(cardId: string) {
        const cardInfo = this.cardRef[cardId];
        if (cardInfo.type === 'ground' && cardInfo.occupants) {
            while (cardInfo.occupants.length > 0) {
                const occupantId = cardInfo.occupants.pop();
                if (!occupantId) continue;
                const occupantCard = this.cardRef[occupantId];
                const occupantOwner = occupantCard.owner;
                this.addCardToLocation(occupantId, `players.${occupantOwner}.discard`);
            }
        }
    }

    payHandCard(playerId: string, cardId: string, locationString: string) {
        this.addLogMessage(`${playerId} is paying ${cardId} from ${locationString}`);
        this.removeCardFromLocation(cardId, locationString);
        this.addCardToLocation(cardId, `players.${playerId}.discard`);
        this.players[playerId].resources.hand += 1;
        if (this.selectedCard.id === cardId) {
            this.deselectCard();
        }
        // todo: remove stuff from discarded card and send to respective places
        this.renderFn();
    }

    payGroundCard(playerId: string, cardId: string, locationString: string) {
        this.addLogMessage(`${playerId} is paying ${cardId} from ${locationString}`);
        this.removeCardFromLocation(cardId, locationString);
        this.addCardToLocation(cardId, `players.${playerId}.discard`);
        this.players[playerId].resources.ground += 1;
        if (this.selectedCard.id === cardId) {
            this.deselectCard();
        }
        // todo: remove stuff from discarded card and send to respective places
        this.clearGroundOccupants(cardId);
        this.renderFn();
    }

    playSentientInGround(
        playerId: string,
        cardId: string,
        cardLocationString: string,
        locationId: string
    ) {
        const card = this.cardRef[cardId]
        const locationCard = this.cardRef[locationId];
        if (
            card.type !== 'sentient' ||
            locationCard.type !== 'ground' ||
            !this.canPayCost(playerId, card.cost)
        ) {
            return;
        }

        this.addLogMessage(`${playerId} is playing ${cardId} in ${locationId}`);

        this.payCardCost(playerId, card.cost);
        this.removeCardFromLocation(cardId, cardLocationString);
        locationCard.occupants.push(cardId);
        this.deselectCard()
        this.deselectTarget()
        this.renderFn();
    }

    canPayCost(playerId: string, cost: CardCost) {
        const playerResources = this.players[playerId].resources;

        const { hand, ground } = cost

        if (hand && playerResources.hand < hand) return false;
        if (ground && playerResources.ground < ground) return false;

        return true;
    }

    payCardCost(playerId: string, cost: CardCost) {
        const playerResources = this.players[playerId].resources;
        const { hand, ground } = cost
        if (hand) playerResources.hand -= hand;
        if (ground) playerResources.ground -= ground;
    }


}

const gameService = new GameService();


////////////////////////////////////////////
export default gameService;
