import { useState } from "react";
import gameService from "../../services/gameService";
import CardModal from "../CardModal/CardModal";
import Hand from "../Hand/Hand";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import SelectedCard from "../SelectedCard/SelectedCard";
import SelectedTarget from "../SelectedTarget/SelectedTarget";
import './activePlayerBar.scss';

export default function ActivePlayerBar() {
    const {
        activePlayer,
        selectedCard,
        selectedTarget
    } = gameService;
    const playerInfo = gameService.players[activePlayer];
    const {
        hand
    } = playerInfo;

    const [handModalActive, setHandModalActive] = useState(false);
    const [selectedCardModalActive, setSelectedCardModalActive] = useState(false);
    const [selectedTargetModalActive, setSelectedTargetModalActive] = useState(false);

    return (
        <>
            <div className="active-player-bar-container flex-center">
                <div className="active-player-image">
                    {/* placeholder image 80x80 */}
                    <img src="https://via.placeholder.com/80" alt="player" />
                </div>
                <div className="player-info-wrapper flex-center">
                    <PlayerInfo playerId={activePlayer} />
                </div>
                <div className="action-buttons-wrapper flex-center">
                    <div
                        onClick={() => {
                            setHandModalActive(true);
                        }}
                        className="hand-button btn-wrap flex-center">
                        Hand <br /> ({hand.length})
                    </div>
                    <div
                        onClick={() => {
                            if (selectedCard.id) {
                                setSelectedCardModalActive(true);
                            }
                        }}
                        className="selected-card-button btn-wrap flex-center">
                        Selected <br />
                        {selectedCard.id ? 'X' : 'O'}
                    </div>
                    <div
                        onClick={() => {
                            if (selectedTarget.id) {
                                setSelectedTargetModalActive(true);
                            }
                        }}
                        className="selected-target-button btn-wrap flex-center">
                        Target <br />
                        {selectedTarget.id ? 'X' : 'O'}
                    </div>
                </div>
            </div>
            <CardModal
                active={handModalActive}
                onClose={() => setHandModalActive(false)}
            >
                <div className="player-hand">
                    <Hand playerId={activePlayer} />
                </div>
            </CardModal>

            <CardModal
                active={selectedCardModalActive}
                onClose={() => setSelectedCardModalActive(false)}
            >
                <div className="selected-card">
                    <SelectedCard />
                </div>
            </CardModal>

            <CardModal
                active={selectedTargetModalActive}
                onClose={() => setSelectedTargetModalActive(false)}
            >
                <div className="selected-target">
                    <SelectedTarget />
                </div>
            </CardModal>

        </>
    )
}