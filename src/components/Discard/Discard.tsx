import { useState } from "react";
import { TARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
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
                <div className="card-modal-bg" onClick={(e: any) => {
                    if(e.target.className.indexOf('card-modal-bg') === -1) {
                        return
                    }
                    setShowDiscard(false)
                }}>
                    <div className="card-modal">
                        <button onClick={() => setShowDiscard(false)}>close</button>
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
                    </div>
                </div>
            )}
        </div>
    )
}