import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
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

    if(cardInfo.type === 'sentient') {
        const canPayCost = gameService.canPayCost(activePlayer, cardInfo.cost);
        const targetInfo = gameService.cardRef[selectedTarget.id];
        if(targetInfo && canPayCost && targetInfo.type === 'ground') {
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

    return (
        <div className="selected-card">
            SELECTED CARD: <br />
            <GameCard
                cardId={id}
                location={location}
                buttons={cardButtons}
            />
        </div>
    )
}