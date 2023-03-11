export interface Card {
    id: string;
    setId: string;
    name: string;
    owner: string;
    level: number;
    type: 'ground' | 'sentient' | 'novelty';
    category: string;
    image: string;
}