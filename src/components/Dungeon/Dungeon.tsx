import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import './dungeon.scss'

export default function Dungeon(props: {
    playerId: string,
}) {
    const { playerId } = props;
    const playerDungeon = gameService.players[playerId].dungeon;

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
                    // const card = gameService.cardRef[cardId];
                    return (
                        <div key={index} className="dungeon-card">
                            <GameCard
                                cardId={cardId}
                                location={`players.${playerId}.dungeon`}
                                buttons={[]}
                            />
                        </div>
                    )
                })}
            </div>

        </div>
    )

}