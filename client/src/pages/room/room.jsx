import { OwnCapability, useCallStateHooks, useRequestPermission, useCall } from "@stream-io/video-react-sdk";
import { Controls } from "./controls";
import { Participants } from "./participants";
import { PermissionRequestsPanel } from "./permission-request";
import { useUser } from "../../user-context";
import Cookies from "universal-cookie";
import React from "react";

export const Room = () => {
  const { useCallCustomData, useParticipants, useCallCreatedBy } = useCallStateHooks();
  const custom = useCallCustomData();
  const participants = useParticipants();
  const createdBy = useCallCreatedBy();
  const { user } = useUser();
  const cookies = new Cookies();

  // Get the call object using the useCall hook
  const call = useCall();

  const { hasPermission, requestPermission } = useRequestPermission(
    OwnCapability.SEND_AUDIO
  );

  const handleCloseRoom = () => {
    // Check if call object is defined before attempting to use it
    if (call) {
      call.leave();  // Terminate the call or room
      // Additional cleanup if needed
      cookies.remove("token");
      cookies.remove("name");
      cookies.remove("username");
      window.location.pathname = "/";  // Redirect to the home page
    } else {
      console.error("Call object is not defined");
    }
  };

  return (
    <div className="room">
      <h2 className="title">{custom?.title ?? "<Title>"}</h2>
      <h3 className="description">{custom?.description ?? "<Description>"}</h3>
      <p className="participant-count">{participants.length} participants</p>

      <Participants />
      {user?.username === createdBy?.id ? (
        <>
          <PermissionRequestsPanel />
          <button className="close-room-btn" onClick={handleCloseRoom}>
            Close Room
          </button>
        </>
      ) : (
        <button className="request-permission-btn" onClick={requestPermission}>
          &#9995;
        </button>
      )}
      {hasPermission && <Controls />}
    </div>
  );
};
