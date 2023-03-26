import { SMALL_TARGET_BUTTON, TARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import SmallGameCard from "../SmallGameCard/SmallGameCard";
import './dungeon.scss'

const emptyDungeon = ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'];

export default function Dungeon(props: {
    playerId: string,
}) {
    const { playerId } = props;
    const playerDungeon = gameService.players[playerId].dungeon;
    const { activePlayer } = gameService;
    const myDungeon = playerId === activePlayer;

    const { selectedCard } = gameService;
    const selectedCardIsInHand = selectedCard.location === `players.${playerId}.hand`;
    const selectedCardInfo = gameService.cardRef[selectedCard.id];

    const payGroundCard = (o: { cardId: string, location: string }) => {
        const { cardId, location } = o;
        gameService.payGroundCard(playerId, cardId, location)
    }

    const playSentientInGround = (o: { cardId: string, location: string }) => {
        const {
            cardId, 
            // location,
        } = o;
        gameService.playSentientInGround(playerId, selectedCard.id, selectedCard.location, cardId)
    }

    const dungeonRooms = [...playerDungeon, ...emptyDungeon.slice(playerDungeon.length)]

    return (
        <div className="dungeon">
            dungeon: {playerDungeon.length} <br />

            {gameService.canPlaySelectedCardHere(`players.${playerId}.dungeon`) && (
                <button title="play room here" onClick={() => {
                    gameService.setGroundPlayedThisTurn()
                    gameService.playSelectedCardHere(`players.${playerId}.dungeon`)
                }}>
                    Play Room Here
                </button>
            )}

            <div className="dungeon-grounds">
                {dungeonRooms.map((cardId, index) => {

                    if(cardId === 'empty') {
                        return (
                            <div className="empty-dungeon-card flex-center">
                                :(
                            </div>
                        )
                    }

                    const groundLocation = `players.${playerId}.dungeon`
                    const dungeonButtons: any[] = [
                        SMALL_TARGET_BUTTON,
                    ]
                    const groundsInfo = gameService.cardRef[cardId];
                    if (myDungeon && index === playerDungeon.length - 1 && groundsInfo.type === 'ground') {
                        dungeonButtons.push({
                            clickFn: payGroundCard,
                            title: 'pay ground',
                            label: '🏠',
                            disable: groundsInfo.occupants.length > 0
                        })
                    }

                    if (selectedCardInfo && selectedCardInfo.type === 'sentient' && selectedCardIsInHand) {
                        const canPayCost = gameService.canPayCost(activePlayer, selectedCardInfo.cost);
                        const targetInfo = groundsInfo
                        const splitTarget = groundLocation.split('.');
                        const targetLocation = splitTarget.pop();
                        if (
                            targetInfo &&
                            canPayCost &&
                            targetInfo.type === 'ground' &&
                            targetLocation !== 'discard' &&
                            targetInfo.owner === activePlayer
                        ) {
                            // TODO: add button to play at target
                            dungeonButtons.push({
                                title: 'play',
                                label: '▶️',
                                clickFn: playSentientInGround
                            })
                        }
                    }


                    return (
                        <div key={index} className="dungeon-card">
                            <SmallGameCard
                                cardId={cardId}
                                location={groundLocation}
                                buttons={dungeonButtons}
                            />
                        </div>
                    )
                })}
            </div>

        </div>
    )

}