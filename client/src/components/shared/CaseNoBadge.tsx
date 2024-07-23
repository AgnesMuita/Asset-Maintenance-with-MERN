import { Badge } from "../ui/badge"

const CaseNoBadge = ({ caseNumber }: { caseNumber: string | undefined }) => {
    return (
        <Badge className="bg-slate-900 dark:bg-slate-700 bg-opacity-20 border border-slate-900 dark:border-slate-400 text-slate-900 dark:text-slate-300 hover:bg-slate-900 hover:dark:bg-slate-700 hover:bg-opacity-20 rounded-full py-0">{caseNumber}</Badge>
    )
}

export default CaseNoBadge