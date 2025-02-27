import React from "react";
import { useNavigate } from "react-router-dom";
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
  const { user, setUser, setCall } = useUser();
  const cookies = new Cookies();
  const navigate = useNavigate();
  
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
   * Leave the call and redirect to main page.
   */
  const handleLeaveRoom = async () => {
    if (!call) {
      console.error("Call object is not defined");
      navigate("/main");
      return;
    }
    
    try {
      await call.leave(); // Leave the call/room
      setCall(undefined); // Clear the call from context
      navigate("/main"); // Navigate to main using React Router
    } catch (error) {
      console.error("Error leaving room:", error);
      // Force navigation even if there's an error
      setCall(undefined);
      navigate("/main");
    }
  };
  
  /**
   * Handle logout and navigate to sign-in page
   */
  const handleLogout = async () => {
    if (call) {
      try {
        await call.leave();
      } catch (error) {
        console.error("Error leaving call during logout:", error);
      }
    }
    
    // Remove cookies
    cookies.remove("token");
    cookies.remove("name");
    cookies.remove("username");
    
    // Update state
    setUser(null);
    setCall(undefined);
    
    // Navigate to sign-in
    navigate("/");
  };
  
  /**
   * Close the room (for room owner only) and navigate to main page
   */
  const handleCloseRoom = async () => {
    if (!call) {
      console.error("Call object is not defined");
      navigate("/main");
      return;
    }
    
    try {
      await call.leave(); // Terminate the call/room
      setCall(undefined); // Clear the call from context
      navigate("/main"); // Navigate to main using React Router
    } catch (error) {
      console.error("Error closing room:", error);
      // Force navigation even if there's an error
      setCall(undefined);
      navigate("/main");
    }
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
          <div className="room-actions">
            <button className="close-room-btn" onClick={handleCloseRoom}>
              Close Room
            </button>
            
          </div>
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
         
          {/* Action buttons for non-owners */}
          <div className="room-actions" style={{
            position: "absolute", 
            bottom: "1rem", 
            right: "1rem",
            display: "flex",
            gap: "10px"
          }}>
            <button className="leave-room-btn" onClick={handleLeaveRoom}>
              Leave Room
            </button>
            
          </div>
        </>
      )}
    </div>
  );
};