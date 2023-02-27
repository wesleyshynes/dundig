import { TARGET_BUTTON, UNTARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import { CardButtonEntry } from "../GameCard/GameCard";
import Occupant from "../Occupant/Occupant";
// import GameCard from "../GameCard/GameCard";
import './garrison.scss'

export default function Garrison(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerGarrison = gameService.players[playerId].garrison;

    const cardId = playerGarrison.id
    const { selectedCard, selectedTarget } = gameService;

    const location = `players.${playerId}.garrison`

    const cardInfo = gameService.cardRef[cardId];

    if (!cardInfo || cardInfo.type !== 'ground') {
        return (
            <div className="garrison">
                No card info
            </div>
        )
    }

    const isCardSelected = selectedCard.id === cardId;

    const isCardTargeted = selectedTarget.id === cardId;

    const buttons: CardButtonEntry[] = [TARGET_BUTTON]

    if (isCardTargeted) {
        buttons.push(UNTARGET_BUTTON)
    }

    return (
        <div className="garrison">

            <div className="card-info-section">
                <div className="area-title">
                    <h3>
                        {cardInfo.name} {isCardSelected ? '-- SELECTED --' : ''} {isCardTargeted ? '-- TARGETED --' : ''}
                    </h3>
                </div>
                <div className="area-image">
                    <img src={cardInfo.image} alt="" />
                </div>


                <div className="card-buttons">
                    {buttons.map((button, idx) => (
                        <button
                            key={idx}
                            disabled={button.disable}
                            onClick={() => button.clickFn({ cardId, location })}>
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="occupant-info-section">
                <div className="area-title">
                    <h3>Occupants</h3>
                </div>
                <div className="ground-occupants-list-wrapper">
                    {cardInfo.occupants.map((occupant, idx) => {
                        return (
                            <Occupant
                                key={idx}
                                occupantId={occupant}
                                occupantLocation={`cardRef.${cardId}.occupants`}
                                location={location}
                                locationId={cardId}
                            />
                        )
                    }
                    )}
                </div>
            </div>

            {/* <GameCard
                cardId={playerGarrison.id}
                location={`players.${playerId}.garrison`}
                buttons={[TARGET_BUTTON]}
            /> */}
        </div>
    )

}