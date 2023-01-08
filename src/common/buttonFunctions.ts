import gameService from '../services/gameService';

const targetFunction = (cardId: string, location: string) => {
    gameService.selectTarget(cardId, location);
}

export const TARGET_BUTTON = {
    label: 'target',
    clickFn: targetFunction
}

const selectCardFunction = (cardId: string, location: string) => {
    gameService.selectCard(cardId, location);
}

export const SELECT_CARD_BUTTON = {
    label: 'select',
    clickFn: selectCardFunction
}