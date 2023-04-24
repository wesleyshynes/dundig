import gameService from "../../services/gameService";

export default function SelectResources() {

    const {
        resourceRequest,
        selectedResources,
        activePlayer,
        players
    } = gameService;

    const {
        selected
    } = selectedResources;

    const {
        cardId,
        cost,
        targetLocation
    } = resourceRequest;

    const cardInfo = gameService.cardRef[cardId];

    if (!cardId) {
        return (
            <div className="select-resources">
                No card selected
            </div>
        )
    }

    const {
        owner,
    } = cardInfo;

    const handleSelection = (cId: string, locationRef: string[]) => {
        if (selected && selected[cId]) {
            gameService.deselectResource(cId, locationRef);
            return;
        }

        // const handCardsSelected = selectedResources?.cost?.hand ? Object.keys(selectedResources.cost.hand).length : 0;
        // console.log(handCardsSelected)
        // console.log(selectedResources)
        if (locationRef[1] === 'hand') {
            console.log(cost.hand)
            // if (handCardsSelected === cost.hand && locationRef[1] === 'hand') {
            gameService.selectResource(cId, locationRef, {
                quantity: cost.hand,
            });
            return;
        }

        gameService.selectResource(cId, locationRef);
    }

    return (
        <div className="select-resources">
            <h2>Select resources for {cardId}</h2>
            {cost.hand && cost.hand > 0 && owner === activePlayer && (
                <>
                    <h3>Hand</h3>
                    {players[activePlayer].hand.filter((cId: string) => cardId !== cId).map((cId: string) => (
                        <div
                            onClick={() => handleSelection(cId, ['cost', 'hand'])}
                            className="resource-card"
                            key={cId}>
                            {cId} {selected && selected[cId] && (
                                <>Selected</>
                            )}
                        </div>
                    ))}
                </>
            )}
            {cost.ground > 0 && owner === activePlayer && (
                <>
                    <h3>Ground</h3>
                    {players[activePlayer].dungeon.slice(-(cost.ground)).map((cId: string) => (
                        <div
                            onClick={() => handleSelection(cId, ['cost', 'ground'])}
                            className="resource-card" key={cId}>
                            {cId} {selected && selected[cId] && (
                                <>Selected</>
                            )}
                        </div>
                    ))}
                </>
            )}

            {targetLocation && owner === activePlayer && (
                <>
                    <h3>Target Location</h3>
                    {targetLocation.options.map((cId: string) => (
                        <div
                            onClick={() => handleSelection(cId, ['targetLocation'])}
                            className="resource-card" key={cId}>
                            {cId} {selected && selected[cId] && (
                                <>Selected</>
                            )}
                        </div>
                    ))}
                </>
            )}



        </div>
    )
}