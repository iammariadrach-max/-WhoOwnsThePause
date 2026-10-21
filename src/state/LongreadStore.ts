import { createContext, useContext, type Dispatch } from "react";
import type { Action, LongreadState } from "./longreadReducer";
/** Kept outside the provider module so hot refresh preserves context identity. */
export const LongreadStore = createContext<{
  state: LongreadState;
  dispatch: Dispatch<Action>;
} | null>(null);
export function useLongread() {
  const value = useContext(LongreadStore);
  if (!value) throw new Error("LongreadProvider is required");
  return value;
}
