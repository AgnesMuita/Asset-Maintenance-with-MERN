import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { useContext } from "react";
import { SettingsNavContext } from "@/context/settingsNavContext";

interface ISidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: IHrefProps[];
}

export function SidebarNav({ className, items, ...props }: ISidebarNavProps) {
  const { state, dispatch } = useContext(SettingsNavContext);

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          onClick={() =>
            dispatch({
              type: item.href,
              payload:
                item.href === "PROFILE"
                  ? "Profile"
                  : item.href === "APPEARANCE"
                  ? "Appearance"
                  : item.href === "NOTIFICATIONS"
                  ? "Notifications"
                  : "Profile",
            })
          }
          className={cn(
            buttonVariants({ variant: "ghost" }),
            state.setComp === item.title
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Button>
      ))}
    </nav>
  );
}
