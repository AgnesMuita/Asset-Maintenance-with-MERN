import React, { createContext, useContext, useState } from 'react';


interface AnnouncementContextType {
    newAnnouncement: IAnnouncementProps | null;
    setNewAnnouncement: (announcement: IAnnouncementProps | null) => void;
}

// Create a context
const AnnouncementContext = createContext<AnnouncementContextType>({
    newAnnouncement: null,
    setNewAnnouncement: () => { }
});

// Create a context provider
export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [newAnnouncement, setNewAnnouncement] = useState<IAnnouncementProps | null>(null);

    return (
        <AnnouncementContext.Provider value={{ newAnnouncement, setNewAnnouncement }}>
            {children}
        </AnnouncementContext.Provider>
    );
};

// Custom hook to consume the context
export const useAnnouncement = (): AnnouncementContextType => {
    return useContext(AnnouncementContext);
};
