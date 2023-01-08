import { TARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";

export default function Garrison(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerGarrison = gameService.players[playerId].garrison;

    return (
        <div className="garrison">
            garrison: {playerGarrison.occupants.length} <br />
            <GameCard
                cardId={playerGarrison.id}
                location={`players.${playerId}.garrison`}
                buttons={[TARGET_BUTTON]}
            />
        </div>
    )

}