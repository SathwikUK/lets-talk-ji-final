import React from "react";
import { LiveButton } from "./live-button";
import { MicButton } from "./mic-button";

export const Controls = () => {
  return (
    <div className="controls-panel">
      <MicButton />
      <LiveButton />
    </div>
  );
};
