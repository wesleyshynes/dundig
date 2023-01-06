import { useEffect, useState } from 'react';
import gameService from './services/gameService';
import './App.scss';
import PlayerField from './components/PlayerField/PlayerField';
import CommonGround from './components/CommonGround/CommonGround';

function App() {

  const [renderCount, setRenderCount] = useState(0);
  const [activePlayer, setActivePlayer] = useState('player1');

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

  return (
    <div className="App">
      {gameService.gameState} {renderCount}

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
