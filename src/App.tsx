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
      setGrow(undefined);
      setName("Not found");
      setExp(0);
      setCycleTime(undefined);

      console.error(error);
    }
  };

  function validateNumber(input, fn: (int: number) => void) {
    const value = Math.max(0, Math.min(100, input));
    fn(value);
  }

  return (
    <div className="flex flex-col w-4/5 md:w-1/3 h-dvh bg-background text-foreground place-self-center p-2">
      <form
        className="flex flex-col w-full h-fit place-items-center gap-2 bg-card p-2 rounded-xl text-xl"
        onSubmit={handleSearch}>
        <label>Pokemon</label>
        <input
          className="p-2 text-center w-full bg-input rounded-md"
          placeholder="Search Pokemon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label>Starting Level</label>
        <input
          className="p-2 text-center w-1/2 bg-input rounded-md"
          type="number"
          min={1}
          max={100}
          placeholder="0"
          value={startLvl}
          onChange={(e) => validateNumber(e.target.value, setStartLvl)}
        />
        <label>Target Level</label>
        <input
          className="p-2 text-center w-1/2 bg-input rounded-md"
          type="number"
          min={1}
          max={100}
          placeholder="0"
          value={targetLvl}
          onChange={(e) => validateNumber(e.target.value, setTargetLvl)}
        />
        <button
          className=" bg-primary w-fit py-2 px-4 rounded-md"
          type="submit">
          Calculate
        </button>
      </form>
      <div className="grid grid-cols-2 place-items-start w-full text-lg bg-muted rounded-xl p-2 gap-2 ">
        {/* Results */}
        <div className="w-full border-e-2 border-primary">Pokemon</div>
        <div className="">{name}</div>
        <div className="w-full border-e-2 border-primary">Growth-Rate</div>
        <div className="">{grow}</div>
        <div className="w-full border-e-2 border-primary">Exp Needed</div>
        <div className="">{exp}</div>
        <div className="w-full border-e-2 border-primary">Cycle Time</div>
        <div className="">
          {cycleTime}
          {cycleTime == undefined ? "" : " mins"}
        </div>
      </div>
    </div>
  );
}

export default App;
