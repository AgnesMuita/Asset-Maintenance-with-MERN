import { Loader2Icon } from "lucide-react";
import React from "react";

const Loader: React.FunctionComponent = () => {
  return (
    <div className="flex items-center col-span-3 2xl:col-span-4 px-0 justify-center w-full py-20">
      <Loader2Icon className="animate-spin w-[5rem] h-[5rem]" />
    </div>
  );
};

export default Loader;
