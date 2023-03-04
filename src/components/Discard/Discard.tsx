import { useState } from "react";
import { TARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import CardModal from "../CardModal/CardModal";
import GameCard from "../GameCard/GameCard";
import './discard.scss'

export default function Discard(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerDiscard = gameService.players[playerId].discard;

    const [showDiscard, setShowDiscard] = useState(false);

    return (
        <div className="discard">
            discard: {playerDiscard.length} <br />
            <button onClick={() => setShowDiscard(true)}>
                view
            </button>
            {showDiscard && (
                <CardModal
                    onClose={() => {
                        setShowDiscard(false);
                    }}
                    active={showDiscard}
                >
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
                </CardModal>
            )}
        </div>
    )
}