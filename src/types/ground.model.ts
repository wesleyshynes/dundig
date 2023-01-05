import { Card } from "./card.model";

export interface Ground extends Card {
    occupants: string[];
    connections: string[];
}
