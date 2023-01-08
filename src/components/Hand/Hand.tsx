import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import './hand.scss'

export default function Hand(props: {
    playerId: string;
}) {

    const { playerId } = props;
    const { activePlayer } = gameService;
    const hand = gameService.players[playerId].hand;

    const myHand = activePlayer === playerId;

    const selectCardFunction = (cardId: string, location: string) => {
        gameService.selectCard(cardId, location);
    }

    const payHandCard = (cardId: string, location: string) => {
        gameService.payHandCard(activePlayer, cardId, location);
    }

    return (
        <div className="hand">
            hand: {hand.length}
            <div className="player-hand-cards">
                {hand?.map((card, idx) => myHand ? (
                    <GameCard
                        key={idx}
                        cardId={card}
                        location={`players.${playerId}.hand`}
                        buttons={[
                            {
                                clickFn: selectCardFunction,
                                label: 'Select'
                            },
                            {
                                clickFn: payHandCard,
                                label: 'Pay Hand'
                            }
                        ]}
                    />
                ) : (
                    <div key={idx} className="game-card">?</div>
                )
                )}
            </div>
        </div>
    )
}