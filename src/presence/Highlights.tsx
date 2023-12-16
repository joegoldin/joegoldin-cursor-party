import { useEffect, useState } from "react";
import React from "react";
import { usePresence } from "./presence-context";
import * as rangyCore from "rangy";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "rangy/lib/rangy-selectionsaverestore";
import Listener from "./highlights/Listener";
import Decorator from "./highlights/Decorator";

const rangy = (rangyCore as any).default;

export default function Highlights() {
  const { otherUsers, updatePresence } = usePresence((state) => {
    return {
      otherUsers: state.otherUsers,
      updatePresence: state.updatePresence,
    };
  });

  // The current selection, serialized
  const [selection, setSelection] = useState<string | null>(null);
  // Track other selections
  const [otherSelections, setOtherSelections] = useState<string[]>([]);
  // Store the nodes that are enabled for highlights
  const [containers, setContainers] = useState<Record<string, Element>>({});

  // Build containers
  useEffect(() => {
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

  useEffect(() => {
    console.log("selection changed", selection);
    updatePresence({ selection: selection !== null ? selection : undefined });
  }, [selection]);

  useEffect(() => {
    setOtherSelections(
      Array.from(otherUsers.values())
        .filter((user) => user.presence?.selection)
        .map((user) => user.presence?.selection!)
    );
  }, [otherUsers]);

  return (
    <>
      <Listener containers={containers} setSelection={setSelection} />
      <Decorator containers={containers} otherSelections={otherSelections} />
    </>
  );
}
