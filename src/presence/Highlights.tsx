import { useEffect, useState } from "react";
import React from "react";
import * as rangyCore from "rangy";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "rangy/lib/rangy-selectionsaverestore";
import Listener from "./highlights/Listener";

const rangy = (rangyCore as any).default;

export default function Highlights() {
  // The current selection, serialized
  const [selection, setSelection] = useState<string | null>(null);
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
  }, [selection]);

  return <Listener containers={containers} setSelection={setSelection} />;
}
