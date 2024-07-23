"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { FileCheck, FileX2, PlusIcon, Trash2, UserRoundPlusIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NewCase from "../NewCase";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex items-center gap-x-2 ml-auto">
      <Sheet>
        <SheetTrigger>
          <Button variant="outline">
            New <PlusIcon className="ml-2 h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[60rem] sm:max-w-none">
          <SheetHeader className="mb-4">
            <SheetTitle>Create New Case</SheetTitle>
            <SheetDescription>
              Create a case which will automatically submit a ticket to IT
              support. Make sure you describe you issue clearly.
            </SheetDescription>
          </SheetHeader>
          <NewCase />
        </SheetContent>
      </Sheet>
      <Button variant="outline" className="">
        Refresh <ReloadIcon className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="outline">
        Resolve Case <FileCheck className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="outline">
        Cancel Case <FileX2 className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="outline">
        Assign <UserRoundPlusIcon className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="destructive">
        Delete <Trash2 className="ml-2 h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            Column View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
