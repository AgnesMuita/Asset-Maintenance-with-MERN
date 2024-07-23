import { Table } from "@tanstack/react-table";

import { Input } from "../ui/input";

interface TrashTableToolbarProps<TData> {
    table: Table<TData>;
}

export function TrashTableToolbar<TData>({
    table,
}: TrashTableToolbarProps<TData>) {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Type item name..."
                    value={(table.getColumn("deletedItem")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("deletedItem")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
            </div>
        </div>
    )
}