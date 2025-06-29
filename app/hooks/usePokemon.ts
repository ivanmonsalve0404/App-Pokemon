'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pokemon, PokemonListItem } from '../types/pokemon'; // Adjust the import path as necessary

const usePokemon = () => {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
                const results: PokemonListItem[] = response.data.results;

                const detailedPokemon = await Promise.all(
                    results.map(async (item) => {
                        const detailResponse = await axios.get(item.url);
                        return detailResponse.data as Pokemon;
                    })
                );

                setPokemonList(detailedPokemon);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch Pokémon data');
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

    return { pokemonList, loading, error };
};

export default usePokemon;