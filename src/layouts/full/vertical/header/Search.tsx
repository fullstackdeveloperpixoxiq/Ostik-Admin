import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import SidebarContent, {
  ChildItem,
  MenuItem,
} from "../sidebar/sidebaritems";
import { Link } from "react-router";
import SimpleBar from "simplebar-react";
import { Input } from "src/components/ui/input";

interface SearchResult {
  name: string;
  url: string;
  path: string;
  icon?: string;
}

function Search() {
  const [query, setQuery] = useState("");

  // =========================================================
  // RECURSIVE SEARCH
  // =========================================================

  const searchItems = (
    items: (MenuItem | ChildItem)[],
    searchQuery: string,
    parentPath = ""
  ): SearchResult[] => {
    const results: SearchResult[] = [];

    items.forEach((item) => {
      // Make sure name is always a string
      const itemName = item.name || "";

      // Build path
      const currentPath = parentPath
        ? `${parentPath} → ${itemName}`
        : itemName;

      // =====================================================
      // CURRENT ITEM MATCH
      // =====================================================

      if (
        itemName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        item.url
      ) {
        results.push({
          name: itemName,
          url: item.url,
          path: currentPath,
          icon: item.icon,
        });
      }

      // =====================================================
      // SEARCH CHILD ITEMS
      // =====================================================

      if (item.children) {
        const childResults = searchItems(
          item.children,
          searchQuery,
          currentPath
        );

        results.push(...childResults);
      }
    });

    return results;
  };

  // =========================================================
  // SEARCH RESULTS
  // =========================================================

  const results = useMemo(() => {
    const searchQuery = query.trim();

    // Empty search
    if (!searchQuery) {
      return [];
    }

    return searchItems(
      SidebarContent,
      searchQuery
    );
  }, [query]);

  // =========================================================
  // CLEAR SEARCH AFTER CLICK
  // =========================================================

  const handleResultClick = () => {
    setQuery("");
  };

  return (
    <div className="relative w-full">

      {/* =====================================================
          SEARCH INPUT
      ====================================================== */}

      <div className="relative mx-auto flex items-center lg:w-xs">

        <Icon
          icon="solar:magnifer-linear"
          width="18"
          height="18"
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />

        <Input
          placeholder="Search...."
          className="rounded-xl pl-10"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

      </div>


      {/* =====================================================
          SEARCH RESULT DROPDOWN
      ====================================================== */}

      <div
        className={`absolute start-0 top-11 z-10 w-full rounded-md border border-border bg-background shadow-md ${
          query.trim()
            ? "block"
            : "hidden"
        }`}
      >

        <SimpleBar className="h-72 p-4 custom-scroll">

          {results.length > 0 ? (

            results.map((item, index) => (

              <Link
                key={`${item.url}-${index}`}
                to={item.url}
                onClick={handleResultClick}
                className="group mb-1.5 flex w-full items-center rounded-md bg-input/30 p-2 text-sm font-medium hover:bg-primary/20 hover:text-primary"
              >

                <div className="flex min-w-0 items-center">

                  {/* =================================================
                      ICON
                  ================================================= */}

                  <div className="shrink-0">

                    <Icon
                      icon={
                        item.icon ||
                        "iconoir:component"
                      }
                      width={18}
                      height={18}
                    />

                  </div>


                  {/* =================================================
                      RESULT DETAILS
                  ================================================= */}

                  <div className="min-w-0 ps-3">

                    <h5 className="mb-1 text-sm font-medium">
                      {item.name}
                    </h5>

                    <span className="block truncate text-xs text-muted-foreground">
                      {item.path}
                    </span>

                  </div>

                </div>

              </Link>

            ))

          ) : (

            <div className="flex h-full items-center justify-center">

              <div className="text-center">

                <Icon
                  icon="solar:magnifer-broken"
                  width={28}
                  height={28}
                  className="mx-auto mb-2 text-muted-foreground"
                />

                <h1 className="text-sm font-medium text-foreground">
                  No matching pages found
                </h1>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try another search term
                </p>

              </div>

            </div>

          )}

        </SimpleBar>

      </div>

    </div>
  );
}

export default Search;