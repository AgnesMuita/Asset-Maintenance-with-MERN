import { NotificationsForm } from "@/components/NotificationsForm";
import { ProfileForm } from "@/components/ProfileForm";
import { AppearanceForm } from "@/components/AppearanceForm";
import { SidebarNav } from "@/components/shared/SidebarNav";
import { Separator } from "@/components/ui/separator";
import { SettingsNavContext } from "@/context/settingsNavContext";
import React from "react";

const sidebarNavItems: IHrefProps[] = [
  {
    title: "Profile",
    href: "PROFILE",
  },
  {
    title: "Appearance",
    href: "APPEARANCE",
  },
  {
    title: "Notifications",
    href: "NOTIFICATIONS",
  },
];

const Settings: React.FunctionComponent = () => {
  const { state } = React.useContext(SettingsNavContext);

  return (
    <div className="p-2 border-l w-full">
      <div className="hidden space-y-6 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 px-10">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div
            className={
              state.setComp === "Profile" ? "flex-1 lg:max-w-2xl" : "hidden"
            }
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                  This is how others see you on the site.
                </p>
              </div>
              <Separator />
              <ProfileForm />
            </div>
          </div>
          <div
            className={
              state.setComp === "Appearance" ? "flex-1 lg:max-w-2xl" : "hidden"
            }
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Customize the appearance of the app. Automatically switch
                  between day and night themes.
                </p>
              </div>
              <Separator />
              <AppearanceForm />
            </div>
          </div>
          <div
            className={
              state.setComp === "Notifications"
                ? "flex-1 lg:max-w-2xl"
                : "hidden"
            }
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive notifications.
                </p>
              </div>
              <Separator />
              <NotificationsForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
