interface NewsProps {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
}

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import NewsDetails from "./NewsDetails";

const NewsCard = (props: { article: NewsProps }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Card className="min-w-[320px] h-max text-left cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-900 group transition-colors duration-150 ease-in-out">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="capitalize">{props.article.title}</p>
                <p className="text-sm">Departmental News</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(props.article.updatedAt, "MMM dd yyyy")}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div
              className="text-sm text-muted-foreground line-clamp-3"
              dangerouslySetInnerHTML={{ __html: props.article.description }}
            ></div>
          </CardContent>
          <CardFooter className="flex items-center gap-x-4">
            <Badge variant="default">Badge</Badge>
            <Badge variant="outline">Badge</Badge>
            <Badge variant="outline">Badge</Badge>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50rem]">
        <NewsDetails id={props.article.id} />
      </DialogContent>
    </Dialog>
  );
};

export default NewsCard;
