import groundEffectService from "../../services/cardEffects/groundEffectService";
import noveltyEffectService from "../../services/cardEffects/noveltyEffectService";
import gameService from "../../services/gameService";
import { CardButtonEntry } from "../GameCard/GameCard";
import Occupant from "../Occupant/Occupant";
import './fullGameCard.scss'

export default function FullGameCard(props: {
    cardId: string,
    location: string,
    buttons: CardButtonEntry[]
}) {

    const { selectedCard } = gameService;

    const { cardId, location } = props;
    const cardInfo = gameService.cardRef[cardId];

    if (!cardInfo) {
        return (
            <div className="full-game-card">
                No card info
            </div>
        )
    }


    const {
        level,
        name,
        type,
        image,
        setId,
        category,
    } = cardInfo

    const costArray: string[] = [];
    if (type !== 'ground') {
        for (let i = 0; i < cardInfo.cost.hand; i++) {
            costArray.push('✋')
        }
        for (let i = 0; i < cardInfo.cost.ground; i++) {
            costArray.push('🖼️')
        }
    }

    let effectText: any = '';
    if (type === 'novelty') {
        const effectDetails = noveltyEffectService.getEffectDetails(cardInfo.effectId);
        if (effectDetails) {
            effectText = effectDetails.description(cardInfo.effectArgs);
        }
    }
    if (type === 'ground' && cardInfo.effectId !== null) {
        const effectDetails = groundEffectService.getEffectDetails(cardInfo.effectId);
        if (effectDetails) {
            effectText = effectDetails.description(cardInfo.effectArgs);
        }
    }


    const isCardSelected = selectedCard.id === cardId;

    return (
        <div className="full-card-container">
            <div className="full-card-buttons">
                {props.buttons.map((button, idx) => (
                    <button
                        title={button.label}
                        key={idx}
                        disabled={button.disable}
                        onClick={() => button.clickFn({ cardId, location })}>
                        {button.label}
                    </button>
                ))}
            </div>
            <div className={`full-game-card full-${type}`}>
                <div className="full-card-contents">
                    <div className="card-info">
                        <div className="level-box">
                            <div className="level-word">LEVEL</div>
                            <div className="level-number">{level}</div>
                        </div>

                        <div className="card-name-box">
                            <div className="card-name">{name}</div>
                            <div className="card-type-cost">
                                <div className="card-type">
                                    {category}-{type}
                                </div>

                                <div className="card-cost">
                                    {costArray.map((c, i) => <span key={i}>{c}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-image">
                        <div className="img-wrapper-container">
                            <div className="img-wrapper">
                                <img src={image} /> <br />
                            </div>
                        </div>
                    </div>
                    <div className="card-details">
                        <div className="effect-rarity">
                            <div className="effect-title">Effect:</div>
                            <div className="rarity">R</div>
                        </div>
                        <div className="effect-text">
                            {effectText}
                        </div>
                        <div className="flavor-text">
                            Flavor text  goes here to spice things up.
                        </div>

                        {type === 'sentient' && (
                            <div className="card-stats flex-center">
                                <div className="attack-stat">
                                    {cardInfo.attack}⚔️
                                </div>
                                <div className="health-stat">
                                    {cardInfo.health}🛡️
                                </div>
                                <div className="speed-stat">
                                    {cardInfo.speed}👟
                                </div>
                            </div>
                        )}

                    </div>
                    <div className="card-id">
                        ID: {setId}
                    </div>

                </div>
            </div>
            {cardInfo.type === 'ground' && cardInfo.occupants.length > 0 && (
                <div className="ground-occupants">
                    OCCUPANTS: <br />
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
                    <br />
                </div>
            )}
        </div>
    )
}