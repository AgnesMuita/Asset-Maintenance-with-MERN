import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { categories, locations } from "@/utils/consts";

interface AssetTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AssetTableToolbar<TData>({
  table,
}: AssetTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Type Asset Tag..."
          value={(table.getColumn("tag")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("tag")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("location") && (
          <DataTableFacetedFilter
            column={table.getColumn("location")}
            title="Location"
            options={locations}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
