import { useContext } from "react";
import { ShareSheetContext } from "@/shared/providers/share-sheet-provider";

export function useShareSheet() {
  const context = useContext(ShareSheetContext);

  if (!context) {
    throw new Error("useShareSheet must be used within ShareSheetProvider");
  }

  return context;
}
