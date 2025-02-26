import React from "react";
import { LiveButton } from "./live-button";
import { MicButton } from "./mic-button";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";

export const Controls = () => {
  const call = useCall();
  const { useCallCreatedBy } = useCallStateHooks();
  const createdBy = useCallCreatedBy();
  const { user } = useUser();
  
  // Check if the current user is the room owner
  const isRoomOwner = user?.username === createdBy?.id;
  
  return (
    <div className="controls-panel">
      <MicButton />
      {/* Show LiveButton only for room owner */}
      {isRoomOwner && <LiveButton />}
    </div>
  );
};