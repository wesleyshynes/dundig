import gameService from "../../services/gameService";

export default function GameOptions() {
    const { activePlayer } = gameService;
    return (
        <div className="dev-options">
            {gameService.players && Object.keys(gameService.players).map((playerId) => (
                <div key={playerId}>
                    <button
                        key={playerId}
                        onClick={() => gameService.setActivePlayer({ playerId })}
                        disabled={activePlayer === playerId}>
                        play as {playerId}
                    </button>
                    <button
                        key={playerId}
                        onClick={() => {
                            gameService.players[playerId].resources.hand += 1
                            gameService.players[playerId].resources.ground += 1
                            gameService.renderFn()
                        }}
                        disabled={false}>
                        Resource {playerId}
                    </button>
                </div>
            ))}
            {/* show game info button */}
            <button onClick={() => gameService.showGameInfo()}>Log</button>
        </div>
    )
}