import {
  Avatar,
  ParticipantsAudio,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Participant } from "./participant";
import React from "react";

export const Participants = () => {
  const { useParticipants } = useCallStateHooks();
  // whenever a participant receives an update, this hook will re-render
  // this component with the updated list of participants, ensuring that
  // the UI is always in sync with the call state.
  const participants = useParticipants();
  return (
    <div className="participants-panel">
      <div className="participants">
        <ParticipantsAudio participants={participants} />
        {participants.map((p) => (
          <Participant participant={p} key={p.sessionId} />
        ))}
      </div>
    </div>
  );
};