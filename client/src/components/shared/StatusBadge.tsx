import { Badge } from "../ui/badge"

const StatusBadge = ({ currStatus }: { currStatus: string | undefined }) => {
    return (
        <Badge
            variant="outline"
            className={
                currStatus === "ACTIVE"
                    ? "bg-green-600 bg-opacity-20 border border-green-600 text-green-600 dark:text-green-300 hover:bg-green-500 hover:bg-opacity-20 rounded-full py-0"
                    : currStatus === "MERGED"
                        ? "bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-20 rounded-full py-0"
                        : currStatus === "CANCELLED"
                            ? "bg-red-600 bg-opacity-20 border border-red-600 text-red-600 dark:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-full py-0"
                            : currStatus === "RESOLVED"
                                ? "bg-blue-600 bg-opacity-20 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-500 hover:bg-opacity-20 rounded-full py-0"
                                : currStatus === "DUPLICATE"
                                    ? "bg-orange-600 bg-opacity-20 border border-orange-600 text-orange-600 dark:text-orange-300 hover:bg-orange-500 hover:bg-opacity-20 rounded-full py-0"
                                    : "text-foreground"
            }
        >
            {currStatus}
        </Badge>
    )
}

export default StatusBadge