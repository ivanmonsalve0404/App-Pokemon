import { Pokemon } from '../types/pokemon';
import { Box, Card, CardMedia, CardContent, Typography } from '@mui/material';
import '../globals.css';
import Image from 'next/image';

interface PokemonGridProps {
    pokemonList: Pokemon[];
    onPokemonClick: (pokemon: Pokemon) => void;
}

const PokemonGrid: React.FC<PokemonGridProps> = ({ pokemonList, onPokemonClick }) => {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
            {pokemonList.map(pokemon => (
                <Card key={pokemon.id} onClick={() => onPokemonClick(pokemon)} sx={{ cursor: 'pointer' }} className='pokemon-card'>
                    <CardMedia>
                        <Image
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            width={96}
                            height={96}
                            style={{ objectFit: 'contain', height: '100%' }}
                        />
                    </CardMedia>
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                        <Typography className='id' variant="caption" color="text.secondary">#{pokemon.id}</Typography>
                        <Typography className='name' variant="body2">{pokemon.name}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default PokemonGrid;