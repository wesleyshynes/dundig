import gameService from "../../services/gameService"
import { Sentient } from "../../types/sentient.model";

export const generateOccupantButtons = (options: {
    occupantId: string,
    occupantInfo: Sentient,
    occupantLocation: string,
    location: string,
    locationId: string,
}) => {

    const { 
        occupantId,
        occupantInfo,
        occupantLocation,
        location,
        locationId,
     } = options

    const { 
        // attack, 
        // health, 
        speed 
    } = occupantInfo

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
            // label: '<-',
            label: '⬅️',
            clickFn: () => {
                moveTo(moveBack)
            },
            disabled: speed <= 0
        })

        const moveForward = locationSpot === locationRef.length - 1 ? `players.${locationOwner}.garrison.occupants` :
            `cardRef.${locationRef[locationSpot + 1]}.occupants`
        isOccupantOwner && buttons.push({
            // label: '->',
            label: '➡️',
            clickFn: () => {
                moveTo(moveForward)
            },
            disabled: speed <= 0
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
            // label: '<-',
            label: '⬅️',
            clickFn: () => {
                moveTo(moveBackward)
            },
            disabled: speed <= 0
        })
        isOccupantOwner && buttons.push({
            // label: 'entrance',
            label: '🚪',
            clickFn: () => {
                moveTo(moveEntrance)
            },
            disabled: speed <= 0
        })
    }

    // ENTRANCE OCCUPANT ACTIONS
    if (cardLocationType === 'entrance') {
        const locationOwner = cardLocation[1]
        const locationOwnerDungeon = gameService.players[locationOwner].dungeon
        const moveIn = locationOwnerDungeon.length > 0 ? `cardRef.${locationOwnerDungeon[0]}.occupants` :
            `players.${locationOwner}.garrison.occupants`
        isOccupantOwner && buttons.push({
            // label: '->',
            label: '➡️',
            clickFn: () => {
                moveTo(moveIn)
            },
            disabled: speed <= 0
        })
        const moveToCommonGround = `cardRef.commonGround.occupants`
        isOccupantOwner && buttons.push({
            // label: 'common',
            label: '🌎',
            clickFn: () => {
                moveTo(moveToCommonGround)
            },
            disabled: speed <= 0
        })
    }

    // COMMON GROUND OCCUPANT ACTIONS
    if (cardLocationType === 'commonGround') {
        const moveToMyEntrance = `players.${activePlayer}.entrance.occupants`
        isOccupantOwner && buttons.push({
            // label: 'my entrance',
            label: '🚪',
            clickFn: () => {
                moveTo(moveToMyEntrance)
            },
            disabled: speed <= 0
        })
        const opponentName = Object.keys(gameService.players).filter(player => player !== activePlayer)[0]
        if (opponentName) {
            const moveToOpponentEntrance = `players.${opponentName}.entrance.occupants`
            isOccupantOwner && buttons.push({
                // label: `${opponentName}'s entrance`,
                label: '💀',
                clickFn: () => {
                    moveTo(moveToOpponentEntrance)
                },
                disabled: speed <= 0
            })
        }
    }

    // default buttons
    buttons.push(
        {
            // label: 'select',
            label: '👆',
            clickFn: () => {
                gameService.selectCard({ cardId: occupantId, location: occupantLocation })
            }
        },
        {
            // label: 'target',
            label: '🎯',
            clickFn: () => {
                gameService.selectTarget({ cardId: occupantId, location: occupantLocation })
            }
        }
    )

    return buttons
}