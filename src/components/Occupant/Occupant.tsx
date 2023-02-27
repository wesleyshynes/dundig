import gameService from "../../services/gameService";
// import { Sentient } from "../../types/sentient.model";
import './occupant.scss'
import { generateOccupantButtons } from "./occupantButtons";

export default function Occupant(props: {
    occupantId: string,
    occupantLocation: string,
    location: string
    locationId: string

}) {
    const { occupantId, occupantLocation, location, locationId } = props;

    const occupantInfo = gameService.cardRef[occupantId];

    if (!occupantInfo || occupantInfo.type !== 'sentient') {
        return (
            <div className="occupant">
                No occupant info
            </div>
        )
    }

    const { attack, health, speed } = occupantInfo

    const buttons = generateOccupantButtons({
        occupantInfo,
        occupantId,
        occupantLocation,
        location,
        locationId
    })

    return (
        <div className="occupant">
            {occupantId} <br />
            <img src={`${occupantInfo.image}`} /> <br />
            A:{attack}  / H:{health} / S:{speed} <br />
            {buttons.map((btn, jdx) => (
                <button
                    key={jdx}
                    disabled={btn.disabled}
                    onClick={() => btn.clickFn()}>
                    {btn.label}
                </button>
            ))}
        </div>
    )
}