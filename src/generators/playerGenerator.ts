import { Player } from "../types/player.model";

export const generatePlayer = (options: {playerName: string, playerId: string}): Player => {
    const {playerName, playerId} = options;
    return {
        id: playerId,
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
        },
        discard: [],
        resources: {
            hand: 0,
            ground: 0,
        },
    };
}