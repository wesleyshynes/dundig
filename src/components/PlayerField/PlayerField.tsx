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

            <div className="player-info">
                <PlayerInfo playerId={playerId} />
            </div>

            <div className="player-deck">
                <Deck playerId={playerId} />
            </div>

            <div className="player-hand">
                <Hand playerId={playerId} />
            </div>

            <div className="player-entrance">
                <Entrance playerId={playerId} />
            </div>

            <div className="player-dungeon">
                <Dungeon playerId={playerId} />
            </div>

            <div className="player-garrison">
                <Garrison playerId={playerId} />
            </div>

            <div className="player-discard">
                <Discard playerId={playerId} />
            </div>
        </div>

    )

}