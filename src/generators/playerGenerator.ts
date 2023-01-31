import { Player } from "../types/player.model";

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
            owner: playerName,
            name: `${playerName}'s Entrance`,
            type: 'ground',
            occupants: [],
            connections: [],
            level: 0,
            effectId: 'doNothing',
            effectType: 'once',
            effectArgs: {},
        },
        dungeon: [],
        garrison: {
            id: `${playerId}garrison`,
            owner: playerName,
            name: `${playerName}'s Garrison`,
            type: 'ground',
            occupants: [],
            connections: [],
            level: 0,
            effectId: 'doNothing',
            effectType: 'once',
            effectArgs: {},
        },
        discard: [],
        resources: {
            hand: 0,
            ground: 0,
        },
    };
}