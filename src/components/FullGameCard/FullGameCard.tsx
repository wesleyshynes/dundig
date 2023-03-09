import { CardButtonEntry } from "../GameCard/GameCard";
import './fullGameCard.scss'

export default function FullGameCard(props: {
    cardId: string,
    location: string,
    buttons: CardButtonEntry[]
}) {
    return (
        <div className="full-game-card">
            <div className="full-card-contents">
                <div className="card-info">
                    <div className="level-box">
                        <div className="level-word">LEVEL</div>
                        <div className="level-number">7</div>
                    </div>

                    <div className="card-name-box">
                        <div className="card-name">Skip Master Nate</div>
                        <div className="card-type-cost">
                            <div className="card-type">
                                Normie-Sentient
                            </div>
                            <div className="card-cost">
                                {/* hand emoji */}
                                ✋✋🖼️🖼️
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-image">
                    <div className="img-wrapper-container">
                        <div className="img-wrapper">
                            <img src={`https://picsum.photos/300/200?random=34928739487`} /> <br />
                        </div>
                    </div>
                </div>
                <div className="card-details">
                    <div className="effect-rarity">
                        <div className="effect-title">Effect:</div>
                        <div className="rarity">R</div>
                    </div>
                    <div className="effect-text">
                        Nothing interesting here.
                    </div>
                    <div className="flavor-text">
                        If you are curious about the significance of his hairstyle; it makes him more aerodynamic when he fights.
                    </div>
                    <div className="card-stats flex-center">
                        <div className="attack-stat">
                            7⚔️
                        </div>
                        <div className="health-stat">
                            7🛡️
                        </div>
                        <div className="speed-stat">
                            7👟
                        </div>
                    </div>
                </div>
                <div className="card-id">
                    ID: 123456789
                </div>

            </div>
        </div>
    )
}