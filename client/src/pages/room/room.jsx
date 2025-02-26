import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { useUser } from "../../user-context";
import {
  OwnCapability,
  useCallStateHooks,
  useRequestPermission,
  useCall,
} from "@stream-io/video-react-sdk";
import { Controls } from "./controls";
import { Participants } from "./participants";
import { PermissionRequestsPanel } from "./permission-request";

export const Room = () => {
  const { user } = useUser();
  const cookies = new Cookies();

  const { useCallCustomData, useParticipants, useCallCreatedBy } =
    useCallStateHooks();

  // Read custom data (title, description) from the call
  const custom = useCallCustomData();
  // List of participants in the call
  const participants = useParticipants();
  // The user who created the call
  const createdBy = useCallCreatedBy();

  // The actual call object
  const call = useCall();

  // Hook for requesting a specific permission (SEND_AUDIO in this example)
  const { hasPermission, requestPermission } = useRequestPermission(
    OwnCapability.SEND_AUDIO
  );

  /**
   * Leave the call and remove cookies, then redirect to main.jsx.
   */
  const handleLeaveRoom = () => {
    if (!call) {
      console.error("Call object is not defined");
      return;
    }
    call.leave(); // Leave the call/room
    cookies.remove("token");
    cookies.remove("name");
    cookies.remove("username");
    window.location.pathname = "/"; // Navigate to main.jsx
  };

  /**
   * Close the room (for room owner only) and navigate to main.jsx
   */
  const handleCloseRoom = () => {
    if (!call) {
      console.error("Call object is not defined");
      return;
    }
    call.leave(); // Terminate the call/room
    cookies.remove("token");
    cookies.remove("name");
    cookies.remove("username");
    window.location.pathname = "/"; // Navigate to main.jsx
  };

  /**
   * Compare the local user's "username" to the call creator's "id"
   * to decide if the local user is the room owner.
   */
  const isRoomOwner = user?.username === createdBy?.id;

  return (
    <div className="room">
      <h2 className="title">{custom?.title ?? "<Title>"}</h2>
      <h3 className="description">{custom?.description ?? "<Description>"}</h3>
      <p className="participant-count">{participants.length} participants</p>

      <Participants />

      {/* Room Owner UI */}
      {isRoomOwner ? (
        <>
          <PermissionRequestsPanel />
          {/* No permission request button for room owner */}
          <Controls />
          <button className="close-room-btn" onClick={handleCloseRoom}>
            Close Room
          </button>
        </>
      ) : (
        /* Non-Owner UI */
        <>
          {/* Only show permission request button if user doesn't have permission */}
          {!hasPermission && (
            <button className="request-permission-btn" onClick={requestPermission}>
              &#9995; Request to Speak
            </button>
          )}
          
          {/* Only show controls if user has permission */}
          {hasPermission && <Controls />}
          
          {/* Leave button for non-owners */}
          <button 
            className="leave-room-btn" 
            onClick={handleLeaveRoom}
            style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
          >
            Leave
          </button>
        </>
      )}
    </div>
  );
};