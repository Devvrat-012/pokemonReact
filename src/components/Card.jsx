import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokeCard = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
        const pokemonArray = response.data.results;

        const pokemonDetails = await Promise.all(
          pokemonArray.map(async (poke) => {
            const pokeDetails = await axios.get(poke.url);
            return pokeDetails.data;
          })
        );

        setPokemonData(pokemonDetails);
        setFilteredData(pokemonDetails);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredData(pokemonData);
    } else {
      setFilteredData(
        pokemonData.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, pokemonData]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">My Pokémons</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="block w-full p-2 mb-6 border bg-gray-900 border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.map((pokemon) => (
          <div key={pokemon.id} className=" bg-gray-900 shadow-md rounded-lg p-4 text-center">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">{pokemon.name}</h2>
            <p className="text-sm">
              Type: {pokemon.types.map((type) => type.type.name).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokeCard;
