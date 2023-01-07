import gameService from "../../services/gameService";

export default function GameLog() {
    return (
        <div className="game-log">
            {gameService.gameState} - {gameService.log[gameService.log.length - 1]}
        </div>
    )
}