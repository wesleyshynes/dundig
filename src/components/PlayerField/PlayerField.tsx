import gameService from "../../services/gameService";
import { Player } from "../../types/player.model";
import GameCard from "../GameCard/GameCard";
import './playerField.scss'

export default function PlayerField(props: {
    playerId: string;
}) {
    const { playerId } = props;

    const { activePlayer } = gameService;

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
                <button
                    disabled={activePlayer !== playerId}
                    onClick={drawCard}>
                    draw
                </button>
            </div>
            <div className="player-hand">
                hand: {hand.length}
                <div className="player-hand-cards">
                    {hand?.map((card, idx) => activePlayer === playerId ? (
                        <GameCard
                            key={idx}
                            cardId={card}
                            location={`players.${playerId}.hand`}
                        />
                    ) : (
                        <div key={idx} className="game-card">?</div>
                    ))}
                </div>
            </div>
            <div className="player-entrance">
                entrance: {entrance.occupants.length}
            </div>
            <div className="player-dungeon">
                dungeon: {dungeon.length}

                {gameService.canPlayCardHere(`players.${playerId}.dungeon`) && (
                    <button onClick={() => {
                        gameService.playCardHere(`players.${playerId}.dungeon`)
                    }}>
                        Play Here
                    </button>
                )}


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