import { Card } from "./card.model";


export interface Sentient extends Card {
    cost: any;
    health: number;
    attack: number;
    speed: number;
}