import gameService from "../../services/gameService";
import { Ground } from "../../types/ground.model";
import './commonGround.scss'

export default function CommonGround(props: {}) {

   const commonGround: Ground = gameService.commonGroud;

    return (
        <div className="common-ground">
            common ground occupants: {commonGround.occupants.length}
        </div>
    )
}