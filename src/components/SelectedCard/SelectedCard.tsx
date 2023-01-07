import gameService from "../../services/gameService";
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

    const cardInfo = gameService.cardRef[id]

    return (
        <div className="selected-card">
            {cardInfo.name} - {location} <br />
            <button onClick={() => {
                gameService.deselectCard();
            }}>
                Deselect Card
            </button>
        </div>
    )
}