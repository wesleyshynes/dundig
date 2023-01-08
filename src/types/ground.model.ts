import { Card } from "./card.model";

export interface Ground extends Card {
    type: 'ground';
    occupants: string[];
    connections: string[];
}
