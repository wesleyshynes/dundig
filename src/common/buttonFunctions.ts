import gameService from '../services/gameService';

const targetFunction = (o: { cardId: string, location: string }) => {
    gameService.selectTarget(o);
}

export const TARGET_BUTTON = {
    label: 'target',
    clickFn: targetFunction
}

const selectCardFunction = (o: { cardId: string, location: string }) => {
    gameService.selectCard(o);
}

export const SELECT_CARD_BUTTON = {
    label: 'select',
    clickFn: selectCardFunction
}