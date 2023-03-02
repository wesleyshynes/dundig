import Deck from "../Deck/Deck";
import Discard from "../Discard/Discard";
import Dungeon from "../Dungeon/Dungeon";
import Entrance from "../Entrance/Entrance";
import Garrison from "../Garrison/Garrison";
import Hand from "../Hand/Hand";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import './playerField.scss'

export default function PlayerField(props: {
    playerId: string;
}) {
    const { playerId } = props;

    return (
        <div className="player-field">


            <div className="split-card-slider-section flex-center">
                <div className="inner-wrapper hold-wrapper flex-center">
                    <div className="tiny-card">
                        <Discard playerId={playerId} />
                    </div>
                </div>
                <div className="inner-wrapper card-slide-wrapper flex-center">
                    <PlayerInfo playerId={playerId} />
                    <Garrison playerId={playerId} />
                </div>
            </div>

            <div className="split-card-slider-section flex-center">
                <div className="inner-wrapper hold-wrapper flex-center">
                    <div className="tiny-card">
                        <Deck playerId={playerId} />
                    </div>
                </div>
                <div className="inner-wrapper card-slide-wrapper flex-center">
                    <Entrance playerId={playerId} />
                    <Dungeon playerId={playerId} />
                </div>
            </div>

            <div className="player-info">

            </div>

            <div className="player-hand">
                <Hand playerId={playerId} />
            </div>


        </div>
    )

}