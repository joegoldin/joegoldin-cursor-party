import { useEffect, useState } from "react";
import * as rangyCore from "rangy";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "rangy/lib/rangy-selectionsaverestore";

const rangy = (rangyCore as any).default;

export default function SelectionListener() {
  // Store the nodes that are enabled for highlights
  const [containers, setContainers] = useState<Record<string, Element>>({});
  const [serializedSelection, setSerializedSelection] = useState<string | null>(
    null
  );

  // Build containers
  useEffect(() => {
    // get all nodes that have a data-highlights attribute
    const enabled = document.querySelectorAll("[data-highlights]");
    const newContainers: Record<string, Element> = {};
    for (const element of enabled) {
      const checksum: string = rangy.getElementChecksum(element);
      newContainers[checksum] = element;
    }
    //console.log(newContainers);
    setContainers(newContainers);
    (document as any).rangy = rangy;
  }, []);

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
        setSerializedSelection(null);
        return;
      }
      const container = getContainer(selection);
      if (!(container && isEntirelyContained(selection, container))) {
        setSerializedSelection(null);
        return;
      }
      const serialized = rangy.serializeSelection(
        selection,
        false, // omit the container element
        container
      );
      setSerializedSelection(serialized);
    };
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [containers]);

  useEffect(() => {
    console.log("serializedSelection", serializedSelection);
  }, [serializedSelection]);

  return null;
}
