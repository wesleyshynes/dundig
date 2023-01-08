import gameService from "../../services/gameService";
import './gameCard.scss'

export default function GameCard(props: {
    cardId: string,
    location: string,
    buttons: {
        clickFn: (cardId: string, location: string) => void,
        label: string
    }[]
}) {
    const { cardId, location } = props;
    const cardInfo = gameService.cardRef[props.cardId];

    return (
        <div className="game-card">
            {cardInfo.name} <br />
            {cardInfo.type} <br />
            {cardInfo.type !== 'ground' && cardInfo.cost && (
                <div className="card-cost">
                    H: {cardInfo.cost.hand} <br />
                    G: {cardInfo.cost.ground} <br />
                </div>
            )} <br />

            <div className="card-buttons">
                {props.buttons.map((button, idx) => (
                    <button
                        key={idx}
                        onClick={() => button.clickFn(cardId, location)}>
                        {button.label}
                    </button>
                ))}
            </div>
        </div>
    )

}