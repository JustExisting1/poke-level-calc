import * as fs from "fs";

const path = "./src/data/";

const url = "https://pokeapi.co/api/v2/pokemon-species/?limit=1025";

const max = 1025;

type poke = {
  results: {
    name: string;
  }[];
};

async function fetchApiData() {
  try {
    const res = await fetch(url);
    const data = (await res.json()) as poke;
    const pokeList: string[] = [];
    data.results.forEach((pName) => {
      pokeList.push(pName.name);
    });
    const asJson = JSON.stringify(pokeList);
    fs.writeFileSync(path + "PokemonList.json", asJson);
  } catch (error) {
    console.log(error);
  }
}

fetchApiData();
