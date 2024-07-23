import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import EventDetails from "./EventDetails";

export const EventCard = (props: { eventI: IEventProps }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Card className="min-w-[320px] h-max cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-900 group transition-colors duration-150 ease-in-out">
          <CardContent className="flex p-0 text-left">
            <div className="bg-blue-600 p-4 rounded-l-lg">
              <p className="font-semibold text-white text-xl">
                {format(props.eventI.eventDate, "MMM dd yyyy")}
              </p>
            </div>
            <div className="flex flex-col gap-y-2 px-4 py-2">
              <p className="capitalize font-semibold">{props.eventI.title}</p>
              <div
                className="text-sm text-muted-foreground line-clamp-3"
                dangerouslySetInnerHTML={{ __html: props.eventI.description }}
              ></div>
              <CardFooter className="flex items-center gap-x-4 pb-0 pl-0">
                <Badge variant="default">Badge</Badge>
                <Badge variant="outline">Badge</Badge>
                <Badge variant="outline">Badge</Badge>
              </CardFooter>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50rem]">
        <EventDetails id={props.eventI.id} />
      </DialogContent>
    </Dialog>
  );
};
