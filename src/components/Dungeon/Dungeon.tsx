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

    const payGroundCard = (cardId: string, location: string) => {
        gameService.payGroundCard(playerId, cardId, location)
    }

    return (
        <div className="dungeon">
            dungeon: {playerDungeon.length} <br />

            {gameService.canPlayCardHere(`players.${playerId}.dungeon`) && (
                <button onClick={() => {
                    gameService.playCardHere(`players.${playerId}.dungeon`)
                }}>
                    Play Room Here
                </button>
            )}

            <div className="dungeon-grounds">
                {playerDungeon.map((cardId, index) => {
                    const dungeonButtons: any[] = [
                        TARGET_BUTTON,
                    ]
                    if(myDungeon && index === playerDungeon.length - 1) {
                        dungeonButtons.push({
                            clickFn: payGroundCard,
                            label: 'pay ground',
                        })
                    }
                    return (
                        <div key={index} className="dungeon-card">
                            <GameCard
                                cardId={cardId}
                                location={`players.${playerId}.dungeon`}
                                buttons={dungeonButtons}
                            />
                        </div>
                    )
                })}
            </div>

        </div>
    )

}