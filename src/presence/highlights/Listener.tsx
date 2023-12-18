import { useEffect } from "react";

import {
  getAllRangesForSelection,
  isAncestorOf,
  serializeSelection,
} from "./rangy";

export default function Listener({
  containers,
  setSelection,
}: {
  containers: Record<string, Element>;
  setSelection: (selection: string | null) => void;
}) {
  const getContainer = (selection: Selection) => {
    for (const range of getAllRangesForSelection(selection)) {
      for (const element of Object.values(containers)) {
        if (isAncestorOf(element, range.commonAncestorContainer)) {
          return element;
        }
      }
    }
    return null;
  };

  const isEntirelyContained = (selection: Selection, element: Element) => {
    for (const range of getAllRangesForSelection(selection)) {
      if (!isAncestorOf(element, range.commonAncestorContainer)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (Object.keys(containers).length === 0) return;

    const handleSelectionChange = () => {
      const selection = getSelection();
      if (!selection) {
        setSelection(null);
        return;
      }
      if (selection.isCollapsed) {
        setSelection(null);
        return;
      }
      const container = getContainer(selection);
      if (!(container && isEntirelyContained(selection, container))) {
        setSelection(null);
        return;
      }
      const serialized = serializeSelection(
        selection,
        false, // include checksum
        container
      );
      setSelection(serialized);
    };
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [containers]);

  return null;
}
