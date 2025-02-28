// src/pages/room/controls.jsx
import React from "react";
import { LiveButton } from "./live-button";
import { MicButton } from "./mic-button";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";

export const Controls = () => {
  const call = useCall();
  const { useCallCustomData } = useCallStateHooks();
  const custom = useCallCustomData();
  const { user } = useUser();
  
  // Determine if the current user is the room owner using custom.owner
  const isRoomOwner = user?.username === custom?.owner;
  
  return (
    <div className="controls-panel">
      <MicButton />
      {/* Show the LiveButton only for the owner */}
      {isRoomOwner && <LiveButton />}
    </div>
  );
};
