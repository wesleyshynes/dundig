import gameService from '../services/gameService';

const targetFunction = (o: { cardId: string, location: string }) => {
    gameService.selectTarget(o);
}

const untargetFunction = (o: { cardId: string, location: string }) => {
    gameService.deselectTarget();
}

export const TARGET_BUTTON = {
    label: 'target',
    clickFn: targetFunction,
    title: 'target'
}

export const UNTARGET_BUTTON = {
    label: 'untarget',
    clickFn: untargetFunction,
    title: 'untarget'
}

const selectCardFunction = (o: { cardId: string, location: string }) => {
    gameService.selectCard(o);
}

export const SELECT_CARD_BUTTON = {
    label: 'select',
    clickFn: selectCardFunction,
    title: 'select'
}

// small buttons
export const SMALL_TARGET_BUTTON = {
    label: '🎯',
    clickFn: targetFunction,
    title: 'target'
}