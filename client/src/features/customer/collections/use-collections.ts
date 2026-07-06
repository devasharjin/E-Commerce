import { useCallback, useMemo } from "react";
import { useAllProducts, useCategories } from "./api";
import type { ProductAppliedFilterListQuery, ProductSort } from "./types";
import { useSearchParams } from "react-router-dom";

export function useCollections() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: categories, isLoading: categoryLoading } = useCategories();
  const { data: allProducts } = useAllProducts({});

  const filters = useMemo<ProductAppliedFilterListQuery>(
    () => ({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      color: searchParams.get("color") || "",
      size:
        (searchParams.get("size") as "S" | "M" | "L" | "XL" | null) ??
        undefined,
      sort: (searchParams.get("sort") as ProductSort) ?? "recent",
    }),
    [searchParams],
  );

  const { data: products, isLoading: productLoading } = useAllProducts(filters);

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.brand ||
    filters.color ||
    filters.size ||
    filters.sort!=='recent',
  );


  const changesort = useCallback(
    (value: ProductSort) => {
      const nextValue = new URLSearchParams(searchParams);

      if (value === "recent") {
        nextValue.delete("sort");
      } else {
        nextValue.set("sort", value);
      }

      setSearchParams(nextValue);
    },
    [searchParams, setSearchParams],
  );

  function toggleFilterFacets(key: string, value: string) {
    const nextValue = new URLSearchParams(searchParams);
    const current = nextValue.get(key);
    if (current === value) {
      nextValue.delete(key);
    } else {
      nextValue.set(key, value);
    }
    setSearchParams(nextValue);
  }

  const availableColors = useMemo(() => {
    const colors = new Set<string>();

    allProducts?.forEach((product) =>
      product.colors.forEach((color) => colors.add(color)),
    );

    return Array.from(colors).sort((a, b) => a.localeCompare(b));
  }, [allProducts]);


  function clearFilter() {
  const next = new URLSearchParams(searchParams);

  next.delete("category");
  next.delete("brand");
  next.delete("size");
  next.delete("color");

  setSearchParams(next);
}

const activeFilters = useMemo(() => {
  const filtersList = [];

  if (filters.category) {
    const activeCategory = categories?.find((item)=>item._id ==filters.category)
    filtersList.push({ type: "category", value: activeCategory?.name});
  }

  if (filters.brand) {
    filtersList.push({ type: "brand", value: filters.brand });
  }

  if (filters.color) {
    filtersList.push({ type: "color", value: filters.color });
  }

  if (filters.size) {
    filtersList.push({ type: "size", value: filters.size });
  }

  return filtersList;
}, [filters,categories]);



  return {
    products,
    categories,
    loading: productLoading || categoryLoading,
    setSearchParams,
    hasActiveFilters,
    filters,
    changesort,
    toggleFilterFacets,
    availableColors,
    clearFilter,
    activeFilters
  };
}
