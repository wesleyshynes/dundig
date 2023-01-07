import gameService from "../../services/gameService";

export default function GameOptions() {
    const { activePlayer } = gameService;
    return (
        <div className="dev-options">
            {gameService.players && Object.keys(gameService.players).map((playerId) => (
                <button
                    key={playerId}
                    onClick={() => gameService.setActivePlayer(playerId)}
                    disabled={activePlayer === playerId}>
                    {playerId}
                </button>
            ))}
        </div>
    )
}