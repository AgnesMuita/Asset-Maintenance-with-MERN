import { Badge } from "../ui/badge"


const AssetConditionBadge = ({ condition }: { condition: string | undefined }) => {
    return (
        <Badge className={
            condition === "Good"
                ? "bg-lime-600 bg-opacity-20 border border-lime-600 text-lime-600 dark:text-lime-300 hover:bg-line-500 hover:bg-opacity-20 rounded-full py-0"
                : condition === "Fair"
                    ? "bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-500 hover:bg-opacity-20 rounded-full py-0"
                    : condition === "Very Good"
                        ? "bg-green-600 bg-opacity-20 border border-green-600 text-green-600 dark:text-green-300 hover:bg-green-500 hover:bg-opacity-20 rounded-full py-0"
                        : condition === "Broken"
                            ? "bg-red-600 bg-opacity-20 border border-red-600 text-red-600 dark:text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-full py-0"
                            : condition === "Faulty"
                                ? "bg-orange-600 bg-opacity-20 border border-orange-600 text-orange-600 dark:text-orange-300 hover:bg-orange-500 hover:bg-opacity-20 rounded-full py-0"
                                : condition === "Junk"
                                    ? "bg-stone-600 bg-opacity-20 border border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-500 hover:bg-opacity-20 rounded-full py-0"
                                    : condition === "Obsolete"
                                        ? "bg-slate-600 bg-opacity-20 border border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-500 hover:bg-opacity-20 rounded-full py-0"
                                        : condition === "Wornout"
                                            ? "bg-fuchsia-600 bg-opacity-20 border border-fuchsia-600 text-fuchsia-600 dark:text-fuchsia-300 hover:bg-fuchsia-500 hover:bg-opacity-20 rounded-full py-0"
                                            : condition === "Wornout Fabric"
                                                ? "bg-pink-600 bg-opacity-20 border border-pink-600 text-pink-600 dark:text-pink-300 hover:bg-pink-500 hover:bg-opacity-20 rounded-full py-0"
                                                : "bg-foreground"
        }>{condition}</Badge>
    )
}

export default AssetConditionBadge