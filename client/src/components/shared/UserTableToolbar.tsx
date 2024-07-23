import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DEPARTMENTS, ROLES } from "@/utils/consts";

interface UserTableToolbarProps<TData> {
  table: Table<TData>;
}

export function UserTableToolbar<TData>({
  table,
}: UserTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Type Full Name..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={ROLES}
          />
        )}
        {table.getColumn("department") && (
          <DataTableFacetedFilter
            column={table.getColumn("department")}
            title="Department"
            options={DEPARTMENTS}
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
