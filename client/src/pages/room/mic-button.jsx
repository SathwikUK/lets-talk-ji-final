import { useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";

export const MicButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();

  const handleMicToggle = async () => {
    if (isMute) {
      await microphone?.enable();
    } else {
      await microphone?.disable();
    }
  };

  return (
    <button onClick={handleMicToggle}>
      {isMute ? "Unmute" : "Mute"}
    </button>
  );
};
