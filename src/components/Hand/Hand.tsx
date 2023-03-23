import { SELECT_CARD_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import GameCard, { CardButtonEntry } from "../GameCard/GameCard";
import './hand.scss'

export default function Hand(props: {
    playerId: string;
}) {

    const { playerId } = props;
    const { activePlayer, thisTurn: { groundPlayed } } = gameService;
    const hand = gameService.players[playerId].hand;

    const myHand = activePlayer === playerId;

    const payHandCard = (o: { cardId: string, location: string }) => {
        const { cardId, location } = o;
        gameService.payHandCard(activePlayer, cardId, location);
    }

    const playGroundCard = (o: { cardId: string, location: string }) => {
        const { cardId, location } = o;
        gameService.setGroundPlayedThisTurn()
        gameService.moveCardToLocation(cardId, location, `players.${playerId}.dungeon`)
    }

    return (
        <div className="hand">
            hand: {hand.length}
            <div className="player-hand-cards">
                {hand?.map((cardId, idx) => {
                    const cardInfo = gameService.cardRef[cardId];
                    const cardButtons: CardButtonEntry[] = [
                        SELECT_CARD_BUTTON,
                        {
                            clickFn: payHandCard,
                            label: 'pay hand',
                            title: 'pay hand',
                        }
                    ]
                    if (cardInfo.type === 'ground') {
                        cardButtons.push({
                            clickFn: playGroundCard,
                            label: 'play ground',
                            title: 'play ground',
                            disable: groundPlayed || gameService.players[playerId].dungeon.length === 7  || cardInfo.level > gameService.players[playerId].dungeon.length + 1
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