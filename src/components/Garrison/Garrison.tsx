import gameService from "../../services/gameService";

export default function Garrison(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerGarrison = gameService.players[playerId].garrison;

    return (
        <div className="garrison">
            garrison: {playerGarrison.occupants.length} <br />
        </div>
    )

}