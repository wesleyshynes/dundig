import gameService from "../../services/gameService";
import './gameCard.scss'

export default function GameCard(props: {
    cardId: string;
    location: string;
}) {
    const { cardId, location } = props;
    const { activePlayer } = gameService;
    const cardInfo = gameService.cardRef[props.cardId];

    return (
        <div className="game-card">
            {cardInfo.name} <br />
            {cardInfo.type} <br />
            <button
                disabled={activePlayer !== cardInfo.owner}
                onClick={() => gameService.playCard(cardId, location)}
            >
                Play Card
            </button>
        </div>
    )

}