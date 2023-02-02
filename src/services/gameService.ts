import { getEffectiveConstraintOfTypeParameter } from "typescript";
import { generateDeck } from "../generators/deckGenerator";
import { generatePlayer } from "../generators/playerGenerator";
import { CardCost } from "../types/cost.model";
import { Ground } from "../types/ground.model";
import { Novelty } from "../types/novelty.model";
import { Player } from "../types/player.model";
import { Sentient } from "../types/sentient.model";
import groundEffectService from "./cardEffects/groundEffectService";
import noveltyEffectService from "./cardEffects/noveltyEffectService";

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

    commonGround: Ground = {
        id: 'commonGround',
        owner: '',
        name: 'Common Ground',
        type: 'ground',
        occupants: [],
        connections: [],
        level: 0,
        effectId: 'doNothing',
        effectType: 'once',
        effectArgs: {},
        effectedSentients: [],
    };
    cardRef: { [v: string]: Ground | Sentient | Novelty } = {
        commonGround: this.commonGround,
    };

    selectedCard: any = {
        id: '',
        location: '',
    }

    selectedTarget: any = {
        id: '',
        location: '',
    }

    showGameInfo() {
        console.log('========================================')
        console.log('cardRef', this.cardRef);
        console.log('players', this.players);
        console.log('commonGround', this.commonGround);
        console.log('playerTurn', this.playerTurn);
        console.log('activePlayer', this.activePlayer);
        console.log('gameState', this.gameState);
        console.log('gameMessage', this.gameMessage);
        console.log('log', this.log);
        console.log('renderCount', this.renderCount);
        console.log('selectedCard', this.selectedCard);
        console.log('selectedTarget', this.selectedTarget);
    }

    setRenderFn(fn: () => void) {
        this.renderFn = fn;
    }

    setActivePlayer(activePlayerOptions: { playerId: string }) {
        const { playerId } = activePlayerOptions;
        this.activePlayer = playerId;
        this.renderFn();
    }

    startGame() {
        this.addPlayer({ playerName: 'player1', playerId: 'player1', order: 0 });
        this.addPlayer({ playerName: 'player2', playerId: 'player2', order: 1 });

        this.playerTurn = 'player1';
        this.activePlayer = 'player1';

        this.gameState = 'started';
        this.addLogMessage(`Game started ${this.playerTurn} goes first`);
        this.renderFn();
    }

    drawCard(drawCardOptions: { playerId: string }) {
        const { playerId } = drawCardOptions;
        const player = this.players[playerId];
        if (player.deck.length > 0) {
            const cardId = player.deck.pop();
            if (cardId) {
                player.hand.push(cardId);
            }
            this.addLogMessage(`${playerId} drew a card`);
        } else {
            this.gameState = 'ended';
            this.addLogMessage(`GAME OVER ${playerId} tried to draw a card but has no cards left in their deck`);
        }
        this.renderFn()
    }

    handleEndOfTurnCard(cardId: string) {
        const cardInfo = this.cardRef[cardId];
        if (cardInfo.type === 'sentient') {
            cardInfo.speed = cardInfo.originalStats.speed;
        }
    }

    endTurn() {
        this.drawCard({ playerId: this.activePlayer });
        const currentTurnOrder = this.players[this.playerTurn].order;
        const nextTurnOrder = currentTurnOrder + 1 === Object.keys(this.players).length ? 0 : currentTurnOrder + 1;
        const nextTurnPlayer = Object.keys(this.players).find(playerId => this.players[playerId].order === nextTurnOrder);

        this.commonGround.occupants.forEach((o: string) => this.handleEndOfTurnCard(o))
        Object.keys(this.players).forEach((playerId: string) => {
            const player = this.players[playerId];
            player.resources.hand = 0;
            player.resources.ground = 0;
            player.dungeon.forEach((cardId: string) => {
                const card = this.cardRef[cardId];
                if (card.type !== 'ground') { return }
                card.occupants.forEach((o: string) => this.handleEndOfTurnCard(o))
            })
            player.garrison.occupants.forEach((o: string) => this.handleEndOfTurnCard(o))
            player.entrance.occupants.forEach((o: string) => this.handleEndOfTurnCard(o))
        })

        if (nextTurnPlayer) {
            this.playerTurn = nextTurnPlayer;
            this.addLogMessage(`${this.playerTurn}'s turn`);
        }

        this.renderFn()
    }

    addLogMessage(message: string) {
        this.log.push(message);
    }

    addPlayer(options: {
        playerName: string,
        playerId: string,
        order: number
    }) {
        const {
            playerName,
            playerId,
            order
        } = options;
        const player: Player = generatePlayer({ playerName, playerId, order });

        this.cardRef[`${playerId}entrance`] = player.entrance;
        this.cardRef[`${playerId}garrison`] = player.garrison;

        this.commonGround.connections.push(`${playerId}entrance`);
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

    getCardInfo(cardId: string) {
        return this.cardRef[cardId];
    }

    selectTarget(selectOptions: { cardId: string, location: string }) {
        const { cardId, location } = selectOptions;
        if (this.selectedTarget.id) {
            this.deselectTarget();
        }

        this.selectedTarget.id = cardId;
        this.selectedTarget.location = location;

        this.addLogMessage(`${this.activePlayer} targeted ${cardId} from ${location}`);
        this.renderFn();
    }

    deselectTarget() {
        if (!this.selectedTarget.id) return;
        this.addLogMessage(`${this.activePlayer} untargeted ${this.selectedTarget.id} from ${this.selectedTarget.location}`);
        this.selectedTarget.id = '';
        this.selectedTarget.location = '';
        this.renderFn();
    }

    selectCard(selectOptions: { cardId: string, location: string }) {
        const { cardId, location } = selectOptions;
        if (this.selectedCard.id) {
            this.deselectCard();
        }
        this.selectedCard.id = cardId;
        this.selectedCard.location = location;
        this.addLogMessage(`${this.activePlayer} selected ${cardId} from ${location}`);
        this.renderFn();
    }

    deselectCard() {
        if (!this.selectedCard.id) return;
        this.addLogMessage(`${this.activePlayer} deselected ${this.selectedCard.id} from ${this.selectedCard.location}`);
        this.selectedCard.id = '';
        this.selectedCard.location = '';
        this.renderFn();
    }

    addCardToLocation(cardId: string, location: string) {
        const locationArray = this.parseLocation(location);
        const cardIndex = locationArray.indexOf(cardId);
        if (cardIndex > -1) return;
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

    moveCardToLocation(cardId: string, currentLocationString: string, targetLocationString: string) {
        this.addLogMessage(`${cardId} is moving from ${currentLocationString} to ${targetLocationString}`)
        this.deselectCard()
        this.deselectTarget()
        this.removeCardFromLocation(cardId, currentLocationString)
        // TODO: check card location type and do stuff, like if discard then reset card stats, clear occupants etc...
        this.addCardToLocation(cardId, targetLocationString)
        this.renderFn()
    }

    sendToDiscard(cardId: string, locationString: string) {
        const cardInfo = this.cardRef[cardId]
        if (cardInfo.type === 'novelty') {
            this.clearNovelty(cardId, locationString)
        }
        if (cardInfo.type === 'sentient') {
            this.clearSentient(cardId)
        }
        if (cardInfo.type === 'ground') {
            this.clearGround(cardId)
        }
        this.moveCardToLocation(cardId, locationString, `players.${cardInfo.owner}.discard`)
    }

    playSelectedCardHere(locationString: string) {
        this.moveCardToLocation(this.selectedCard.id, this.selectedCard.location, locationString);
        this.addLogMessage(`${this.activePlayer} played ${this.selectedCard.id} to ${locationString}`);
        this.deselectCard();
        this.renderFn();
    }

    canPlaySelectedCardHere(locationString: string) {
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

    clearNovelty(cardId: string, locationString: string) {
        const cardInfo = this.cardRef[cardId];
        if (cardInfo.type !== 'novelty') {
            return;
        }
        const { effectId, effectArgs } = cardInfo
        const locationSplit = locationString.split('.')
        const baseLocation = locationSplit.shift()
        if (baseLocation === 'cardRef') {
            const locationCardId = locationSplit.shift()
            if (locationCardId) {
                const locationCard = this.cardRef[locationCardId]
                const effectDetails = noveltyEffectService.getEffectDetails(effectId);
                if (effectDetails) {
                    const { cleanupEffect } = effectDetails
                    if (cleanupEffect) {
                        cleanupEffect({
                            target: locationCard,
                            cardId: cardId,
                            ...effectArgs
                        })
                    }
                }
            }
        }
    }

    clearSentient(cardId: string) {
        const cardInfo = this.cardRef[cardId];
        if (cardInfo.type !== 'sentient') {
            return;
        }
        while (cardInfo.novelties.length > 0) {
            const noveltyId = cardInfo.novelties.pop()
            if (noveltyId) {
                this.sendToDiscard(noveltyId, `cardRef.${cardId}.novelties`)
            }
        }
        while (cardInfo.groundEffects.length > 0) {
            const groundEffectId = cardInfo.groundEffects.pop()
            if (groundEffectId) {
                this.removeCardFromLocation(cardId, `cardRef.${groundEffectId}.effectedSentients`)
            }
        }

        cardInfo.health = cardInfo.originalStats.health
        cardInfo.attack = cardInfo.originalStats.attack
        cardInfo.speed = cardInfo.originalStats.speed

        cardInfo.modifiers = {
            attack: 0,
            health: 0,
            speed: 0
        }
    }

    clearGround(cardId: string) {
        const cardInfo = this.cardRef[cardId];
        if (cardInfo.type !== 'ground') {
            return
        }
        if (cardInfo.occupants) {
            while (cardInfo.occupants.length > 0) {
                const occupantId = cardInfo.occupants.pop();
                if (!occupantId) { continue; }
                this.sendToDiscard(occupantId, `cardRef.${cardId}.occupants`);
            }
        }
        if (cardInfo.effectedSentients) {
            while (cardInfo.effectedSentients.length > 0) {
                const effectedSentientId = cardInfo.effectedSentients.pop()
                const { effectId, effectArgs } = cardInfo
                const effectDetails = groundEffectService.getEffectDetails(effectId);
                if (effectDetails && effectedSentientId) {
                    const { cleanupEffect } = effectDetails
                    if (cleanupEffect) {
                        const effectResult = cleanupEffect({
                            target: this.cardRef[effectedSentientId],
                            groundInfo: cardInfo,
                            ...effectArgs
                        })
                        if (effectResult) {
                            console.log(cardId, 'effect removed from', effectedSentientId)
                        }
                    }
                }

                if (effectedSentientId) {
                    this.removeCardFromLocation(cardId, `cardRef.${effectedSentientId}.groundEffects`)
                }
            }
        }
    }

    payHandCard(playerId: string, cardId: string, locationString: string) {
        this.addLogMessage(`${playerId} is paying ${cardId} from ${locationString}`);
        this.sendToDiscard(cardId, locationString);
        this.players[playerId].resources.hand += 1;
        if (this.selectedCard.id === cardId) {
            this.deselectCard();
        }
        // todo: remove stuff from discarded card and send to respective places
        this.renderFn();
    }

    payGroundCard(playerId: string, cardId: string, locationString: string) {
        this.addLogMessage(`${playerId} is paying ${cardId} from ${locationString}`);
        this.sendToDiscard(cardId, locationString);
        this.players[playerId].resources.ground += 1;
        this.deselectCard();
        this.deselectTarget();
        this.renderFn();
    }

    canPayCost(playerId: string, cost: CardCost) {
        const playerResources = this.players[playerId].resources;
        const { hand, ground } = cost
        if (hand && playerResources.hand < hand) { return false; }
        if (ground && playerResources.ground < ground) { return false; }
        return true;
    }

    payCardCost(playerId: string, cost: CardCost) {
        const playerResources = this.players[playerId].resources;
        const { hand, ground } = cost
        if (hand) { playerResources.hand -= hand; }
        if (ground) { playerResources.ground -= ground; }
    }

    resolveField() {
        Object.keys(this.players).forEach((playerId: string) => {
            const player = this.players[playerId];
            player.dungeon.forEach((cardId: string) => {
                const card = this.cardRef[cardId];
                if (card.type !== 'ground') { return }
                this.resolveGround(`cardRef.${cardId}.occupants`)
            })
            this.resolveGround(`cardRef.${player.garrison.id}.occupants`)
            this.resolveGround(`cardRef.${player.entrance.id}.occupants`)
        })
        this.resolveGround(`cardRef.${this.commonGround.id}.occupants`)
    }

    handleGroundNavigation(cardId: string, locationString: string, targetLocationString: string) {
        this.moveCardToLocation(cardId, locationString, targetLocationString)
        const cardInfo = this.cardRef[cardId]
        // handle speed usage
        if (cardInfo.type === 'sentient') {
            cardInfo.speed -= 1
        }
        this.resolveField()
    }

    resolveGround(groundLocation: string) {

        const groundId = groundLocation.split('.')[1]
        const groundInfo = this.cardRef[groundId]

        const location = this.parseLocation(groundLocation);
        const teams: { [p: string]: string[] } = {}
        const nonAttackers: string[] = []
        const deadSentients: string[] = []

        location.forEach((cardId: string) => {
            const card = this.cardRef[cardId];
            if (card.type !== 'sentient') { return }
            if (card.health <= 0) {
                deadSentients.push(cardId)
                return
            }

            // handle ground effects
            if (groundInfo && groundInfo.type === 'ground') {
                const { effectId, effectArgs } = groundInfo
                const effectDetails = groundEffectService.getEffectDetails(effectId);
                const effectRequirements: any = {}
                // let validRequirements = true;
                const cardAffected = groundInfo.effectedSentients.indexOf(cardId) > -1
                if (effectDetails && !cardAffected) {
                    const { effect, requirements } = effectDetails;
                    if (requirements) {
                        // loop through requirement keys
                        Object.keys(requirements).forEach((requirementKey: string) => {
                            const requirement = requirements[requirementKey];
                            const { type, source, location } = requirement;
                            const splitSource = source.split('.');
                            const sourceRoot = splitSource[0];
                            if (sourceRoot === 'effectArgs') {
                                const extraArgKey = splitSource[1];
                                effectRequirements[requirementKey] = effectArgs[extraArgKey];
                                return
                            }
                            if (sourceRoot === 'occupant') {
                                effectRequirements[requirementKey] = card;
                            }
                            if (sourceRoot === 'groundInfo') {
                                effectRequirements[requirementKey] = groundInfo;
                            }
                        })
                    }

                    const effectResult = effect(effectRequirements);
                    if (effectResult && effectResult.success) {
                        card.groundEffects.push(groundId)
                        groundInfo.effectedSentients.push(cardId)
                    }

                }
            }


            if (card.attack <= 0) {
                nonAttackers.push(cardId)
                return
            }
            if (!teams[card.owner]) { teams[card.owner] = [] }
            teams[card.owner].push(cardId)
        })

        while (Object.keys(teams).length > 1) {
            const team1 = Object.keys(teams)[0]
            const team2 = Object.keys(teams)[1]
            const team1CardId = teams[team1].pop()
            const team2CardId = teams[team2].pop()
            if (!team1CardId || !team2CardId) {
                break;
            };
            const team1Card = this.cardRef[team1CardId]
            const team2Card = this.cardRef[team2CardId]
            if (team1Card.type !== 'sentient' || team2Card.type !== 'sentient') {
                break;
            }
            team1Card.health -= team2Card.attack
            team2Card.health -= team1Card.attack

            if (team1Card.health <= 0) {
                this.sendToDiscard(team1CardId, groundLocation)
            } else {
                teams[team1].push(team1CardId)
            }

            if (team2Card.health <= 0) {
                this.sendToDiscard(team2CardId, groundLocation)
            } else {
                teams[team2].push(team2CardId)
            }

            if (teams[team1].length === 0) {
                delete teams[team1]
            }
            if (teams[team2].length === 0) {
                delete teams[team2]
            }
        }

        if (Object.keys(teams).length === 1) {
            const winner = Object.keys(teams)[0]
            nonAttackers.forEach((cardId: string) => {
                const card = this.cardRef[cardId]
                if (card.type !== 'sentient') { return }
                if (card.owner === winner) { return }
                this.sendToDiscard(cardId, groundLocation)
            })
        }

        deadSentients.forEach((sentientId: string) => {
            this.sendToDiscard(sentientId, groundLocation)
        })
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
            return
        }

        this.addLogMessage(`${playerId} is playing ${cardId} in ${locationId}`);

        this.payCardCost(playerId, card.cost);
        // TODO: add something to determine and execute what the sentient does on play
        this.moveCardToLocation(cardId, cardLocationString, `cardRef.${locationId}.occupants`);
        this.deselectCard()
        this.deselectTarget()
        this.resolveGround(`cardRef.${locationId}.occupants`)
        this.renderFn();
    }

    playNovelty(
        playerId: string,
        cardId: string,
        cardLocationString: string,
    ) {
        const card = this.cardRef[cardId]
        if (
            card.type !== 'novelty' ||
            !this.canPayCost(playerId, card.cost)
        ) {
            return
        }
        this.addLogMessage(`${playerId} is playing ${cardId} from ${cardLocationString}`);
        // TODO: add something to determine and execute what the novelty does

        const {
            effectId,
            effectArgs,
            // effectType
        } = card;

        const effectDetails = noveltyEffectService.getEffectDetails(effectId);
        if (!effectDetails) {
            this.addLogMessage(`No effect found for ${cardId}`);
            this.renderFn();
            return
        }

        const effectRequirements: any = {}
        let validRequirements = true;

        const { effect, requirements } = effectDetails;

        if (requirements) {
            // loop through requirement keys
            Object.keys(requirements).forEach((requirementKey: string) => {
                const requirement = requirements[requirementKey];
                const { type, source, location } = requirement;
                const splitSource = source.split('.');
                const sourceRoot = splitSource[0];
                if (sourceRoot === 'effectArgs') {
                    const extraArgKey = splitSource[1];
                    effectRequirements[requirementKey] = effectArgs[extraArgKey];
                    return
                }
                if (sourceRoot === 'selectedTarget') {
                    if (!this.selectedTarget || !this.selectedTarget.id) {
                        validRequirements = false;
                        return
                    }
                    const selectedCard = this.cardRef[this.selectedTarget.id];
                    if (!selectedCard || selectedCard.type !== type) {
                        validRequirements = false;
                        return
                    }
                    // TODO: add to postcheck for card
                    if (location) {
                        const selectedCardLocation = this.selectedTarget.location.split('.');
                        const selectedCardLocationType = selectedCardLocation[selectedCardLocation.length - 1];
                        if (location === 'field') {
                            if (selectedCardLocationType !== 'occupants') {
                                validRequirements = false;
                                return
                            }
                            effectRequirements[requirementKey] = selectedCard;
                        }
                    }
                }

            })
        }

        if (!validRequirements) {
            this.addLogMessage(`Requirements not met for ${cardId}`);
            this.renderFn();
            return
        }

        this.payCardCost(playerId, card.cost);

        const effectResult = effect(effectRequirements)

        const {
            // success,
            moveTo
        } = effectResult;

        if (moveTo) {
            if (moveTo === 'discard') {
                this.sendToDiscard(cardId, cardLocationString);
            } else {
                this.moveCardToLocation(cardId, cardLocationString, moveTo);
            }
        }

        this.resolveField()

        this.deselectCard()
        this.deselectTarget()

        this.renderFn();
    }

}

const gameService = new GameService();


////////////////////////////////////////////
export default gameService;
