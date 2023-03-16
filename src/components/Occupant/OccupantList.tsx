import gameService from "../../services/gameService";
import Occupant from "./Occupant"

export default function OccupantList(props: {
    cardId: string,
    location: string,
}) {
    const { 
        cardId,
        location,
    } = props;
    const cardInfo = gameService.cardRef[cardId];

    console.log('modal info', cardId, location)

    if (!cardInfo || cardInfo.type !== 'ground') {
        return (
            <div className="occupant-list">
                No card info
            </div>
        )
    }

    return (
        <div className="occupant-list">
            {cardInfo.occupants.map((occupant, idx) => {
                return (
                    <Occupant
                        key={idx}
                        occupantId={occupant}
                        occupantLocation={`cardRef.${cardId}.occupants`}
                        location={location}
                        locationId={cardId}
                    />
                )
            }
            )}
        </div>
    )
}