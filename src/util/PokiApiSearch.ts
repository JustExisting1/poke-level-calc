import axios from "axios";
import { error } from "console";

export interface pokemonRaw {
  data: {
    growth_rate: {
      name: string;
      url: string;
    };
    name: string;
  };
}
/*
  api = wiki
  slow-then-very-fast = erratic
  fast = fast
  medium = medium fast 
  medium-slow = medium slow
  slow = slow
  slow-then-very-slow = Fluctuating
*/
export enum GrowRate {
  ERRATIC = "Erattic",
  FAST = "Fast",
  MEDIUM_FAST = "Medium Fast",
  MEDIUM_SLOW = "Medium Slow",
  SLOW = "Slow",
  FLUCTUATING = "Fluctuating",
}

export interface pokemon {
  growth_rate: {
    name: GrowRate;
  };
  pokeName: string;
}

const domain: string = "https://pokeapi.co/api/v2/pokemon-species/";

export async function FetchGrowthRate(pokemonName: string) {
  const result: pokemonRaw = (await axios.get(
    domain + pokemonName
  )) as pokemonRaw;

  let rateAsEnum;

  switch (result.data.growth_rate.name) {
    case "slow-then-very-fast": //erratic
      rateAsEnum = GrowRate.ERRATIC;
      break;
    case "fast": //fast
      rateAsEnum = GrowRate.FAST;

      break;
    case "medium": //medium fast
      rateAsEnum = GrowRate.MEDIUM_FAST;

      break;
    case "medium-slow": //medium slow
      rateAsEnum = GrowRate.MEDIUM_SLOW;

      break;
    case "slow": //slow
      rateAsEnum = GrowRate.SLOW;
      break;
    case "slow-then-very-slow": //Fluctuating
      rateAsEnum = GrowRate.FLUCTUATING;
      break;
    default:
      throw "Error finding growth rate";
  }

  const formattedResult: pokemon = {
    growth_rate: {
      name: rateAsEnum,
    },
    pokeName: result.data.name,
  };

  return formattedResult;
}
