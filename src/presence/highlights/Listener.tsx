import { useEffect, useState } from "react";
import * as rangyCore from "rangy";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "rangy/lib/rangy-selectionsaverestore";

const rangy = (rangyCore as any).default;

export default function Listener({
  containers,
  setSelection,
}: {
  containers: Record<string, Element>;
  setSelection: (selection: string | null) => void;
}) {
  const getContainer = (selection: RangySelection) => {
    for (const range of selection.getAllRanges()) {
      for (const element of Object.values(containers)) {
        if (rangy.dom.isAncestorOf(element, range.commonAncestorContainer)) {
          return element;
        }
      }
    }
    return null;
  };

  const isEntirelyContained = (selection: RangySelection, element: Element) => {
    for (const range of selection.getAllRanges()) {
      if (!rangy.dom.isAncestorOf(element, range.commonAncestorContainer)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (Object.keys(containers).length === 0) return;

    const handleSelectionChange = () => {
      // @ts-ignore
      const selection = rangy.getSelection();
      if (selection.isCollapsed) {
        setSelection(null);
        return;
      }
      const container = getContainer(selection);
      if (!(container && isEntirelyContained(selection, container))) {
        setSelection(null);
        return;
      }
      const serialized = rangy.serializeSelection(
        selection,
        false, // omit the container element
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
