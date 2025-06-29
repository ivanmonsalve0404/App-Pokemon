export interface PokemonListItem {
    name: string;
    url: string;
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: { slot: number; type: { name: string; url: string } }[];
    stats: { base_stat: number; effort: number; stat: { name: string; url: string } }[];
    sprites: { front_default: string };
    base_experience: number;
}