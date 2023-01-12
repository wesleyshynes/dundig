import gameService from "../../services/gameService";
// import { Sentient } from "../../types/sentient.model";

export default function Occupant(props: {
    occupantId: string,
    occupantLocation: string,
    location: string
    locationId: string

}) {
    const { occupantId, occupantLocation, location, locationId } = props;

    const occupantInfo = gameService.cardRef[occupantId];

    if (!occupantInfo || occupantInfo.type !== 'sentient') {
        return (
            <div className="occupant">
                No occupant info
            </div>
        )
    }

    const { attack, health, speed } = occupantInfo

    const { activePlayer } = gameService;
    const cardLocation = location.split('.');

    const cardLocationType = cardLocation[cardLocation.length - 1];
    const isOccupantOwner = activePlayer === gameService.cardRef[occupantId].owner

    const buttons = []

    const moveTo = (targetLocation: string) => {
        gameService.handleGroundNavigation(occupantId, occupantLocation, targetLocation)
        // gameService.moveCardToLocation(occupantId, occupantLocation, targetLocation)
    }

    // DUNGEON OCCUPANT ACTIONS
    if (cardLocationType === 'dungeon') {
        const locationOwner = cardLocation[1]
        const locationRef = gameService.parseLocation(location)
        const locationSpot = locationRef.indexOf(locationId)

        const moveBack = locationSpot === 0 ? `players.${locationOwner}.entrance.occupants` :
            `cardRef.${locationRef[locationSpot - 1]}.occupants`
        isOccupantOwner && buttons.push({
            label: '<-',
            clickFn: () => {
                moveTo(moveBack)
            }
        })

        const moveForward = locationSpot === locationRef.length - 1 ? `players.${locationOwner}.garrison.occupants` :
            `cardRef.${locationRef[locationSpot + 1]}.occupants`
        isOccupantOwner && buttons.push({
            label: '->',
            clickFn: () => {
                moveTo(moveForward)
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
        isOccupantOwner && buttons.push({
            label: '<-',
            clickFn: () => {
                moveTo(moveBackward)
            }
        })
        isOccupantOwner && buttons.push({
            label: 'entrance',
            clickFn: () => {
                moveTo(moveEntrance)
            }
        })
    }

    // ENTRANCE OCCUPANT ACTIONS
    if (cardLocationType === 'entrance') {
        const locationOwner = cardLocation[1]
        const locationOwnerDungeon = gameService.players[locationOwner].dungeon
        const moveIn = locationOwnerDungeon.length > 0 ? `cardRef.${locationOwnerDungeon[0]}.occupants` :
            `players.${locationOwner}.garrison.occupants`
        isOccupantOwner && buttons.push({
            label: '->',
            clickFn: () => {
                moveTo(moveIn)
            }
        })
        const moveToCommonGround = `cardRef.commonGround.occupants`
        isOccupantOwner && buttons.push({
            label: 'common',
            clickFn: () => {
                moveTo(moveToCommonGround)
            }
        })
    }

    // COMMON GROUND OCCUPANT ACTIONS
    if (cardLocationType === 'commonGround') {
        const moveToMyEntrance = `players.${activePlayer}.entrance.occupants`
        isOccupantOwner && buttons.push({
            label: 'my entrance',
            clickFn: () => {
                moveTo(moveToMyEntrance)
            }
        })
        const opponentName = Object.keys(gameService.players).filter(player => player !== activePlayer)[0]
        if (opponentName) {
            const moveToOpponentEntrance = `players.${opponentName}.entrance.occupants`
            isOccupantOwner && buttons.push({
                label: `${opponentName}'s entrance`,
                clickFn: () => {
                    moveTo(moveToOpponentEntrance)
                }
            })
        }
    }

    // default buttons
    buttons.push(
        {
            label: 'select',
            clickFn: () => {
                gameService.selectCard({ cardId: occupantId, location: occupantLocation })
            }
        },
        {
            label: 'target',
            clickFn: () => {
                gameService.selectTarget({ cardId: occupantId, location: occupantLocation })
            }
        }
    )


    return (
        <div className="occupant">
            {occupantId} <br />
            A:{attack}  / H:{health} / S:{speed} <br />
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