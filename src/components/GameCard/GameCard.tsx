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

    const { activePlayer } = gameService;

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

                        // DUNGEON OCCUPANT ACTIONS
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

                            const moveForward = locationSpot === locationRef.length - 1 ? `players.${locationOwner}.garrison.occupants` :
                                `cardRef.${locationRef[locationSpot + 1]}.occupants`
                            buttons.push({
                                label: '->',
                                clickFn: () => {
                                    gameService.removeCardFromLocation(occupant, currentSpot)
                                    gameService.addCardToLocation(occupant, moveForward)
                                    gameService.renderFn()
                                }
                            })
                        }

                        // GARRISON OCCUPANT ACTIONS
                        if (cardLocationType === 'garrison') {
                            const locationOwner = cardLocation[1]
                            const locationOwnerDungeon = gameService.players[locationOwner].dungeon
                            const moveEntrance = `players.${locationOwner}.entrance.occupants`
                            const moveBackward = locationOwnerDungeon.length > 0 ? `cardRef.${locationOwnerDungeon[locationOwnerDungeon.length - 1]}.occupants` :
                                moveEntrance
                            buttons.push({
                                label: '<-',
                                clickFn: () => {
                                    gameService.removeCardFromLocation(occupant, currentSpot)
                                    gameService.addCardToLocation(occupant, moveBackward)
                                    gameService.renderFn()
                                }
                            })
                            buttons.push({
                                label: 'entrance',
                                clickFn: () => {
                                    gameService.removeCardFromLocation(occupant, currentSpot)
                                    gameService.addCardToLocation(occupant, moveEntrance)
                                    gameService.renderFn()
                                }
                            })
                        }

                        // ENTRANCE OCCUPANT ACTIONS
                        if (cardLocationType === 'entrance') {
                            const locationOwner = cardLocation[1]
                            const locationOwnerDungeon = gameService.players[locationOwner].dungeon
                            const moveIn = locationOwnerDungeon.length > 0 ? `cardRef.${locationOwnerDungeon[0]}.occupants` :
                                `players.${locationOwner}.garrison.occupants`
                            buttons.push({
                                label: '->',
                                clickFn: () => {
                                    gameService.removeCardFromLocation(occupant, currentSpot)
                                    gameService.addCardToLocation(occupant, moveIn)
                                    gameService.renderFn()
                                }
                            })
                            const moveToCommonGround = `cardRef.commonGround.occupants`
                            buttons.push({
                                label: 'common',
                                clickFn: () => {
                                    gameService.removeCardFromLocation(occupant, currentSpot)
                                    gameService.addCardToLocation(occupant, moveToCommonGround)
                                    gameService.renderFn()
                                }
                            })
                        }

                        // COMMON GROUND OCCUPANT ACTIONS
                        if (cardLocationType === 'commonGround') {
                            const moveToMyEntrance = `players.${activePlayer}.entrance.occupants`
                            buttons.push({
                                label: 'my entrance',
                                clickFn: () => {
                                    gameService.removeCardFromLocation(occupant, currentSpot)
                                    gameService.addCardToLocation(occupant, moveToMyEntrance)
                                    gameService.renderFn()
                                }
                            })
                            const opponentName = Object.keys(gameService.players).filter(player => player !== activePlayer)[0]
                            if (opponentName) {
                                const moveToOpponentEntrance = `players.${opponentName}.entrance.occupants`
                                buttons.push({
                                    label: `${opponentName}'s entrance`,
                                    clickFn: () => {
                                        gameService.removeCardFromLocation(occupant, currentSpot)
                                        gameService.addCardToLocation(occupant, moveToOpponentEntrance)
                                        gameService.renderFn()
                                    }
                                })
                            }
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