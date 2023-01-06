import gameService from "../../services/gameService";
import { Player } from "../../types/player.model";
import GameCard from "../GameCard/GameCard";
import './playerField.scss'

export default function PlayerField(props: {
    playerId: string;
}) {
    const { playerId } = props;

    const playerInfo: Player = gameService.players[playerId];

    const {
        deck,
        hand,
        name,
        entrance,
        dungeon,
        garrison,
        discard
    } = playerInfo;

    const drawCard = () => {
        gameService.drawCard(playerId);
    }

    return (
        <div className="player-field">
            player field: {playerId} <br />
            name: {name} <br />
            <div className="player-deck">
                deck: {deck.length}
                <button onClick={drawCard}>draw</button>
            </div>
            <div className="player-hand">
                hand: {hand.length}
                <div className="player-hand-cards">
                    {hand?.map((card, idx) => (
                        <GameCard key={idx} cardId={card} />
                    ))}
                </div>
            </div>
            <div className="player-entrance">
                entrance: {entrance.occupants.length}
            </div>
            <div className="player-dungeon">
                dungeon: {dungeon.length}
            </div>
            <div className="player-garrison">
                garrison: {garrison.occupants.length}
            </div>
            <div className="player-discard">
                discard: {discard.length}
            </div>
        </div>

    )

}