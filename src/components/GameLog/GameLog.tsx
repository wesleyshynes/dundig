import gameService from "../../services/gameService";
import "./gameLog.scss";

export default function GameLog(props: {
    renderCount: number;
}) {
    const { renderCount } = props;
    const last100 = gameService.log.slice(-100).reverse();
    return (
        <div className="game-log">
            
            <div className={'log-entry'}>Rndr: {renderCount}</div>
            {/* {gameService.gameState} - {gameService.log[gameService.log.length - 1]} */}
            {last100.map((log, index) => <div className={'log-entry'} key={index}>{log}</div>)}
        </div>
    )
}