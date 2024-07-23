import { Badge } from "../ui/badge"

const RoleBadge = ({ role }: { role: string | undefined }) => {
    return (
        <Badge
            className={
                role === "BASIC"
                    ? "bg-green-600 bg-opacity-20 border border-green-600 text-green-600 dark:text-green-300 hover:bg-green-500 hover:bg-opacity-20 rounded-full py-0"
                    : role === "T1"
                        ? "bg-blue-600 bg-opacity-20 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-500 hover:bg-opacity-20 rounded-full py-0"
                        : role === "T2"
                            ? "bg-cyan-600 bg-opacity-20 border border-cyan-600 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500 hover:bg-opacity-20 rounded-full py-0"
                            : role === "TECHNICIAN"
                                ? "bg-pink-600 bg-opacity-20 border border-pink-600 text-pink-600 dark:text-pink-300 hover:bg-pink-500 hover:bg-opacity-20 rounded-full py-0"
                                : role === "ADMIN"
                                    ? "bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-20 rounded-full py-0"
                                    : role === "SUPER_ADMIN"
                                        ? "bg-orange-600 bg-opacity-20 border border-orange-600 text-orange-600 dark:text-orange-300 hover:bg-orange-500 hover:bg-opacity-20 rounded-full py-0"
                                        : role === "DEVELOPER"
                                            ? "bg-purple-600 bg-opacity-20 border border-purple-600 text-purple-600 dark:text-purple-300 hover:bg-purple-500 hover:bg-opacity-20 rounded-full py-0"
                                            : "bg-foreground"
            }
        >
            {role}
        </Badge>
    )
}

export default RoleBadge