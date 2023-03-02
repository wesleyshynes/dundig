import gameService from "../../services/gameService";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
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

    return (
        <div className="active-player-bar-container flex-center">
            <div className="active-player-image">
                {/* placeholder image 80x80 */}
                <img src="https://via.placeholder.com/80" alt="player" />
            </div>
            <div className="player-info-wrapper flex-center">
                <PlayerInfo playerId={activePlayer} />
            </div>
            <div className="action-buttons-wrapper flex-center">
                <div className="hand-button btn-wrap flex-center">
                    Hand <br /> ({hand.length})
                </div>
                <div className="selected-card-button btn-wrap flex-center">
                    Selected <br />
                    {selectedCard.id ? 'X' : 'O'}
                </div>
                <div className="selected-target-button btn-wrap flex-center">
                    Target <br /> 
                    {selectedTarget.id ? 'X' : 'O'}
                </div>
            </div>
        </div>
    )
}