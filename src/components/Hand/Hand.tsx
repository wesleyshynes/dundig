import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import './hand.scss'

export default function Hand(props: {
    playerId: string;
}) {

    const { playerId } = props;
    const  { activePlayer } = gameService;
    const hand = gameService.players[playerId].hand;

    return (
        <div className="hand">
            hand: {hand.length}
            <div className="player-hand-cards">
                {hand?.map((card, idx) => activePlayer === playerId ? (
                    <GameCard
                        key={idx}
                        cardId={card}
                        location={`players.${playerId}.hand`}
                        buttons={[
                            {
                                clickFn: (cId, loc) => gameService.selectCard(cId, loc),
                                label: 'Select Card'
                            }
                        ]}
                    />
                ) : (
                    <div key={idx} className="game-card">?</div>
                ))}
            </div>
        </div>
    )
}