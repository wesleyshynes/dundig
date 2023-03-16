import gameService from "../../services/gameService";
import FullGameCard from "../FullGameCard/FullGameCard";
import './selectedCard.scss'

export default function SelectedCard() {

    const { activePlayer, selectedCard, selectedTarget } = gameService;
    const { id, location } = selectedCard

    if (!id) {
        return (
            <div className="selected-card">
                No card selected
            </div>
        )
    }

    const cardButtons = [{
        label: 'deselect',
        clickFn: () => { gameService.deselectCard() }
    }]

    const cardInfo = gameService.cardRef[id];

    if (cardInfo.type === 'sentient') {
        const canPayCost = gameService.canPayCost(activePlayer, cardInfo.cost);
        const targetInfo = gameService.cardRef[selectedTarget.id];
        const splitTarget = selectedTarget.location.split('.');
        const targetLocation = splitTarget.pop();
        if (
            targetInfo &&
            canPayCost &&
            targetInfo.type === 'ground' &&
            targetLocation !== 'discard' &&
            targetInfo.owner === activePlayer
        ) {
            // TODO: add button to play at target
            cardButtons.push({
                label: 'play',
                clickFn: () => {
                    gameService.playSentientInGround(
                        activePlayer,
                        id,
                        location,
                        targetInfo.id
                    )
                }
            })
        }
    }

    if (cardInfo.type === 'novelty') {
        const canPayCost = gameService.canPayCost(activePlayer, cardInfo.cost);
        if (canPayCost) {
            cardButtons.push({
                label: 'play',
                clickFn: () => {
                    gameService.playNovelty(
                        activePlayer,
                        id,
                        location
                    )
                }
            })
        }
    }

    return (
        <div className="selected-card">
            SELECTED CARD: <br />
            <FullGameCard
                cardId={id}
                location={location}
                buttons={cardButtons}
            />
        </div>
    )
}