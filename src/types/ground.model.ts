import { Card } from "./card.model";

export interface Ground extends Card {
    type: 'ground';
    occupants: string[];
    connections: string[];
    effectType: 'once' | 'continuous' | 'onEnter';
    effectId: string;
    effectArgs: any;
    effectedSentients: string[]
}
