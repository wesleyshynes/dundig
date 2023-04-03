export interface CardLocation {
    side: string // will be playerId or common
    place: 'dungeon' | 'hand' | 'discard' | 'garrison' | 'entrance' | 'deck' | 'cardVoid'
    cardId?: string
}