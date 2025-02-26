import React from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

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
      {isMute ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
    </button>
  );
};