import { useEffect, useState } from "react";
import * as rangyCore from "rangy";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "rangy/lib/rangy-selectionsaverestore";
import Listener from "./highlights/SelectionListener";

const rangy = (rangyCore as any).default;
import React from "react";

import SelectionListener from "./highlights/SelectionListener";

export default function Highlights() {
  return <SelectionListener />;
}
