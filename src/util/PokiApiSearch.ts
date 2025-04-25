import axios from "axios";

export interface pokemon {
  data: {
    growth_rate: {
      name: string;
      url: string;
    };
    name: string;
  };
}

const domain: string = "https://pokeapi.co/api/v2/pokemon-species/";

export async function FetchGrowthRate(pokemonName: string) {
  const result: pokemon = (await axios.get(domain + pokemonName)) as pokemon;

  return result;
}
