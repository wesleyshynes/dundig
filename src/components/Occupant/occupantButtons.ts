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

    const { activePlayer, thisTurn: { played } } = gameService;
    const cardLocation = location.split('.');

    const cardLocationType = cardLocation[cardLocation.length - 1];
    const isOccupantOwner = activePlayer === gameService.cardRef[occupantId].owner

    const movementDisabled = played[occupantId] || speed <= 0


    const buttons = []

    const moveTo = (targetLocation: string) => {
        gameService.handleGroundNavigation(occupantId, occupantLocation, targetLocation)
        const splitLocation = targetLocation.split('.')
        splitLocation.pop()
        const locationCardId = gameService.parseLocation(splitLocation.join('.')).id
        gameService.setActiveModal('occupants', {
            cardId: locationCardId,
            location: gameService.locateCardOnField(locationCardId),
        })
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
            title: '<- move back',
            label: '⬅️',
            clickFn: () => {
                moveTo(moveBack)
            },
            disable: movementDisabled
        })

        const moveForward = locationSpot === locationRef.length - 1 ? `players.${locationOwner}.garrison.occupants` :
            `cardRef.${locationRef[locationSpot + 1]}.occupants`
        isOccupantOwner && buttons.push({
            title: 'move forward ->',
            label: '➡️',
            clickFn: () => {
                moveTo(moveForward)
            },
            disable: movementDisabled
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
            title: '<- move back',
            label: '⬅️',
            clickFn: () => {
                moveTo(moveBackward)
            },
            disable: movementDisabled
        })
        isOccupantOwner && buttons.push({
            title: 'move to entrance',
            label: '🚪',
            clickFn: () => {
                moveTo(moveEntrance)
            },
            disable: movementDisabled
        })
    }

    // ENTRANCE OCCUPANT ACTIONS
    if (cardLocationType === 'entrance') {
        const locationOwner = cardLocation[1]
        const locationOwnerDungeon = gameService.players[locationOwner].dungeon
        const moveIn = locationOwnerDungeon.length > 0 ? `cardRef.${locationOwnerDungeon[0]}.occupants` :
            `players.${locationOwner}.garrison.occupants`
        isOccupantOwner && buttons.push({
            title: 'move forward ->',
            label: '➡️',
            clickFn: () => {
                moveTo(moveIn)
            },
            disable: movementDisabled
        })
        const moveToCommonGround = `cardRef.commonGround.occupants`
        isOccupantOwner && buttons.push({
            title: 'move to common ground',
            label: '🌎',
            clickFn: () => {
                moveTo(moveToCommonGround)
            },
            disable: movementDisabled
        })
    }

    // COMMON GROUND OCCUPANT ACTIONS
    if (cardLocationType === 'commonGround') {
        const moveToMyEntrance = `players.${activePlayer}.entrance.occupants`
        isOccupantOwner && buttons.push({
            title: 'move to entrance',
            label: '🚪',
            clickFn: () => {
                moveTo(moveToMyEntrance)
            },
            disable: movementDisabled
        })
        const opponentName = Object.keys(gameService.players).filter(player => player !== activePlayer)[0]
        if (opponentName) {
            const moveToOpponentEntrance = `players.${opponentName}.entrance.occupants`
            isOccupantOwner && buttons.push({
                title: `move to ${opponentName}'s entrance`,
                label: '💀',
                clickFn: () => {
                    moveTo(moveToOpponentEntrance)
                },
                disable: movementDisabled
            })
        }
    }

    // default buttons
    buttons.push(
        {
            // label: 'select',
            title: 'select card',
            label: '👆',
            clickFn: () => {
                gameService.selectCard({ cardId: occupantId, location: occupantLocation })
                gameService.setActiveModal('selectedCard')
            }
        },
        {
            // label: 'target',
            title: 'select target',
            label: '🎯',
            clickFn: () => {
                gameService.selectTarget({ cardId: occupantId, location: occupantLocation })
                gameService.setActiveModal('selectedTarget')
            }
        }
    )

    return buttons
}