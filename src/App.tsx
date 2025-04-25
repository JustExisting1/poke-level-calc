import { useState } from "react";
import { FetchGrowthRate, GrowRate, pokemon } from "./util/PokiApiSearch";
import CalculateExp from "./util/CalculateExp";

function App() {
  const [search, setSearch] = useState("");
  const [startLvl, setStartLvl] = useState<number>();
  const [targetLvl, setTargetLvl] = useState<number>();
  const [name, setName] = useState("");
  const [grow, setGrow] = useState<GrowRate>();
  const [exp, setExp] = useState<number>();
  const [cycleTime, setCycleTime] = useState<number>();

  const handleSearch = async (e: Event) => {
    e.preventDefault();

    if (search == "") return;
    try {
      const res: pokemon = await FetchGrowthRate(search);
      setGrow(res.growth_rate.name);
      setName(res.pokeName);

      const expNeeded = CalculateExp(startLvl, targetLvl, res.growth_rate.name);
      setExp(expNeeded);

      const minCycleTime = ~~(((expNeeded / 16) * 100) / 60) / 100;
      setCycleTime(minCycleTime);
    } catch (error) {
      console.error(error);
    }
  };

  function validateNumber(input, fn: (int: number) => void) {
    const value = Math.max(0, Math.min(100, input));
    fn(value);
  }

  return (
    <div className="flex flex-col w-full h-dvh bg-background text-foreground place-items-center">
      <form
        className="flex flex-col border bg-input w-fit h-fit place-items-center"
        onSubmit={handleSearch}>
        <label>Pokemon</label>
        <input
          className="p-2"
          placeholder="Search Pokemon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label>Starting Level</label>
        <input
          className="p-2"
          type="number"
          min={1}
          max={100}
          placeholder="Starting Level"
          value={startLvl}
          onChange={(e) => validateNumber(e.target.value, setStartLvl)}
        />
        <label>Target Level</label>
        <input
          className="p-2"
          type="number"
          min={1}
          max={100}
          placeholder="Target Level"
          value={targetLvl}
          onChange={(e) => validateNumber(e.target.value, setTargetLvl)}
        />
        <button type="submit">Calculate</button>
      </form>
      <div>Search: {name}</div>
      <div>Growth-Rate: {grow}</div>
      <div>Exp Needed: {exp}</div>
      <div>
        Cycle Time: {cycleTime}
        {cycleTime == undefined ? "" : "mins"}
      </div>
    </div>
  );
}

export default App;
