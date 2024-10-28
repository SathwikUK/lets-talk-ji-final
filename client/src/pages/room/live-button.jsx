import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";

export const LiveButton = () => {
  // Get the call object from the <StreamCall /> context
  const call = useCall();

  // Get the state indicating whether the call is live or not
  const { useIsCallLive } = useCallStateHooks();
  const isLive = useIsCallLive();

  const handleLiveToggle = async () => {
    if (isLive) {
      await call?.stopLive();
    } else {
      await call?.goLive();
    }
  };

  return (
    <button
      style={{
        backgroundColor: "rgb(35, 35, 35)",
        boxShadow: isLive ? "0 0 1px 2px rgba(0, 255, 0, 0.3)" : "none",
      }}
      onClick={handleLiveToggle}
    >
      {isLive ? "Stop Live" : "Go Live"}
    </button>
  );
};
