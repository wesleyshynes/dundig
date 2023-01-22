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
                disabled={activePlayer !== playerId}
                onClick={drawCard}>
                draw
            </button>
            <button
                disabled={activePlayer !== playerId || playerTurn !== activePlayer }
                onClick={endTurn}>
                draw and end turn
            </button>
        </div>
    )
}