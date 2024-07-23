import React, { createContext, useReducer } from "react";

interface stateProps {
  cases?: number;
  articles?: number;
  assets?: number;
  events?: number;
  announcements?: number;
  documents?: number;
  news?: number;
  logs?: number;
}

type State = {
  setStat: stateProps;
};

// Define types for your actions
type Action = { type: "DASH_STAT"; payload: stateProps };

const statReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "DASH_STAT": {
      return {
        ...state,
        setStat: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

type initialStateProps = {
  setStat: stateProps;
};

type StatContextType = {
  state: initialStateProps;
  dispatch: React.Dispatch<Action>;
};

type StatContextProviderProps = {
  children: React.ReactNode; // Define children prop explicitly as ReactNode
};

const INITIAL_STATE = {
  setStat: { cases: 0, assets: 0, articles: 0, logs: 0, events: 0, news: 0, announcements: 0, documents: 0 },
};

export const StatContext = createContext<StatContextType>({
  state: INITIAL_STATE,
  dispatch: () => null,
});

export const StatContextProvider = ({ children }: StatContextProviderProps) => {
  const [state, dispatch] = useReducer(statReducer, INITIAL_STATE);

  return (
    <StatContext.Provider value={{ state, dispatch }}>
      {children}
    </StatContext.Provider>
  );
};
