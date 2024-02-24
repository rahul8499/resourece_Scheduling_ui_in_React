// import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "./../utils/Images/allen_logo.jpeg";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify"; // react tostify
import axios from "axios";
import TableHeader from "../components/TableHeader/TableHeader";
import LocationContext from "../context/LocationContext";
import Loader from "../components/Loader";
import { getApiService } from "../Services/Services";
// import LocationContext from "../../src/context/LocationContext";

const CreateUser = () => {
  const locationgetURL = `${process.env.REACT_APP_API_URL}/getlocation?q=&limit=20&page=1&name=1&sortBy=name&sortOrder=DESC`;

  const { loaderMessage, setLoaderMessage, setLoading, loading } =
    useContext(LocationContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [locationState, setLocationState] = useState([]);
  const { selectedLocation, setSelectedLocation } = useContext(LocationContext);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const getLocation = async () => {
    const Response = await axios.get(locationgetURL);
    if (Response) {
      // console.log("locationData", Response.data)
      setLocationState(Response.data);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);


  const onSubmit = async (data) => {
    console.log("data", data);
    setLoading(true);

    let forgotMessage = `Process is underway. Kindly wait for a while. Avoid refreshing the page.`;

    setLoaderMessage(<pre>{forgotMessage}</pre>);

    const postData = {
      email: data.email,
      contactNumber: data.phoneNumber,
      location_id : data.location, 
      name : data.username      

    };

    console.log("postData", postData);
    try {
      // Make the API request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users`,
        postData
      );
      setLoading(false);

      let createUserMessage = `Process is underway. Kindly wait for a while. Avoid refreshing the page.`;

      setLoaderMessage(<pre>{createUserMessage}</pre>);
      // If the request is successful (status code 2xx)
      toast.success("Record Successfully Created.. ", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          marginBottom: "4vw",
          fontSize: "1.2em",
          width: "400px",
          padding: "10px",
        },
      });

      setTimeout(() => {
        navigate("/user");
      }, 3000);
    } catch (error) {
      setLoading(false);

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
        setLoading(false);

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
      <section>
        <TableHeader
          breadcrumbs={[
            { name: "Schedule", path: "/schedule" },
            ,
            { name: "Users", path: "/user" },
            { name: "Create User" },
          ]}
        />
      </section>
      <div style={{height:"40vw"}} className="  bg-secondaryColour   overflow-y-auto   ">
        <div className="flex  items-center justify-center  py-24  px-4   ">
          <div className="  border  bg-slate-200    " >
            <div className=" mt-2 ">
              <img
                className="mx-auto  rounded-full  h-16  w-16"
                src={logo}
                alt="Your Company"
              />
              <h2 className=" text-center text-2xl  tracking-tight text-gray-900 font-bold text-primary">
                Create User
              </h2>
            </div>
            <form
              className="mt-8 space-y-6"
              method="POST"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input type="hidden" name="remember" value="true" />
              <div className=" rounded-md   ">
                <div className=" m-2 ">
                  <input type="text"  {...register("username", {
                      required: "field is required",
                      
                    })} 
                    autoComplete="off"
                    className="relative text-base block w-full appearance-none   border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none "
                    placeholder="Name"
                    />
                  <div>
                    {errors.username && (
                      <span className="validationcolor">
                        {errors.username.message}
                        {" *"}
                      </span>
                    )}
                  </div>
                </div>

                <div className=" m-2 ">
              
                  <input
                    {...register("email", {
                      required: "field is required",
                    })}
                    id="email"
                    name="email"
                    type="email"
               
                    // autoComplete=""
                    autoComplete="off"
                    className="relative text-base block w-full appearance-none   border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none "
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
                  <input
                    {...register("phoneNumber", {
                      required: "Field is required",
                    })}
                    autoComplete="off"
                    type="number"
                    className="relative text-base block w-full appearance-none rounded-none  border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10  focus:outline-none  "
                    placeholder="Phone Number"
                  />
                  <div>
                    {errors.phoneNumber && (
                      <span className="validationcolor">
                        {errors.phoneNumber.message}
                        {" *"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between m-2   ">
                  <select
                    id="countries"
                    name="location_id"
                    // value={selectedLocation}
                    onChange={handleLocationChange}
                    {...register("location", {
                      required: "field is required",
                    })}
                    
                    className={`  bg-white border border-gray-300  text-base block p-1.5 sans-serif   dark:border-gray-200 dark:placeholder-gray-400  font-bold  hover:border-blue-900 hover:border-opacity-200 `}
                    style={{ width: "40rem", height: "2.6rem" , outline:"none", border:"none",   menu: (provided) => ({
                      ...provided,
                      maxHeight: "156px", // Set maximum height of the dropdown menu
                      overflowY: "auto", // Add scrollbar when content overflows
                    }),}}
                  
                    
                  >
                    <option value="">Select Location</option>
                    {locationState.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  
                </div>
                <div className=" ml-2">
                    {errors.location && (
                      <span className="validationcolor">
                        {errors.location.message}
                        {" *"}
                      </span>
                    )}
                  </div>
              </div>

              <div className=" m-2   ">
                <div className=" mb-8 ">
                  <button
                    type="submit"
                    className=" group  text-base relative flex w-full justify-center  border border-transparent  bg-blue-500 py-1 px-4  font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  "
                  >
                    Create
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

export default CreateUser;
