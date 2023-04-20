import { useEffect, useState } from 'react';
import gameService from './services/gameService';
import './App.scss';
import PlayerField from './components/PlayerField/PlayerField';
import CommonGround from './components/CommonGround/CommonGround';
// import SelectedCard from './components/SelectedCard/SelectedCard';
import GameLog from './components/GameLog/GameLog';
import GameOptions from './components/GameOptions/GameOptions';
// import SelectedTarget from './components/SelectedTarget/SelectedTarget';
import ActivePlayerBar from './components/ActivePlayerBar/ActivePlayerBar';
import CardModal from './components/CardModal/CardModal';
import Hand from './components/Hand/Hand';
import SelectedCard from './components/SelectedCard/SelectedCard';
import SelectedTarget from './components/SelectedTarget/SelectedTarget';
import OccupantList from './components/Occupant/OccupantList';
import DiscardList from './components/Discard/DiscardList';
import SelectResources from './components/SelectResources/SelectResources';

function App() {

  const [renderCount, setRenderCount] = useState(0);
  const {
    activePlayer,
    activeModal,
    modalOptions
  } = gameService;

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

      <ActivePlayerBar />

      <hr /><hr /><hr />

      {/* <div className="render-count">
        R: {renderCount}
      </div> */}

      <GameLog renderCount={renderCount} />

      <GameOptions />

      {/* <SelectedCard /> */}

      {/* <SelectedTarget /> */}

      <PlayerField playerId={activePlayer} />

      <CommonGround />

      {Object.keys(gameService.players).filter(x => x !== activePlayer).map((playerId) => (
        <PlayerField key={playerId} playerId={playerId} />
      ))}

      <CardModal
        key={renderCount}
        active={activeModal ? true : false}
        onClose={() => gameService.setActiveModal('')}
      >
        {activeModal === 'resourceRequest' && (
          <div className="select-resources">
            <SelectResources />
          </div>
        )}
        
        {activeModal === 'hand' && (
          <div className="player-hand">
            <Hand playerId={activePlayer} />
          </div>
        )}
        {activeModal === 'selectedCard' && (
          <div className="selected-card">
            <SelectedCard />
          </div>
        )}
        {activeModal === 'selectedTarget' && (
          <div className="selected-target">
            <SelectedTarget />
          </div>
        )}
        {activeModal === 'occupants' && (
          <OccupantList
            cardId={modalOptions.cardId}
            location={modalOptions.location}
          />
        )}
        {activeModal === 'discard' && (
          <DiscardList 
            playerId={modalOptions.playerId}
          />
        )}
      </CardModal>

    </div>
  );
}

export default App;
