/* eslint-disable import/extensions */
import { FilterList, Search } from "@mui/icons-material";

function SearchBar() {
  return (
    <div className="bg-[var(--search-input-container-background)] flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-[var(--panel-header-background)] flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <Search className="text-[var(--panel-header-icon)] cursor-pointer text-l" />
        </div>
        <div>
          <input
            placeholder="Search or start a new chat "
            name="search"
            className="bg-transparent text-sm outline-none text-[--text-primary] "
          />
        </div>
      </div>
      <div className="pr-5 pl-3">
        <FilterList className="text-[var(--panel-header-icon)] cursor-pointer text-l" />
      </div>
    </div>
  );
}

export default SearchBar;
