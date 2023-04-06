import { Ground } from "./ground.model";

export interface Player {
    id: string;
    order: number;
    name: string;
    deck: string[];
    hand: string[];
    discard: string[];
    dungeon: string[];
    entrance: Ground;
    garrison: Ground;
    resources: any;
}