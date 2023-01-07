import { useEffect, useState } from 'react';
import gameService from './services/gameService';
import './App.scss';
import PlayerField from './components/PlayerField/PlayerField';
import CommonGround from './components/CommonGround/CommonGround';
import SelectedCard from './components/SelectedCard/SelectedCard';
import GameLog from './components/GameLog/GameLog';
import GameOptions from './components/GameOptions/GameOptions';

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
      <div className="render-count">
        R: {renderCount}
      </div>

      <GameLog />

      <GameOptions />

      <SelectedCard />

      <PlayerField playerId={activePlayer} />

      <CommonGround />

      {Object.keys(gameService.players).filter(x => x !== activePlayer).map((playerId) => (
        <PlayerField key={playerId} playerId={playerId} />
      ))}

    </div>
  );
}

export default App;
