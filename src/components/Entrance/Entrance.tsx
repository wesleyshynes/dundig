import { TARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import "./entrance.scss";

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
                    buttons={[TARGET_BUTTON]}
                />
        </div>
    )
}