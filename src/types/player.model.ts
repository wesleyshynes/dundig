import { Ground } from "./ground.model";

export interface Player {
    id: string;
    name: string;
    deck: string[];
    hand: string[];
    entrance: Ground;
    dungeon: Ground[];
    garrison: Ground;
    discard: string[];
    resources: any;
}