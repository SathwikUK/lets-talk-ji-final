// src/pages/room/Room.jsx
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
import { toast } from "react-toastify";
import { Controls } from "./controls";
import { Participants } from "./participants";
import { PermissionRequestsPanel } from "./permission-request";

export const Room = () => {
  const { user, setUser, setCall } = useUser();
  const cookies = new Cookies();
  const navigate = useNavigate();
  
  const { useCallCustomData, useParticipants } = useCallStateHooks();
  // Retrieve custom data (which now includes the owner)
  const custom = useCallCustomData();
  const participants = useParticipants();
  const call = useCall();
  
  const { hasPermission, requestPermission } = useRequestPermission(
    OwnCapability.SEND_AUDIO
  );
  
  // Determine if the current user is the room owner using custom.owner
  const isRoomOwner = user?.username === custom?.owner;
  // For owners, effectiveHasPermission is always true; for others, use the permission state
  const effectiveHasPermission = isRoomOwner ? true : hasPermission;
  
  const handleLeaveRoom = async () => {
    if (!call) {
      console.error("Call object is not defined");
      navigate("/main");
      return;
    }
    
    try {
      await call.leave();
      setCall(undefined);
      navigate("/main");
    } catch (error) {
      console.error("Error leaving room:", error);
      setCall(undefined);
      navigate("/main");
    }
  };
  
  const handleLogout = async () => {
    if (call) {
      try {
        await call.leave();
      } catch (error) {
        console.error("Error leaving call during logout:", error);
      }
    }
    
    cookies.remove("token");
    cookies.remove("name");
    cookies.remove("username");
    
    setUser(null);
    setCall(undefined);
    
    navigate("/");
  };
  
  const handleCloseRoom = async () => {
    if (!call) {
      console.error("Call object is not defined");
      navigate("/main");
      return;
    }
    
    try {
      await call.leave();
      setCall(undefined);
      navigate("/main");
    } catch (error) {
      console.error("Error closing room:", error);
      setCall(undefined);
      navigate("/main");
    }
  };
  
  // For non-owners, handle Request to Speak by sending a permission request and showing a toast
  const handleRequestSpeak = async () => {
    try {
      await requestPermission();
      toast.success("Request sent");
    } catch (error) {
      console.error("Error sending request", error);
      toast.error("Failed to send request");
    }
  };

  return (
    <div className="room">
      <h2 className="title">{custom?.title ?? "<Title>"}</h2>
      <h3 className="description">{custom?.description ?? "<Description>"}</h3>
      <p className="participant-count">{participants.length} participants</p>
      <Participants />
      {isRoomOwner ? (
        <>
          {/* Room owner: show incoming permission requests and controls */}
          <PermissionRequestsPanel />
          <div className="owner-controls">
            <Controls />
            <div className="room-actions">
              <button className="close-room-btn" onClick={handleCloseRoom}>
                Close Room
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Non-owners: if permission is not granted, show "Request to Speak"; otherwise, show controls */}
          {!effectiveHasPermission && (
            <button className="request-permission-btn" onClick={handleRequestSpeak}>
              &#9995; Request to Speak
            </button>
          )}
          {effectiveHasPermission && <Controls />}
          <div className="room-actions">
            <button className="leave-room-btn" onClick={handleLeaveRoom}>
              Leave Room
            </button>
          </div>
        </>
      )}
    </div>
  );
};
