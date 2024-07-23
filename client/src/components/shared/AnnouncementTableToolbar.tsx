import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { priorities } from "@/utils/consts";

interface AnnouncementTableToolbarProps<TData> {
    table: Table<TData>;
}

export function AnnouncementTableToolbar<TData>({
    table,
}: AnnouncementTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Type announcement Title..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[350px]"
                />
                {table.getColumn("severity") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("severity")}
                        title="Severity"
                        options={priorities}
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