import gameService from "../../services/gameService";

export default function Discard(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerDiscard = gameService.players[playerId].discard;

    return (
        <div className="discard">
            discard: {playerDiscard.length} <br />
        </div>
    )
}