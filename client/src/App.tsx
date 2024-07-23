import { Router } from "./Router";
import { SettingsNavContextProvider } from "./context/settingsNavContext";
import { ThemeProvider } from "./context/theme-provider";
import { StatContextProvider } from "./context/statCardContext";
import { FontProvider } from "./context/font-provider";
import { AnnouncementProvider } from "./context/announcement-provider";
import { MessageProvider } from "./context/message-provider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="deer-ui-theme">
        <FontProvider>
          <AnnouncementProvider>
            <MessageProvider>
              <SettingsNavContextProvider>
                <StatContextProvider>
                  <Router />
                </StatContextProvider>
              </SettingsNavContextProvider>
            </MessageProvider>
          </AnnouncementProvider>
        </FontProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
