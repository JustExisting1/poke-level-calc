// import { cn } from "@/lib/utils";
import { clsx, type ClassValue } from "clsx";
import {
  HtmlHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
when input is submitted, set search as complete -> hides restults
Upon input change show results
 */

export default function Autocomplete({
  pokeList,
  classname,
  submitSearch,
  clearOnChange,
}: {
  pokeList: string[];
  classname?: string;
  submitSearch: (value: string) => void;
  clearOnChange?: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const { pokemon } = UsePokemon(pokeList as string[], searchTerm); //Filtered list of pokemon
  const [selected, setSelected] = useState(false);

  //Reset search when page sends new data
  useEffect(() => {
    setSearchTerm("");
  }, [clearOnChange]);

  //Handles search input filtering
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelected(false);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelected(true); //set to true
  };

  //Currently Selected option
  const handleSelect = (poke: string) => {
    setSearchTerm(poke);
    handleSearchSubmit(poke);
  };

  //Calls a function higher up passing in the search
  const handleSearchSubmit = (guess: string) => {
    submitSearch(guess); //should set the upper value to string selected
    setSelected(true);
  };

  //Reset index upon list change or search term change
  useEffect(() => {
    {
      setActiveIndex(0);
    }
  }, [pokemon, searchTerm]);

  //Setup keys to navigate and select from the list
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % pokemon.length);
    }
    if (event.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + pokemon.length) % pokemon.length);
    }
    if (event.key === "Enter") {
      try {
        if (pokemon[activeIndex] != undefined) {
          setSearchTerm(pokemon[activeIndex]);
          handleSearchSubmit(pokemon[activeIndex]);
        }
      } catch {
        console.log("Guess doesnt exist");
      }
    }
  };

  const resultsDisplay = () => {
    if (!searchTerm) return <></>;
    if (selected) return <></>;

    return (
      <div
        className="absolute inset-y-12 z-10 flex w-full h-[16vh] overflow-y-scroll border-2 border-league-gold rounded-lg bg-black/95
     p-2 scroll-py-2 -scroll-my-2 
     scrollbar-thin scrollbar-track-foreground/10 scrollbar-thumb-primary
     scrollbar-track-rounded-2xl scrollbar-thumb-rounded-sm">
        <ResultList
          results={pokemon}
          searchTerm={searchTerm}
          handleSelect={handleSelect}
          activeIndex={activeIndex}
        />
      </div>
    );
  };

  return (
    <div className={cn(classname, "relative z-0")}>
      <input
        id="autocomplete"
        className="flex w-full h-fit text-xl py-2 shrink-0 text-center bg-white/10 rounded-lg"
        onChange={handleChange}
        onKeyDown={onKeyDown}
        value={searchTerm}
        onBlur={handleBlur}
        placeholder="Type pokemon name..."
      />
      {resultsDisplay()}
    </div>
  );
}

export interface ResultListProps {
  results: string[];
  searchTerm: string;
  handleSelect: (pokeName: string) => void;
  activeIndex: number;
}

//Filtered results list
function ResultList({
  results,
  searchTerm,
  handleSelect,
  activeIndex,
}: ResultListProps) {
  const myRef = useRef(null);
  //The list of filtered terms
  const matchedTerm = (name: string, searchTerm: string) => {
    const index = name.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) {
      return name;
    }
    return (
      <>
        {name.substring(0, index)}
        <b>{name.substring(index, index + searchTerm.length)}</b>
        {name.substring(index + searchTerm.length)}
      </>
    );
  };
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  //Scrolls active index into view upon index change
  useEffect(() => {
    myRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIndex]);

  if (results.length === 0) {
    return <div className="text-center text-xl w-full">No results found</div>;
  }

  return (
    <>
      <ol className="flex flex-col w-full h-fit gap-1.5 p-1">
        {results.map((result, index) => (
          <li
            ref={activeIndex === index ? myRef : null}
            key={index}
            onClick={() => handleSelect(result)}
            className={cn(
              "flex flex-row text-center h-fit w-full place-content-start gap-2 hover:bg-white/20",
              activeIndex === index
                ? "active bg-white/20 ring-2 ring-league-gold drop-shadow-md"
                : ""
            )}>
            {/* Image Square */}
            {/* <div className="flex w-fit aspect-square">
              <img className="size-full" src={`/app/tiles/${result.tile}`} />
            </div> */}
            {/* Name Area */}
            <div className="w-full text-2xl place-self-center">
              {matchedTerm(result, searchTerm)}{" "}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

//Filters the list for the given search term
function UsePokemon(pokeList: string[], searchTerm?: string) {
  const [pokemon, setpokemon] = useState<string[]>([]);

  useEffect(() => {
    if (!searchTerm) {
      return setpokemon([]);
    }
    const filtedList = pokeList.filter((value) => {
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return setpokemon(filtedList);
  }, [pokeList, searchTerm]);
  return { pokemon };
}
