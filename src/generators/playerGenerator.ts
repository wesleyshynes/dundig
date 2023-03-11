import { Player } from "../types/player.model";
import { imageUrlGenerator } from "./deckGenerator";

export const generatePlayer = (options: {
    playerName: string,
    playerId: string,
    order: number,
}): Player => {
    const { playerName, playerId, order } = options;
    return {
        id: playerId,
        order: order,
        name: playerName,
        deck: [],
        hand: [],
        entrance: {
            id: `${playerId}entrance`,
            setId: 'entrance',
            image: imageUrlGenerator(),
            owner: playerId,
            name: `${playerName}'s Entrance`,
            type: 'ground',
            category: 'entrance',
            occupants: [],
            connections: [],
            level: 0,
            effectId: 'doNothing',
            effectType: 'once',
            effectArgs: {},
            effectedSentients: [],
        },
        dungeon: [],
        garrison: {
            id: `${playerId}garrison`,
            setId: 'garrison',
            image: imageUrlGenerator(),
            owner: playerId,
            name: `${playerName}'s Garrison`,
            type: 'ground',
            category: 'garrison',
            occupants: [],
            connections: [],
            level: 0,
            effectId: 'doNothing',
            effectType: 'once',
            effectArgs: {},
            effectedSentients: [],
        },
        discard: [],
        resources: {
            hand: 0,
            ground: 0,
        },
    };
}