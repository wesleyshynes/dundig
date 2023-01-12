import gameService from "../../services/gameService";
import Occupant from "../Occupant/Occupant";
import './gameCard.scss'

interface CardButtonEntry {
    clickFn: (o: { cardId: string, location: string }) => void,
    label: string,
    disable?: boolean
}

export default function GameCard(props: {
    cardId: string,
    location: string,
    buttons: CardButtonEntry[]
}) {

    // const { activePlayer } = gameService;

    const { cardId, location } = props;
    const cardInfo = gameService.cardRef[props.cardId];

    if (!cardInfo) {
        return (
            <div className="game-card">
                No card info
            </div>
        )
    }

    // const cardLocation = location.split('.');
    // const cardLocationType = cardLocation[cardLocation.length - 1];

    return (
        <div className="game-card">
            {cardInfo.name} <br />
            {cardInfo.type} <br />

            {cardInfo.type !== 'ground' && cardInfo.cost && (
                <div className="card-cost">
                    H: {cardInfo.cost.hand} <br />
                    G: {cardInfo.cost.ground} <br />
                </div>
            )}
            {cardInfo.type === 'sentient' && (
                <div className="sentient-stats">
                    A: {cardInfo.attack} / H: {cardInfo.health} / S: {cardInfo.speed} <br />
                </div>
            )}

            <br />

            {cardInfo.type === 'ground' && (
                <div className="ground-occupants">
                    OCCUPANTS: <br />
                    {cardInfo.occupants.map((occupant, idx) => {
                        return (
                            <Occupant
                                key={idx}
                                occupantId={occupant}
                                occupantLocation={`cardRef.${cardId}.occupants`}
                                location={location}
                                locationId={cardId}
                            />
                        )
                    }
                    )}
                    <br />
                </div>
            )}

            <div className="card-buttons">
                {props.buttons.map((button, idx) => (
                    <button
                        key={idx}
                        disabled={button.disable}
                        onClick={() => button.clickFn({ cardId, location })}>
                        {button.label}
                    </button>
                ))}
            </div>
        </div>
    )

}