import * as React from "react";
import useCursorTracking from "./use-cursors";
import OtherCursors from "./other-cursors";
import Chat from "./Chat";
import Highlights from "./Highlights";

const ENABLE_CHAT = true;
const ENABLE_HIGHLIGHTS = true;

export default function Cursors() {
  useCursorTracking("document");

  return (
    <>
      <OtherCursors showChat={ENABLE_CHAT} />
      {ENABLE_CHAT && <Chat />}
      {ENABLE_HIGHLIGHTS && <Highlights />}
    </>
  );
}
