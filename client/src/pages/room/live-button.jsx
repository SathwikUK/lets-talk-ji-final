import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React, { useState, useEffect } from "react";

export const LiveButton = () => {
  // Get the call object from the <StreamCall /> context
  const call = useCall();

  // Get the state indicating whether the call is live or not
  const { useIsCallLive } = useCallStateHooks();
  const isCallLive = useIsCallLive();
  
  // Local state to track live status
  const [isLive, setIsLive] = useState(isCallLive);
  
  // Update local state when the call's live status changes
  useEffect(() => {
    setIsLive(isCallLive);
  }, [isCallLive]);
  
  // Add effect to listen for live state changes
  useEffect(() => {
    // Handler for live state changes
    const handleLiveStateChange = (event) => {
      setIsLive(event.is_live);
    };
    
    // Subscribe to events
    const unsubscribe = call?.on("call.live_started", handleLiveStateChange);
    const unsubscribeStop = call?.on("call.live_stopped", handleLiveStateChange);
    
    return () => {
      // Clean up event listeners
      unsubscribe?.();
      unsubscribeStop?.();
    };
  }, [call]);

  const handleLiveToggle = async () => {
    try {
      if (isLive) {
        await call?.stopLive();
      } else {
        await call?.goLive();
      }
    } catch (error) {
      console.error("Error toggling live state:", error);
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