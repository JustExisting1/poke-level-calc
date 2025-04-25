import { useEffect, useState } from "react";
import { FetchGrowthRate, pokemon } from "./util/PokiApiSearch";

function App() {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [grow, setGrow] = useState("");

  const handleSearch = async () => {
    console.log("Gaming");
    try {
      const res: pokemon = await FetchGrowthRate(search);
      setGrow(res.data.growth_rate.name);
      setName(res.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col w-full h-dvh bg-background text-foreground place-items-center">
      <div className="flex border bg-input w-fit h-fit">
        <input
          className="p-2"
          placeholder="Search Pokemon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
      <div>Search: {name}</div>
      <div>Growth-Rate: {grow}</div>
    </div>
  );
}

export default App;
