export interface Card {
    id: string;
    name: string;
    owner: string;
    level: number;
    type: 'ground' | 'sentient' | 'novelty';
}