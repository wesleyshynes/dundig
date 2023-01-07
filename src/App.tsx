import { useEffect, useState } from 'react';
import gameService from './services/gameService';
import './App.scss';
import PlayerField from './components/PlayerField/PlayerField';
import CommonGround from './components/CommonGround/CommonGround';

function App() {

  const [renderCount, setRenderCount] = useState(0);
  const { activePlayer } = gameService;

  useEffect(() => {
    if (gameService.gameState === 'new') {
      gameService.setRenderFn(() => {
        setRenderCount(++gameService.renderCount);
      })
      gameService.startGame();
    }
    return () => { }
  }, [])

  if (gameService.gameState === 'new') {
    return (
      <div className="App">
        Loading... 
      </div>
    )
  }

  if (gameService.gameState === 'ended') {
    return (
      <div className="App">
        Game ended
      </div>
    )
  }

  return (
    <div className="App">
      {gameService.gameState} {renderCount} - {gameService.log[gameService.log.length - 1]}

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

      <PlayerField playerId={activePlayer} />

      <CommonGround />

      {gameService.gameState === 'started' && (
        <>
          {Object.keys(gameService.players).filter(x => x !== activePlayer).map((playerId) => (
            <PlayerField key={playerId} playerId={playerId} />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
