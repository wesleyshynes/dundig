import { Card } from "./card.model";


export interface Sentient extends Card {
    type: 'sentient';
    cost: any;
    health: number;
    attack: number;
    speed: number;
    originalStats: {
        health: number;
        attack: number;
        speed: number;
    }
    modifiers: {
        health: number;
        attack: number;
        speed: number;
    }
    novelties: string[];
}