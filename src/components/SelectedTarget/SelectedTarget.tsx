import gameService from "../../services/gameService";
import GameCard from "../GameCard/GameCard";
import './selectedTarget.scss'

export default function SelectedTarget() {
    const { selectedTarget } = gameService;
    const { id, location } = selectedTarget

    if (!id) {
        return (
            <div className="selected-target">
                No target selected
            </div>
        )
    }

    return (
        <div className="selected-target">
            SELECTED TARGET: <br />
            <GameCard
                cardId={id}
                location={location}
                buttons={[
                    {
                        label: 'deselect',
                        clickFn: () => { gameService.deselectTarget() }
                    }
                ]}
            />
        </div>
    )

}