import React, { createContext, useContext, useState } from 'react';


interface MessageContextType {
    newMessage: IMessageProps | null;
    setNewMessage: (message: IMessageProps | null) => void;
}

// Create a context
const MessageContext = createContext<MessageContextType>({
    newMessage: null,
    setNewMessage: () => { }
});

// Create a context provider
export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [newMessage, setNewMessage] = useState<IMessageProps | null>(null);

    return (
        <MessageContext.Provider value={{ newMessage, setNewMessage }}>
            {children}
        </MessageContext.Provider>
    );
};

// Custom hook to consume the context
export const useMessage = (): MessageContextType => {
    return useContext(MessageContext);
};
