import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "./../utils/Images/allen_logo.jpeg";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify"; // react tostify
import axios from "axios";
import TableHeader from "../components/TableHeader/TableHeader";
import { getApiService } from "../Services/Services";
import LocationContext from "../context/LocationContext";
import Select from "react-select";

const UserEdit = () => {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const [email, setEmail] = useState("");
  const [ContactNumber, setContactNumber] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const userDataURL = `${process.env.REACT_APP_API_URL}/getByIdUser/${id}`;
  const { setSelectedLocation } = useContext(LocationContext);

  const [locationData, setLocationData] = useState([]);

  const locationURL = `${process.env.REACT_APP_API_URL}/getlocation?q=&limit=&page=&name=&sortBy=name&sortOrder=DESC`;

  const getLocationData = async () => {
    const Response = await getApiService(locationURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return { label: response.name, value: response.id };
        });
        setLocationData(mappingResponse);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getLocationData();
  }, []);
  const [userData, setUserData] = useState([]);
  const fetchUserData = async () => {
    try {
      const Response = await getApiService(userDataURL);
      if (Response) {
        setUserData(Response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDataOfUserById = async () => {
    if (id) {
      setIsEditMode(true);
      fetchUserData();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDataOfUserById();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode && userData && userData.user && userData.user.email) {
      setValue("email", userData.user.email);
      setEmail(userData.user.email);
    }
  }, [isEditMode, userData]);
  useEffect(() => {
    if (
      isEditMode &&
      userData &&
      userData.user &&
      userData.user.contact_number
    ) {
      setContactNumber(userData.user.contact_number);
      setValue("phoneNumber", userData.user.contact_number);
    }
  }, [isEditMode, userData]);
  useEffect(() => {
    if (isEditMode && userData.user) {
      setUserName(userData.user.name);
      setValue("username", userData.user.name);
    }
  }, [isEditMode, userData]);
  useEffect(() => {
    if (isEditMode && userData.user && locationData.length > 0) {
      const userLocationId = userData.user.location.id;
      const selectedLocationOption = locationData.find(
        (option) => option.value === userLocationId
      );
      if (selectedLocationOption) {
        setValue("locations", selectedLocationOption);
      }
    }
  }, [isEditMode, userData, locationData]);

  const onSubmit = async (data) => {
    const postData = {
      email: data.email,
      contactNumber: data.phoneNumber,
      location_id: data.locations.value,
      name: data.username,
    };

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/updateUser/${id}`,
        postData
      );

      toast.success("Record Successfully Updated.. ", {
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
            fontSize: "1.2em",
            width: "400px",
            padding: "10px",
          },
        });
      } else {
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
      <>
        <ToastContainer />
      </>
      <section>
        <TableHeader
          breadcrumbs={[
            { name: "Schedule", path: "/schedule" },
            ,
            { name: "Users", path: "/user" },
            { name: "Edit User" },
          ]}
        />
      </section>
      <div
        style={{ height: "40vw" }}
        className="  bg-secondaryColour   overflow-y-auto   "
      >
        <div className="flex  items-center justify-center  py-24  px-4   ">
          <div className="  border  bg-slate-200    ">
            <div className=" mt-2 ">
              <img
                className="mx-auto  rounded-full  h-16  w-16"
                src={logo}
                alt="Your Company"
              />
              <h2 className=" text-center text-2xl  tracking-tight text-gray-900 font-bold text-primary">
                Update User
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
                  <input
                    type="text"
                    {...register("username", {
                      required: "field is required",
                    })}
                    defaultValue={userName}
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
                    defaultValue={email}
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
                    defaultValue={ContactNumber}
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
                  <Select
                    options={locationData}
                    className=" text-sm"
                    {...register("locations", { required: true })}
                    onChange={(selectedOptions) => {
                      setValue("locations", selectedOptions);
                    }}
                    value={watch("locations")}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: "white",
                        borderRadius: 0,
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        height: "24px",
                        width: "40rem",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: "156px",
                        overflowY: "auto",
                      }),
                    }}
                  />
                </div>
                <div className=" ml-2">
                  {errors.locations && (
                    <span className="validationcolor">
                      {errors.locations.message}
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
                    Update
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

export default UserEdit;
