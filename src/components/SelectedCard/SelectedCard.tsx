import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import './selectedCard.scss'

export default function SelectedCard() {

    const { selectedCard } = gameService;
    const { id, location } = selectedCard

    if (!id) {
        return (
            <div className="selected-card">
                No card selected
            </div>
        )
    }

    return (
        <div className="selected-card">
            SELECTED CARD: <br />
            <GameCard
                cardId={id}
                location={location}
                buttons={[{
                    label: 'deselect',
                    clickFn: () => { gameService.deselectCard() }
                }]}
            />
        </div>
    )
}