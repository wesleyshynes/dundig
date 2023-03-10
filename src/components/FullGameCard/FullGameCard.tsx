import groundEffectService from "../../services/cardEffects/groundEffectService";
import noveltyEffectService from "../../services/cardEffects/noveltyEffectService";
import gameService from "../../services/gameService";
import { CardButtonEntry } from "../GameCard/GameCard";
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
            effectText = effectDetails.description;
        }
    }
    if(type === 'ground' && cardInfo.effectId !== null) {
        const effectDetails = groundEffectService.getEffectDetails(cardInfo.effectId);
        if (effectDetails) {
            effectText = effectDetails.description;
        }
    }


    const isCardSelected = selectedCard.id === cardId;

    return (
        <div className="full-game-card">
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
    )
}