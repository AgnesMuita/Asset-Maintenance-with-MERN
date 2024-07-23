import { Card, CardContent, CardHeader } from "./ui/card";
import { BugIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { format, formatDistanceToNow } from "date-fns";
import RoleBadge from "./shared/RoleBadge";
import PriorityBadge from "./shared/PriorityBadge";

const CaseStats = ({ data }: { data: ICaseProps | undefined }) => {
    return (
        <Card>
            <CardHeader className="py-2">
                <div className="flex items-center gap-x-4">
                    <BugIcon />
                    <span className="font-semibold text-xl">
                        Case Information
                    </span>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="py-4 space-y-2 divide-y-2 divide-slate-100 dark:divide-slate-900">
                <div className="py-2">
                    <p className="font-semibold text-sm text-slate-400">
                        Owner
                    </p>
                    <div className="flex items-center gap-x-4">
                        <p className="text-base">{data?.owner?.fullName}</p>
                        <RoleBadge role={data?.owner?.role} />
                    </div>
                </div>
                <div className="py-2">
                    <p className="font-semibold text-sm text-slate-400">
                        Subject
                    </p>
                    <p className="text-base overflow-x-auto">{data?.subject}</p>
                </div>
                <div className="py-2">
                    <p className="font-semibold text-sm text-slate-400">
                        Created On
                    </p>
                    <p className="text-base">{data?.createdAt && format(data.createdAt, "EEEE, LLL do, yyyy HH:mm")}</p>
                </div>
                <div className="py-2">
                    <p className="font-semibold text-sm text-slate-400">
                        Last update
                    </p>
                    <p className="text-base">{data?.updatedAt && formatDistanceToNow(data.updatedAt, { addSuffix: true })}</p>
                </div>
                <div className="py-2">
                    <p className="font-semibold text-sm text-slate-400">
                        Priority/Status
                    </p>
                    <div className="flex items-center gap-x-2">
                        <PriorityBadge priority={data?.priority} />
                        <p className="text-base capitalize">{data?.status && data?.status.replace("_", " ").toLocaleLowerCase()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CaseStats;
