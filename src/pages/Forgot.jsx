// import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate,  } from "react-router-dom";
import logo from "./../utils/Images/allen_logo.jpeg";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify"; // react tostify
import axios from "axios";
import TableHeader from "../components/TableHeader/TableHeader";
import LocationContext from "../context/LocationContext";
import Loader from '../components/Loader'
const Forgot = () => {
  const {
    loaderMessage,
   setLoaderMessage,
   setLoading,
   loading
   

  } = useContext(LocationContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
 
  const onSubmit = async (data) => {
    setLoading(true);

    let forgotMessage = `Process is underway. Kindly wait for a while. Avoid refreshing the page.`;

    setLoaderMessage(<pre>{forgotMessage}</pre>);

    console.log("data", data);
  
    const postData = {
      "email": data.email,
     
    };
  
    console.log("postData", postData);
    try {
      // Make the API request
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/password/forgot`, postData);
         setLoading(false)
      // If the request is successful (status code 2xx)
      toast.success("Email Successfully Send.. ", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
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
      }, 2000);
    
    } catch (error) {
      console.log("error", error.response.data.errors.email);
      // If there is an error (status code is not 2xx)
      if (error.response && error.response.status === 422) {
   
        toast.error(`Error: ${error.response.data.errors.email}`, {
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
      } else {
        // The request was made, but no response was received or a different status code was returned
        toast.error("Error: Something went wrong", {
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
      }
    }
    
    

  };

 

  return (
    <div>
      {loading && <Loader message={loaderMessage} />}

        <>
          <ToastContainer />
        </>
     
      <div className=" font-serif bg-secondaryColour     h-screen   " >

      <div className="flex  items-center justify-center   py-36  px-4  "  >
      <div className="  border  bg-slate-100    " style={{width:"35vw"}}>
        <div>
            <img
              className="mx-auto   rounded-full   h-16  w-16 mt-2"
              src={logo}
              alt="Your Company"
            />
            <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-1 text-center text-sm text-gray-600">
              Or
              <Link to="/" className="pl-1 ">Login</Link>
            </p>
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
                {/* <label for="email" className="sr-only">
                  Email address
                </label> */}
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
                  className="relative text-xl block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  sm:text-sm"
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
            
            </div>

            <div
              className="flex items-center justify-between m-2   "
              style={{ float: "right" }}
            >
              {/* <div className="text-sm mb-4">
                <Link to="/forgot">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>{" "}
                </Link>
              </div> */}
            </div>

            <div className=" m-2   ">
              <div className=" mb-8 ">
                <button
                  type="submit"
                  className=" group relative flex w-full justify-center  border border-transparent  bg-blue-500 py-1 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  "
                >
              Submit
                </button>
            
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Forgot;
