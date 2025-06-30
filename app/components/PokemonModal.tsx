import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';
import { Pokemon } from '../types/pokemon';
import '../globals.css';
import Image from 'next/image';

interface PokemonModalProps {
    open: boolean;
    onClose: () => void;
    pokemon: Pokemon | null;
}

const getStatColor = (value: number) => {
    if (value >= 100) return '#4caf50'; // Verde para valores altos
    if (value <= 40) return '#f44336';  // Rojo para valores bajos
    return '#2196f3';                  // Azul para valores intermedios
};

const PokemonModal: React.FC<PokemonModalProps> = ({ open, onClose, pokemon }) => {
    if (!pokemon) return null;

    const primaryType = pokemon.types[0].type.name;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="modal-title" sx={{ position: 'relative', pr: 5 }}>
                {pokemon.name} (#{pokemon.id})
                <button
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    &times;
                </button>
            </DialogTitle>
            <DialogContent className={`modal-content type-${primaryType}`}>
                <Box className="modal-body">
                    <Image
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        width={96}
                        height={96}
                    />
                    <Typography>
                        Type:{" "}
                        {pokemon.types.map(t => (
                            <span key={t.type.name} className={`type-badge type-${t.type.name}`}>
                                {t.type.name}
                            </span>
                        ))}
                    </Typography>
                    <Typography>Height: {pokemon.height / 10} m</Typography>
                    <Typography>Weight: {pokemon.weight / 10} kg</Typography>
                    <Box className="modal-stats">
                        {pokemon.stats.map(stat => (
                            <Box key={stat.stat.name} className="stat">
                                <Typography className="stat-name">{stat.stat.name.replace('-', ' ')}:</Typography>
                                <Box className="stat-bar">
                                    <Box
                                        className="stat-bar-fill"
                                        style={{
                                            width: `${(stat.base_stat / 255) * 100}%`,
                                            backgroundColor: getStatColor(stat.base_stat),
                                            ["--bar-width" as string]: `${(stat.base_stat / 255) * 100}%`
                                        }}
                                    />
                                </Box>
                                <Typography className="stat-value">{stat.base_stat}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>

    );
};

export default PokemonModal;