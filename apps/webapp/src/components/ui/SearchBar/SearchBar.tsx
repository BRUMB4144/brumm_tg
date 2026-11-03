import { useState } from "react";

import Search from "../../../assets/24/search.svg";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center bg-gray-200 py-6 px-2 rounded-full w-full relative">
      <input
        type="text"
        placeholder="Поиск города..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-white flex-grow px-4 py-2 rounded-full outline-none"
      />

      <img
        src={Search}
        className="absolute right-0 mr-6"
        alt=""
        height={20}
        width={20}
      />
    </div>
  );
};

export default SearchBar;
