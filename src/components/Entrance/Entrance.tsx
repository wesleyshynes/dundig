import { SMALL_TARGET_BUTTON, TARGET_BUTTON } from "../../common/buttonFunctions";
import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import SmallGameCard from "../SmallGameCard/SmallGameCard";
import "./entrance.scss";

export default function Entrance(props: {
    playerId: string,
}) {
    const { playerId } = props;
    const playerEntrance = gameService.players[playerId].entrance;
    const entranceLocation = `players.${playerId}.entrance`;

    const { selectedCard, activePlayer } = gameService;

    const playSentientInGround = (o: { cardId: string, location: string }) => {
        const {
            cardId,
            // location,
        } = o;
        gameService.playSentientInGround(playerId, selectedCard.id, selectedCard.location, cardId)
    }

    const entranceButtons = [SMALL_TARGET_BUTTON]

    const selectedCardIsInHand = selectedCard.location === `players.${playerId}.hand`;
    const selectedCardInfo = gameService.cardRef[selectedCard.id];

    if (selectedCardInfo && selectedCardInfo.type === 'sentient' && selectedCardIsInHand) {
        const canPayCost = gameService.canPayCost(activePlayer, selectedCardInfo.cost);
        const targetInfo = playerEntrance
        const splitTarget = entranceLocation.split('.');
        const targetLocation = splitTarget.pop();
        if (
            targetInfo &&
            canPayCost &&
            targetInfo.type === 'ground' &&
            targetLocation !== 'discard' &&
            targetInfo.owner === activePlayer
        ) {
            // TODO: add button to play at target
            entranceButtons.push({
                title: 'play here',
                label: '▶️',
                clickFn: playSentientInGround
            })
        }
    }

    return (
        <div className="entrance">
            entrance: {playerEntrance.occupants.length}
            {/* <GameCard
                    cardId={playerEntrance.id}
                    location={`players.${playerId}.entrance`}
                    buttons={[TARGET_BUTTON]}
                /> */}
            <SmallGameCard
                cardId={playerEntrance.id}
                location={`players.${playerId}.entrance`}
                buttons={entranceButtons}
            />
        </div>
    )
}