import { Badge } from "../ui/badge"


const PriorityBadge = ({ priority }: { priority: string | undefined }) => {
    return (
        <Badge
            className={
                priority === "LOW"
                    ? "bg-green-600 bg-opacity-20 border border-green-600 text-green-600 dark:text-green-300 hover:bg-green-500 hover:bg-opacity-20 rounded-full py-0"
                    : priority === "NORMAL"
                        ? "bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-20 rounded-full py-0"
                        : priority === "HIGH"
                            ? "bg-red-600 bg-opacity-20 border border-red-600 text-red-600 dark:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-full py-0"
                            : priority === "URGENT"
                                ? "bg-pink-600 bg-opacity-20 border border-pink-600 text-pink-600 dark:text-pink-300 hover:bg-pink-500 hover:bg-opacity-20 rounded-full py-0"
                                : "bg-foreground"
            }
        >
            {priority}
        </Badge>
    )
}

export default PriorityBadge