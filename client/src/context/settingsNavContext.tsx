import React, { createContext, useReducer } from "react";

type State = {
  setComp: string;
};

// Define types for your actions
type Action =
  | { type: "PROFILE"; payload: string }
  | { type: "APPEARANCE"; payload: string }
  | { type: "NOTIFICATIONS"; payload: string };

const settingsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "PROFILE": {
      return {
        ...state,
        setComp: action.payload,
      };
    }
    case "APPEARANCE": {
      return {
        ...state,
        setComp: action.payload,
      };
    }
    case "NOTIFICATIONS": {
      return {
        ...state,
        setComp: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

type initialStateProps = {
  setComp: string;
};

type SettingsNavContextType = {
  state: initialStateProps;
  dispatch: React.Dispatch<Action>;
};

type SettingsNavContextProviderProps = {
  children: React.ReactNode; // Define children prop explicitly as ReactNode
};

const INITIAL_STATE = {
  setComp: "Profile",
};

export const SettingsNavContext = createContext<SettingsNavContextType>({
  state: INITIAL_STATE,
  dispatch: () => null,
});

export const SettingsNavContextProvider = ({
  children,
}: SettingsNavContextProviderProps) => {
  const [state, dispatch] = useReducer(settingsReducer, INITIAL_STATE);

  return (
    <SettingsNavContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsNavContext.Provider>
  );
};
