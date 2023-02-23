import { TARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import './dungeon.scss'

export default function Dungeon(props: {
    playerId: string,
}) {
    const { playerId } = props;
    const playerDungeon = gameService.players[playerId].dungeon;
    const { activePlayer } = gameService;
    const myDungeon = playerId === activePlayer;

    const { selectedCard } = gameService;
    const selectedCardInfo = gameService.cardRef[selectedCard.id];

    const payGroundCard = (o: { cardId: string, location: string }) => {
        const { cardId, location } = o;
        gameService.payGroundCard(playerId, cardId, location)
    }

    const playSentientInGround = (o: { cardId: string, location: string }) => {
        const {
            // cardId, 
            location,
        } = o;
        gameService.playSentientInGround(playerId, selectedCard.id, selectedCard.location, location)
    }

    return (
        <div className="dungeon">
            dungeon: {playerDungeon.length} <br />

            {gameService.canPlaySelectedCardHere(`players.${playerId}.dungeon`) && (
                <button onClick={() => {
                    gameService.playSelectedCardHere(`players.${playerId}.dungeon`)
                }}>
                    Play Room Here
                </button>
            )}

            <div className="dungeon-grounds">
                {playerDungeon.map((cardId, index) => {
                    const groundLocation = `players.${playerId}.dungeon`
                    const dungeonButtons: any[] = [
                        TARGET_BUTTON,
                    ]
                    const groundsInfo = gameService.cardRef[cardId];
                    if (myDungeon && index === playerDungeon.length - 1 && groundsInfo.type === 'ground') {
                        dungeonButtons.push({
                            clickFn: payGroundCard,
                            label: 'pay ground',
                            disable: groundsInfo.occupants.length > 0
                        })
                    }

                    if (selectedCardInfo && selectedCardInfo.type === 'sentient') {
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
                                label: 'play',
                                clickFn: () => {
                                    playSentientInGround({ cardId, location: groundsInfo.id })
                                }
                            })
                        }
                    }


                    return (
                        <div key={index} className="dungeon-card">
                            <GameCard
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