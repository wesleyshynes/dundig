import gameService from "../../services/gameService";

export default function Deck(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerDeck = gameService.players[playerId].deck;
    const { activePlayer, playerTurn } = gameService;

    const drawCard = () => {
        gameService.drawCard({ playerId });
    }

    const endTurn = () => {
        gameService.endTurn();
    }

    return (
        <div className="deck">
            deck: {playerDeck.length} <br />
            <button
                title="draw a card"
                disabled={activePlayer !== playerId}
                onClick={drawCard}>
                draw
            </button>
            <button
                title="end turn"
                disabled={activePlayer !== playerId || playerTurn !== activePlayer }
                onClick={endTurn}>
                draw and end turn
            </button>
        </div>
    )
}