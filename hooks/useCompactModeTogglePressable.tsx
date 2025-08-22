import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

const CompactModeContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => null]);

export function CompactModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useState(false);
  return (
    <CompactModeContext.Provider value={state}>
      {children}
    </CompactModeContext.Provider>
  );
}

export function useCompactMode() {
  const [compactMode, setCompactMode] = useContext(CompactModeContext);
  return {
    compactMode,
    setCompactMode,
  };
}
