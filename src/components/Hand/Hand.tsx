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

    const playGroundCard = (cardId: string, location: string) => {
        gameService.selectCard(cardId, location);
        gameService.playCardHere(`players.${playerId}.dungeon`);
    }

    return (
        <div className="hand">
            hand: {hand.length}
            <div className="player-hand-cards">
                {hand?.map((cardId, idx) => {
                    const cardInfo = gameService.cardRef[cardId];
                    const cardButtons = [
                        {
                            clickFn: selectCardFunction,
                            label: 'Select'
                        },
                        {
                            clickFn: payHandCard,
                            label: 'Pay Hand'
                        }
                    ]
                    if(cardInfo.type === 'ground') {
                        cardButtons.push({
                            clickFn: playGroundCard,
                            label: 'Play Ground'
                        })
                    }
                    return myHand ? (
                        <GameCard
                            key={idx}
                            cardId={cardId}
                            location={`players.${playerId}.hand`}
                            buttons={cardButtons}
                        />
                    ) : (
                        <div key={idx} className="game-card">?</div>
                    )

                }
                )}
            </div>
        </div>
    )
}