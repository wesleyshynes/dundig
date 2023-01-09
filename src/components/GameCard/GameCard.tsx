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

    if (!cardInfo) {
        return (
            <div className="game-card">
                No card info
            </div>
        )
    }

    const cardLocation = location.split('.');
    const cardLocationType = cardLocation[cardLocation.length - 1];

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

            {cardInfo.type === 'ground' && (
                <div className="ground-occupants">
                    OCCUPANTS: <br />
                    {cardInfo.occupants.map((occupant, idx) => {
                        const buttons = []
                        const currentSpot = `cardRef.${cardId}.occupants`
                        if (cardLocationType === 'dungeon') {
                            const locationOwner = cardLocation[1]
                            const locationRef = gameService.parseLocation(location)
                            const locationSpot = locationRef.indexOf(cardId)
                            const moveBack = locationSpot === 0 ? `players.${locationOwner}.entrance.occupants` :
                                `cardRef.${locationRef[locationSpot - 1]}.occupants`
                            buttons.push({
                                label: '<-',
                                clickFn: () => {
                                    gameService.removeCardFromLocation(occupant, currentSpot)
                                    gameService.addCardToLocation(occupant, moveBack)
                                    gameService.renderFn()
                                }
                            })
                        }
                        return (
                            <div key={idx}>
                                {occupant}
                                {buttons.map((btn, jdx) => (
                                    <button
                                        key={jdx}
                                        onClick={() => btn.clickFn()}>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
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
                        onClick={() => button.clickFn(cardId, location)}>
                        {button.label}
                    </button>
                ))}
            </div>
        </div>
    )

}