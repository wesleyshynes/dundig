import React, { useEffect } from 'react';
import './App.scss';

import gameService from './services/gameService';

function App() {

  const [renderCount, setRenderCount] = React.useState(0);

  useEffect(() => {
    if (gameService.gameState === 'new') {
      gameService.setRenderFn(() => {
        setRenderCount(++gameService.renderCount);
      })
      gameService.startGame();
    }
    return () => { }
  }, [])

  return (
    <div className="App">
      {gameService.gameState} {renderCount}

      {gameService.gameState === 'started' && (
        <>
          {Object.keys(gameService.players).map((playerId) => (
            <div key={playerId}>
              {gameService.players[playerId].name}
              <br />
              <div className="player-deck">
                deck: {gameService.players[playerId].deck.length}
                <button onClick={() => gameService.drawCard(playerId)}>draw</button>
              </div>
              <div className="player-hand">
                hand: {gameService.players[playerId].hand.length}
                {gameService.players[playerId].hand?.map((card, idx) => (
                  <div key={idx}>
                    {card}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
