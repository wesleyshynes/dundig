import gameService from "../../services/gameService";
import Occupant from "../Occupant/Occupant";
import './gameCard.scss'

export interface CardButtonEntry {
    clickFn: (o: { cardId: string, location: string }) => void,
    label: string,
    disable?: boolean
}

export default function GameCard(props: {
    cardId: string,
    location: string,
    buttons: CardButtonEntry[]
}) {

    const { selectedCard } = gameService;

    const { cardId, location } = props;
    const cardInfo = gameService.cardRef[cardId];

    if (!cardInfo) {
        return (
            <div className="game-card">
                No card info
            </div>
        )
    }

    const isCardSelected = selectedCard.id === cardId;

    // const cardLocation = location.split('.');
    // const cardLocationType = cardLocation[cardLocation.length - 1];

    return (
        <div className={`game-card ${cardInfo.type}`}>
            LVL: {cardInfo.level} {cardInfo.name} <br />
            {cardInfo.type} {isCardSelected ? 'X' : ''} <br />

            {cardInfo.type !== 'ground' && cardInfo.cost && (
                <div className="card-cost">
                    H: {cardInfo.cost.hand} / G: {cardInfo.cost.ground} <br />
                </div>
            )}

            {cardInfo.type === 'ground' && (
                <div className="card-cost">
                    - <br />
                </div>
            )}

            <div className="img-wrapper-container">
                <div className="img-wrapper">
                    <img src={`${cardInfo.image}`} alt={cardInfo.name} /> <br />
                </div>
            </div>

            {cardInfo.type === 'sentient' && (
                <div className="sentient-stats">
                    A: {cardInfo.attack} / H: {cardInfo.health} / S: {cardInfo.speed} <br />
                </div>
            )}

            {cardInfo.type === 'novelty' && (
                <div className="novelty-stats">
                    {cardInfo.effectId} <br />
                </div>
            )}

            {cardInfo.type === 'ground' && (
                <div className="ground-stats">
                    {cardInfo.effectId} <br />
                </div>
            )}

            <br />

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

            {cardInfo.type === 'ground' && (
                <div className="ground-occupants">
                    OCCUPANTS: <br />
                    <div className="ground-occupants-list-wrapper">
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
                    </div>
                    <br />
                </div>
            )}




        </div>
    )

}