import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";

export default function Entrance(props: {
    playerId: string,
}) {
    const { playerId } = props;
    const playerEntrance = gameService.players[playerId].entrance;

    return (
        <div className="entrance">
            entrance: {playerEntrance.occupants.length}
                <GameCard
                    cardId={playerEntrance.id}
                    location={`players.${playerId}.entrance`}
                    buttons={[]}
                />
        </div>
    )
}