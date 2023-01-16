import gameService from "../../services/gameService";
import { Ground } from "../../types/ground.model";
import GameCard from "../GameCard/GameCard";
import './commonGround.scss'

export default function CommonGround(props: {}) {

   const commonGround: Ground = gameService.commonGround;

    return (
        <div className="common-ground">
            common ground occupants: {commonGround.occupants.length}
            <GameCard
                cardId={commonGround.id}
                location={`commonGround`}
                buttons={[]}
            />
        </div>
    )
}