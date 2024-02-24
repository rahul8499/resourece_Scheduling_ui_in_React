// import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./../utils/Images/allen_logo.jpeg";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify"; // react tostify
import axios from "axios";

const Login = () => {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const onSubmit = async (data) => {
    // console.log(e)
    const { email, password } = data;

    // e.preventDefault(); // form submit jalyavr page reload nahi honar
    const postData = {
      //post data
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        postData
      );

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        window.location.reload();
      } else {
        setError("Token not received.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Unauthorized: Please check your credentials.");
      } else {
        console.error("An error occurred:", error);
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className=" font-serif bg-secondaryColour     h-screen   " >

    <div className="flex  items-center justify-center  py-36   px-4  "  >
    <div className="  border  bg-slate-100    " style={{width:"35vw"}}>
          <div className=" mt-2">
            <img
              className="mx-auto  h-16  w-16"
              src={logo}
              alt="Your Company"
            />
            <h2 className="mt-1 text-center text-xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form
            // onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md   ">
              <div className=" m-2 ">
                <label for="email" className="sr-only">
                  Email address
                </label>
                <input
                  {...register("email", {
                    required: "field is required",
                  })}
                  id="email"
                  name="email"
                  type="email"
                  autoFocus
                  // autoComplete=""
                  autoComplete="off"
                  className="relative  text-lg  block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  "
                  placeholder="Email address"
                />
                <div>
                  {errors.email && (
                    <span className="validationcolor">
                      {errors.email.message}
                      {" *"}
                    </span>
                  )}
                </div>
              </div>
              <div className=" m-2">
                <label for="password" className="sr-only">
                  Password
                </label>
                <input
                  {...register("password", {
                    required: "field is required",
                  })}
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  autocomplete="current-password"
                  className="relative   text-lg block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  "
                  placeholder="Password"
                  autoComplete="off"
                />
                <div>
                  {errors.password && (
                    <span className="validationcolor">
                      {errors.password.message}
                      {" *"}
                    </span>
                  )}
                </div>

                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={isPasswordVisible}
                    onChange={togglePasswordVisibility}
                  />
                  <span
                    className={`text-base ${
                      isPasswordVisible ? "text-blue-500" : "text-gray-600"
                    } transition-colors duration-300`}
                  >
                    Show password
                  </span>
                </label>
              </div>
            </div>

            <div
              className="flex items-center justify-between m-2   "
              style={{ float: "right" }}
            >
              <div className="text-sm mb-4">
                <Link to="/forgot">
                  <a
                    href="#"
                    className="font-medium  text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>{" "}
                </Link>
              </div>
            </div>

            <div className=" m-2   ">
              <div className=" mb-8 ">
                <button
                  type="submit"
                  className=" group text-base relative flex w-full justify-center  border border-transparent  bg-blue-500 py-1 px-4  font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  "
                >
                  Sign in
                </button>
                {error && (
                  <p className="error-message mt-1" style={{ color: "red" }}>
                    Please check your credentials.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
