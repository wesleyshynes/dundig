import gameService from "../../services/gameService";
import './gameCard.scss'

export default function GameCard(props: {
    cardId: string;
}) {
    const cardInfo = gameService.cardRef[props.cardId];

    return (
        <div className="game-card">
            {cardInfo.name} <br />
            {cardInfo.type} <br />
        </div>
    )

}