import gameService from "../../services/gameService";

export default function PlayerInfo(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerInfo = gameService.players[playerId];
    const {
        name,
    } = playerInfo;

    return (
        <div className="player-info-details">
            player field: {playerId} <br />
            name: {name} <br />
            Resources: {playerInfo.resources.hand} H, {playerInfo.resources.ground} G
        </div>
    )

}