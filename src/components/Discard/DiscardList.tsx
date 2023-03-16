import { TARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";

export default function DiscardList(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerDiscard = gameService.players[playerId].discard;

    return (
        <div className="discard-cards">
            {playerDiscard.map((cardId, index) => {
                return (
                    <div key={index} className="discard-card">
                        <GameCard
                            cardId={cardId}
                            location={`players.${playerId}.discard`}
                            buttons={[
                                TARGET_BUTTON,
                            ]}
                        />
                    </div>
                )
            })}
        </div>
    )
}