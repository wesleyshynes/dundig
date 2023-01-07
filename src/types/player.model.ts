import { Ground } from "./ground.model";

export interface Player {
    id: string;
    name: string;
    deck: string[];
    hand: string[];
    entrance: Ground;
    dungeon: string[];
    garrison: Ground;
    discard: string[];
    resources: any;
}