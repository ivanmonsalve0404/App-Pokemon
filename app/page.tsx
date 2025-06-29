'use client';

import { useState } from 'react';
import usePokemon from '../app/hooks/usePokemon';
import { Pokemon } from './types/pokemon';
import { Container, Button, Box, CircularProgress, Typography, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PokemonGrid from '../app/components/PokemonGrid';
import PokemonModal from './components/PokemonModal';
import '../app/globals.css'; // Import global styles

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { pokemonList, loading, error } = usePokemon();
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

  const filteredPokemon = pokemonList.filter(pokemon => {
    const pokemonTypes = pokemon.types.map(t => t.type.name);

    const matchesType =
      typeFilter.length === 0 ||
      typeFilter.some(filterType => pokemonTypes.includes(filterType));

    const matchesName =
      searchQuery.trim() === '' ||
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesName;
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', headerAlign: 'center', align: 'center', width: 60, sortable: true },
    {
      field: 'sprite',
      headerName: 'Image',
      headerAlign: 'center',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <img src={params.value} alt={params.row.name} style={{ width: 50 }} />
      ),
      align: 'center',
    },
    { field: 'name', headerName: 'Name', headerAlign: 'center', align: 'center', width: 110, sortComparator: (a, b) => a.localeCompare(b) },
    { field: 'types', headerName: 'Type', headerAlign: 'center', align: 'center', width: 110, sortComparator: (a, b) => a[0].localeCompare(b[0]) },
    { field: 'weight', headerName: 'Weight (kg)', headerAlign: 'center', width: 100, type: 'number' },
    { field: 'height', headerName: 'Height (m)', headerAlign: 'center', width: 100, type: 'number' },
    { field: 'hp', headerName: 'HP', headerAlign: 'center', width: 100, type: 'number' },
    { field: 'base_experience', headerName: 'Base Exp', headerAlign: 'center', width: 100, type: 'number' },
    { field: 'attack', headerName: 'Attack', headerAlign: 'center', width: 100, type: 'number' },
    { field: 'defense', headerName: 'Defense', headerAlign: 'center', width: 100, type: 'number' },
    { field: 'special_attack', headerName: 'Sp. Attack', headerAlign: 'center', width: 100, type: 'number' },
    { field: 'special_defense', headerName: 'Sp. Defense', headerAlign: 'center', width: 100, type: 'number' },
    { field: 'speed', headerName: 'Speed', headerAlign: 'center', width: 100, type: 'number' },
    {
      field: 'details',
      headerName: 'Details',
      headerAlign: 'center',
      width: 140,
      align: 'center',
      sortable: false,
      renderCell: (params) => {
        const pokemon = pokemonList.find(p => p.id === params.row.id);
        return (
          <Button
            variant="outlined"
            onClick={() => pokemon && setSelectedPokemon(pokemon)}
          >
            View
          </Button>
        );
      }
    }
  ];

  const rows = filteredPokemon.map(pokemon => ({
    id: pokemon.id,
    sprite: pokemon.sprites.front_default,
    name: pokemon.name,
    types: pokemon.types.map(t => t.type.name),
    weight: pokemon.weight / 10,
    height: pokemon.height / 10,
    hp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
    base_experience: pokemon.base_experience,
    attack: pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
    defense: pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
    special_attack: pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
    special_defense: pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
    speed: pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
  }));

  const uniqueTypes = Array.from(new Set(
    pokemonList.flatMap(p => p.types.map(t => t.type.name))
  )).sort();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ animation: 'fadeIn 0.5s ease' }}>
        Pokémon Explorer
      </Typography>

      {/* Barra de búsqueda y filtros */}
      <Box className="search-container" sx={{ animation: 'fadeIn 0.5s ease' }}>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <Autocomplete
          multiple
          options={uniqueTypes}
          value={typeFilter}
          onChange={(_, newValue) => setTypeFilter(newValue)}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField {...params} label="Filtrar por tipo" placeholder="Tipos" />
          )}
          className="type-filter"
        />

        <button
          className="view-toggle-button button-icon"
          onClick={() => setView(view === 'table' ? 'grid' : 'table')}
        >
          {view === 'table' ? '🔲 VER EN GRID' : '📋 VER EN LISTA'}
        </button>
      </Box>


      {view === 'table' ? (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={{ pageSize, page }}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sortingOrder={['asc', 'desc']}
          />
        </Box>
      ) : (
        <PokemonGrid
          pokemonList={filteredPokemon}
          onPokemonClick={setSelectedPokemon}
        />
      )}

      <PokemonModal
        open={!!selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        pokemon={selectedPokemon}
      />
    </Container>
  );

};

export default Home;