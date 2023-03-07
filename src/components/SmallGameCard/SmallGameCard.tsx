import { useState } from "react";
import gameService from "../../services/gameService";
import CardModal from "../CardModal/CardModal";
import { CardButtonEntry } from "../GameCard/GameCard";
import Occupant from "../Occupant/Occupant";
import './smallGameCard.scss'

export default function SmallGameCard(props: {
    cardId: string,
    location: string,
    buttons: CardButtonEntry[]
}) {

    const [showOccupants, setShowOccupants] = useState(false);

    const { selectedCard } = gameService;

    const { cardId, location } = props;
    const cardInfo = gameService.cardRef[cardId];

    if (!cardInfo) {
        return (
            <div className="game-card">
                No card info
            </div>
        )
    }

    const isCardSelected = selectedCard.id === cardId;

    return (
        <div className="small-game-card">
            <div className="top-info">
                <div className="card-level flex-center">
                    {cardInfo.level}
                </div>
                <div className="card-name">
                    {cardInfo.name}
                </div>
            </div>
            <div className="img-wrapper-container">
                <div className="img-wrapper">
                    <img src={`${cardInfo.image}`} alt={cardInfo.name} /> <br />
                </div>
            </div>

            {cardInfo.type === 'sentient' && (
                <div className="sentient-stats flex-center">
                    <div className="attack-stat">
                        {cardInfo.attack}⚔️
                    </div>
                    <div className="health-stat">
                        {cardInfo.health}🛡️
                    </div>
                    <div className="speed-stat">
                        {cardInfo.speed}👟
                    </div>
                    {/* {cardInfo.attack}⚔️ {cardInfo.health}🛡️ {cardInfo.speed}👟 <br /> */}
                </div>
            )}


            <div className="card-buttons">
                {props.buttons.map((button, idx) => (
                    <button
                        key={idx}
                        disabled={button.disable}
                        onClick={() => button.clickFn({ cardId, location })}>
                        {button.label}
                    </button>
                ))}
            </div>
            {cardInfo.type === 'ground' && cardInfo.occupants.length > 0 && (
                <div className="ground-occupant">

                    <div className="occupant-display flex-center">
                        {/* {cardInfo.occupants.length} occupants */}

                        <div className="occupant-count flex-center">
                            {cardInfo.occupants.map((o => {
                                return (
                                    '👤'
                                )
                            }))}
                        </div>

                        <button onClick={() => setShowOccupants(true)}>
                            🔎
                        </button>

                    </div>


                    <CardModal
                        active={showOccupants}
                        onClose={() => setShowOccupants(false)}
                    >
                        <div className="occupant-list">
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

                    </CardModal>
                </div>
            )}


        </div>
    )
}