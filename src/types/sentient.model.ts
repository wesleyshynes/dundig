import { Card } from "./card.model";


export interface Sentient extends Card {
    type: 'sentient';
    cost: any;
    health: number;
    attack: number;
    speed: number;
}