import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { makeFallBack } from "@/utils/make.fallback";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { MoreHorizontalIcon } from "lucide-react";
import { BiSolidLeftArrow } from "react-icons/bi";
import RoleBadge from "./shared/RoleBadge";


const Message = ({ message, caseI }: { message: IMessageProps | undefined, caseI: ICaseProps | undefined }) => {
	return (
		<>
			{message && (
				<Card className="relative ml-[4rem] group">
					<CardHeader className="py-2 flex-row items-center justify-between bg-slate-100 dark:bg-slate-900 rounded-t-xl">
						<div className="flex items-center gap-x-3">
							<Avatar className="h-10 w-10 absolute top-0 -left-[3.5rem]">
								<AvatarImage
									src={
										message?.sender?.avatar ??
										"https://github.com/shadcn.png"
									}
									alt="avatar"
								/>
								<AvatarFallback>
									{makeFallBack(
										message?.sender?.firstName,
										message.sender?.lastName
									)}
								</AvatarFallback>
							</Avatar>
							<BiSolidLeftArrow size={16} className="absolute -left-[0.8rem] text-slate-100 dark:text-slate-900 stroke-[#e4e4e7] dark:stroke-[#27272a]" strokeWidth="1" />
							<div className="flex flex-col">
								<div className="flex items-center gap-x-3">
									<p className="text-sm">{message.sender?.fullName}</p>
									<RoleBadge role={message?.sender?.role} />
								</div>
								{/* <p className="text-xs text-slate-700 dark:text-slate-300">
									{message.sender?.email}
								</p> */}
							</div>
							<p className="text-sm text-slate-400">commented on {message.createdAt && format(message.createdAt, "LLL dd, yyyy")}</p>
						</div>
						<div className="text-sm flex items-center gap-x-4">
							{caseI?.owner.id === message.sender?.id && <Badge className="rounded-full py-0" variant="outline">Author</Badge>}
							<MoreHorizontalIcon size={18} className="text-slate-400" />
						</div>
					</CardHeader>
					<Separator />
					<CardContent className="py-4">
						<p dangerouslySetInnerHTML={{ __html: message.content }}></p>
					</CardContent>
					<Separator orientation="vertical" className="h-[2.1rem] absolute left-12 group-last:hidden" />
				</Card>
			)}
		</>
	);
};

export default Message;
