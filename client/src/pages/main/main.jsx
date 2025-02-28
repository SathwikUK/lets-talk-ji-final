// src/pages/main/main.jsx
import React, { useEffect, useState } from 'react';
import { StreamVideo } from '@stream-io/video-react-sdk';
import { Navigate, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useUser } from '../../user-context';
import talk from '../../voice1.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Main = () => {
  const { client, user, setCall, isLoading } = useUser();
  const [newRoom, setNewRoom] = useState({ name: "", description: "" });
  const [rooms, setRooms] = useState([]);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joiningRoomId, setJoiningRoomId] = useState(null);
  const navigate = useNavigate();

  // Initial fetch and polling every 3 seconds for real-time updates
  useEffect(() => {
    if (client) {
      fetchListOfCalls();
      const interval = setInterval(() => {
        fetchListOfCalls();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [client]);

  const hashRoomName = (roomName) => {
    const hash = CryptoJS.SHA256(roomName).toString(CryptoJS.enc.Base64);
    return hash.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const createRoom = async () => {
    const { name, description } = newRoom;
    if (!client || !user) {
      toast.error("User not authenticated");
      return;
    }
    
    if (!name || !description) {
      toast.error("Room name and description are required");
      return;
    }
    
    setCreatingRoom(true);
    const roomID = hashRoomName(name);
    const call = client.call("audio_room", roomID);

    try {
      await call.join({
        create: true,
        data: {
          members: [{ user_id: user.username }],
          // Store the room owner in custom data
          custom: { title: name, description, owner: user.username },
        },
      });
      setCall(call);
      navigate(`/room/${roomID}`);
    } catch (error) {
      console.error("Error while creating room", error);
      toast.error("Error while creating room. Please try again.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const fetchListOfCalls = async () => {
    try {
      const callsQueryResponse = await client?.queryCalls({
        filter_conditions: { ongoing: true },
        limit: 25,
        watch: true,
      });

      if (!callsQueryResponse) {
        console.log("Error fetching calls");
        return;
      }

      const getCallInfo = async (call) => {
        const callInfo = await call.get();
        const customData = callInfo.call.custom || {};
        const { title, description, owner } = customData;
        const participantsLength = callInfo.members.length ?? 0;
        // Use the custom owner if available
        const createdBy = owner || callInfo.call.created_by?.name || "";
        const id = callInfo.call.id ?? "";

        return {
          id,
          title: title ?? "",
          description: description ?? "",
          participantsLength,
          createdBy,
        };
      };

      const roomPromises = callsQueryResponse.calls.map((call) => getCallInfo(call));
      const rooms = await Promise.all(roomPromises);
      setRooms(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load available rooms");
    }
  };

  const joinRoom = async (roomId) => {
    if (joiningRoomId) return;
    
    setJoiningRoomId(roomId);
    const call = client?.call("audio_room", roomId);
    try {
      await call?.join();
      setCall(call);
      navigate("/room/" + roomId);
    } catch (err) {
      toast.error("Error while joining the room. Please wait for the room to be live.");
    } finally {
      setJoiningRoomId(null);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (!user || !client) return <Navigate to="/sign-in" />;

  return (
    <StreamVideo client={client}>
      <div className="home">
        <ToastContainer position="top-right" autoClose={5000} />
        <h1>Welcome, {user?.username}</h1>
        <div className="form">
          <h2>Create Your Own Room</h2>
          <input
            placeholder="Room Name..."
            onChange={(e) => setNewRoom((prev) => ({ ...prev, name: e.target.value }))}
            disabled={creatingRoom}
          />
          <input
            placeholder="Room Description..."
            onChange={(e) => setNewRoom((prev) => ({ ...prev, description: e.target.value }))}
            disabled={creatingRoom}
          />
          <button
            onClick={createRoom}
            style={{ backgroundColor: "rgb(125, 7, 236)" }}
            disabled={creatingRoom}
          >
            {creatingRoom ? "Creating Room..." : "Create Room"}
          </button>
        </div>
        <h2>{rooms.length > 0 ? "Available Rooms" : "No rooms available"}</h2>
        <div className="grid">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div 
                className="card" 
                key={room.id} 
                onClick={() => !joiningRoomId && joinRoom(room.id)}
                style={{ 
                  position: 'relative',
                  cursor: joiningRoomId ? 'not-allowed' : 'pointer' 
                }}
              >
                <h4>{room.title}</h4>
                <p>{room.description}</p>
                <p>{room.participantsLength} Participants</p>
                <p>Created By: {room.createdBy}</p>
                <div className="shine"></div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
        <div className="right-side-image">
          <img src={talk} alt="Description" />
        </div>
        {(creatingRoom || joiningRoomId) && (
          <div className="advanced-loader">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </StreamVideo>
  );
};

export default Main;
