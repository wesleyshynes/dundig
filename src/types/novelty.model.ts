import { Card } from "./card.model";

export interface Novelty extends Card {
    type: 'novelty';
    cost: any;
    effectType: 'once' | 'continuous';
    effectId: string;
    effectArgs: any;
}