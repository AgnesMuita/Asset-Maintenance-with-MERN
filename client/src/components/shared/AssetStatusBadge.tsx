import { Badge } from "../ui/badge"

const AssetStatusBadge = ({ assetStatus }: { assetStatus: string | undefined }) => {
    return (
        <Badge className={
            assetStatus === "New"
                ? "bg-blue-600 bg-opacity-20 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-500 hover:bg-opacity-20 rounded-full py-0"
                : assetStatus === "Reallocated"
                    ? "bg-cyan-600 bg-opacity-20 border border-cyan-600 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500 hover:bg-opacity-20 rounded-full py-0"
                    : "bg-foreground"
        }>{assetStatus}</Badge>
    )
}

export default AssetStatusBadge