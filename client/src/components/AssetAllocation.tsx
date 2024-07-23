import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Badge } from './ui/badge'
import { Separator } from "./ui/separator"
import { format } from "date-fns"

const AssetAllocation = ({ user }: { user: IUserProps | undefined }) => {
    return (
        <div className='grid lg:grid-cols-3 gap-4'>
            <Card>
                <CardHeader>
                    <CardTitle className="font-bold text-lg">Asset Allocation History</CardTitle>
                    <Separator />
                </CardHeader>
                <ScrollArea className='h-[calc(100vh-21rem)]'>
                    <CardContent>
                        {user?.history?.map((hist) => (
                            <Accordion type="multiple" key={hist.id}>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Issued On: {hist.issuedAt && format(hist.issuedAt, "dd/MM/yyy p")}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex items-center gap-x-2">
                                            <Badge className={
                                                hist.assetCondtion === "Good"
                                                    ? "bg-lime-600 hover:bg-line-500"
                                                    : hist.assetCondtion === "Fair"
                                                        ? "bg-yellow-600 hover:bg-yellow-500"
                                                        : hist.assetCondtion === "Very Good"
                                                            ? "bg-green-600 hover:bg-green-500"
                                                            : hist.assetCondtion === "Broken"
                                                                ? "bg-red-600 hover:bg-red-500"
                                                                : hist.assetCondtion === "Faulty"
                                                                    ? "bg-orange-600 hover:bg-orange-500"
                                                                    : hist.assetCondtion === "Junk"
                                                                        ? "bg-stone-600 hover:bg-stone-500"
                                                                        : hist.assetCondtion === "Obsolete"
                                                                            ? "bg-slate-600 hover:bg-slate-500"
                                                                            : hist.assetCondtion === "Wornout"
                                                                                ? "bg-fuchsia-600 hover:bg-fuchsia-500"
                                                                                : hist.assetCondtion === "Wornout Fabric"
                                                                                    ? "bg-pink-600 hover:bg-pink-500"
                                                                                    : "bg-foreground"
                                            }>{hist.assetCondtion}</Badge>
                                            <Badge className={
                                                hist.assetStatus === "New"
                                                    ? "bg-blue-600 hover:bg-blue-500"
                                                    : hist.assetStatus === "Reallocated"
                                                        ? "bg-cyan-600 hover:bg-cyan-500"
                                                        : "bg-foreground"
                                            }>{hist.assetStatus}</Badge>
                                            <Badge>{hist.asset.tag}</Badge>
                                        </div>
                                        <div className='flex gap-x-4 pt-2'>
                                            <p className='font-semibold text-muted-foreground'>Location: <span className='font-medium text-foreground'>{hist.assetLocation}</span></p>
                                            <p className='font-semibold text-muted-foreground'>Asset: <span className='font-medium text-foreground'>{hist.asset.name}</span></p>
                                        </div>
                                        <div className='mt-2 flex flex-col text-lg gap-y-1'>
                                            <p className='font-medium underline text-sm'>Conditional Notes</p>
                                            <p className='text-sm text-muted-foreground pl-4'>{hist.assetConditionalNotes}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                    </CardContent>
                </ScrollArea>
            </Card>
        </div>
    )
}

export default AssetAllocation