import React from "react";
import { useEffect } from "react";
import * as rangyCore from "rangy";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "rangy/lib/rangy-selectionsaverestore";

const rangy = (rangyCore as any).default;

export default function Decorator({
  containers,
  otherSelections,
}: {
  containers: Record<string, Element>;
  otherSelections: string[];
}) {
  useEffect(() => {
    const ranges = [];
    for (const otherSelection of otherSelections) {
      // otherSelection is a serialized selection, with the pattern
      // serialized|serialized|serialized{checksum}
      // We need to extract the checksum and then iterate over the
      // serialized ranges
      const checksum = otherSelection.split("{")[1].split("}")[0];
      if (!containers[checksum]) continue;
      const container = containers[checksum];
      for (const serialized of otherSelection.split("{")[0].split("|")) {
        //console.log("deserializing", serialized, "in container", container);
        ranges.push(rangy.deserializeRange(serialized, container));
      }
    }
    //console.log("will decorate", ranges);

    // @ts-ignore
    CSS.highlights.clear();
    // @ts-ignore
    const highlight = new Highlight(...ranges.map((r) => r.nativeRange));
    // @ts-ignore
    CSS.highlights.set("highlight-party", highlight);
  }, [otherSelections]);

  return null;
}
