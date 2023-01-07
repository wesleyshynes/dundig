import gameService from "../../services/gameService";

export default function Deck(props: {
    playerId: string;
}) {
    const { playerId } = props;
    const playerDeck = gameService.players[playerId].deck;
    const { activePlayer } = gameService;

    const drawCard = () => {
        gameService.drawCard(playerId);
    }

    return (
        <div className="deck">
            deck: {playerDeck.length} <br />
            <button
                disabled={activePlayer !== playerId}
                onClick={drawCard}>
                draw
            </button>
        </div>
    )
}