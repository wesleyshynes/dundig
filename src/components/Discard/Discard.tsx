import gameService from "../../services/gameService";
import './discard.scss'

export default function Discard(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerDiscard = gameService.players[playerId].discard;

    return (
        <div className="discard">
            discard: {playerDiscard.length} <br />
            <button title="view" onClick={() => gameService.setActiveModal('discard', { playerId })}>
                view
            </button>
        </div>
    )
}