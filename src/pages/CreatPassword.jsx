import React, { useEffect, useState } from "react";
import { Link , useNavigate, useParams} from "react-router-dom";
import logo from "./../utils/Images/allen_logo.jpeg";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify"; // react tostify
import axios from "axios";
import { useLocation } from 'react-router-dom';

const CreatPassword = () => {
  
const navigate= useNavigate()
const location = useLocation()
const token = new URLSearchParams(location.search).get('token')

console.log(token,'token')

  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  function toggleNewPasswordVisibility() {
    setIsNewPasswordVisible((prevState) => !prevState);
  }
  function toggleConfirmPasswordVisibility() {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  }

  const onSubmit = async (data) => {
    console.log("data", data);
    const postData = {
      password: data.Confirmpassword,
      
    };
    if (data.newpassoword === data.Confirmpassword) {
      try {
        // Perform your API call here
        // const response = await axios.post("your_api_endpoint", {
        //   newpassword: data.newpassoword,
        //   // other data needed for the API call
        // });
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/passwordUpdate?token=${token}`, postData).then(()=>{
          toast.success("Password Successfully Created.. ", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              marginBottom: "4vw",
              fontSize: "1.5em",
              width: "400px",
              padding: "10px",
            },
          });
        
          setTimeout(() => {
            navigate("/");
          }, 3000);
        });


        // Handle the API response accordingly
        console.log(response.data);
        // Continue with any other logic after a successful API call
      } catch (error) {
        // Handle API call errors
        console.error("API call error:", error);
        // setError("An error occurred during the API call.");
      }
    } else {
      setError("Password doesn't match");
    }
  };

  return (
    <div>
   
      <>
        <ToastContainer />
      </>
      <div className="flex  items-center justify-center  py-28  px-4 ">
        <div className="  border  bg-slate-100    " style={{ width: "35vw" }}>
          <div className=" mt-2">
            <img
              className="mx-auto   h-20  w-20"
              src={logo}
              alt="Your Company"
            />
            <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create Password
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
              <div className=" m-2">
                <label for="password" className="sr-only">
                  New Password
                </label>
                <input
                  {...register("newpassoword", {
                    required: "field is required",
                    pattern: {
                      value: /^.{8}$/,
                      message: "Must be Min 8 characters",
                    },
                  })}
                  
                  type={isNewPasswordVisible ? "text" : "password"}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  sm:text-sm"
                  placeholder="New Password"
                />
                <div>
                  {errors.newpassoword && (
                    <span className="validationcolor">
                      {errors.newpassoword.message}
                      {" *"}
                    </span>
                  )}
                </div>

                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={isNewPasswordVisible}
                    onChange={toggleNewPasswordVisibility}
                  />
                  <span
                    className={`text-sm ${
                      isNewPasswordVisible ? "text-blue-500" : "text-gray-600"
                    } transition-colors duration-300`}
                  >
                    Show password
                  </span>
                </label>
              </div>
              <div className=" m-2">
                <label for="password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  {...register("Confirmpassword", {
                    required: "field is required",
                    pattern: {
                      value: /^.{8}$/,
                      message: "Must be Min 8 characters",
                    },
                  })}
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  sm:text-sm"
                  placeholder="Confirm Password"
                />
                <div>
                  {errors.Confirmpassword && (
                    <span className="validationcolor">
                      {errors.Confirmpassword.message}
                      {" *"}
                    </span>
                  )}
                </div>

                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={isConfirmPasswordVisible}
                    onChange={toggleConfirmPasswordVisibility}
                  />
                  <span
                    className={`text-sm ${
                      isConfirmPasswordVisible
                        ? "text-blue-500"
                        : "text-gray-600"
                    } transition-colors duration-300`}
                  >
                    Show password
                  </span>
                </label>
              </div>
            </div>

            <div className=" m-2   ">
              <div className=" mb-8 ">
                <button
                  type="submit"
                  className=" group relative flex w-full justify-center  border border-transparent  bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  "
                >
                  Submit
                </button>
                {error && (
                  <p className="error-message mt-1" style={{ color: "red" }}>
                    {error}
                  </p>
                )}{" "}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatPassword;
