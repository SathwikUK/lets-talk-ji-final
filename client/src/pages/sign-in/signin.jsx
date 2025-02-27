import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PEOPLE_IMAGES } from '../../Images';
import Cookies from "universal-cookie";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";
import { useNavigate } from "react-router-dom";
import voice from './checkvoice.png';

const Signin = () => {
  const [loading, setLoading] = useState(false);

  // Validation schema using yup
  const schema = yup.object().shape({
    username: yup
      .string()
      .required("Username is Required")
      .matches(/^[a-zA-Z0-9_.@$]+$/, "Invalid Username"),
    name: yup.string().required("Name is Required"),
  });

  const navigate = useNavigate();
  const cookies = new Cookies();
  const { setClient, setUser } = useUser();

  const onSubmit = async (data) => {
    const { username, name } = data;
    setLoading(true);
    try {
      const response = await fetch("https://lets-talk-ji-final.vercel.app/auth/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name,
          image: PEOPLE_IMAGES[Math.floor(Math.random() * PEOPLE_IMAGES.length)],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }

      const responseData = await response.json();
      console.log(responseData);

      const userObj = { id: username, name };

      const myClient = new StreamVideoClient({
        apiKey: "3nzxjr64zv64",
        user: userObj,
        token: responseData.token,
      });

      setClient(myClient);
      setUser({ username, name });

      const expires = new Date();
      expires.setDate(expires.getDate() + 1);

      cookies.set("token", responseData.token, { expires });
      cookies.set("username", responseData.username, { expires });
      cookies.set("name", responseData.name, { expires });

      // After successful sign in, navigate to Main page.
      navigate("/main");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while signing in.");
    } finally {
      setLoading(false);
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="home">
      <h1>Let's Talk Baka &#128540;</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username: </label>
          <input type="text" {...register("username")} disabled={loading} />
          {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
        </div>
        <div>
          <label>Name: </label>
          <input type="text" {...register("name")} disabled={loading} />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <div className="img">
        <img src={voice} alt="Voice Check" />
      </div>
      
      {loading && (
        <div className="advanced-loader">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Signin;
