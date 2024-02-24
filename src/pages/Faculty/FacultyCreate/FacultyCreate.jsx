import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import "./FacultyCreate.css";
import { toast } from "react-toastify";
import { getApiService } from "../../../Services/Services";

const locationURL = `${process.env.REACT_APP_API_URL}/getlocation?q=&limit=2&page=1&name=1&sortBy=name&sortOrder=DESC`;
const batchSloteURL = `${process.env.REACT_APP_API_URL}/getBatchslot?q=&limit=5&page=1&name=1&sortBy=name&sortOrder=DESC`;
const subjectURL = `${process.env.REACT_APP_API_URL}/getSubject`;

const FacultyCreate = () => {
  const [defaultBatchSlot, setDefaultBatchSlot] = useState(null);

  const [locationData, setlocationData] = useState([]);
  const [batchSlotData, setBatchSlotData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLatName] = useState("");
  const [address, setAddress] = useState("");

  const [facultyCode, setFacultyCode] = useState("");

  const handleFacultyCodeChange = (e) => {
    const capitalizedValue = e.target.value.toUpperCase();
    setFacultyCode(capitalizedValue);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(URL.createObjectURL(file));
  };

  const handleFirstNameChange = (event) => {
    const words = event.target.value.split(" ");
    const capitalizedWords = words.map((word) => {
      if (word.length > 0) {
        const lowercaseWord = word.toLowerCase();
        return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
      }
      return word;
    });
    const capitalizedValue = capitalizedWords.join(" ");
    setFirstName(capitalizedValue);
  };
  const handleLastNameChange = (event) => {
    const words = event.target.value.split(" ");
    const capitalizedWords = words.map((word) => {
      if (word.length > 0) {
        const lowercaseWord = word.toLowerCase();
        return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
      }
      return word;
    });
    const capitalizedValue = capitalizedWords.join(" ");
    setLatName(capitalizedValue);
  };

  const handleAddressChange = (event) => {
    const words = event.target.value.split(" ");
    const capitalizedWords = words.map((word) => {
      if (word.length > 0) {
        const lowercaseWord = word.toLowerCase();
        return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
      }
      return word;
    });
    const capitalizedValue = capitalizedWords.join(" ");
    setAddress(capitalizedValue);
  };

  const getLocationData = async () => {
    const Response = await getApiService(locationURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return {
            label: response.name,
            value: response.name,
            id: response.id,
          };
        });
        setlocationData(mappingResponse);
      } catch (error) {
        return error;
      }
    }
  };

  const getBatchSlotData = async () => {
    const Response = await getApiService(batchSloteURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return {
            label: response.name,
            value: response.name,
            id: response.id,
          };
        });
        setDefaultBatchSlot(mappingResponse);
        setBatchSlotData(mappingResponse);
      } catch (error) {
        return error;
      }
    }
  };

  const getSubjectData = async () => {
    const Response = await getApiService(subjectURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return {
            label: response.subject_name,
            value: response.subject_name,
            id: response.id,
          };
        });

        setSubjectData(mappingResponse);
      } catch (error) {
        return error;
      }
    }
  };

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    async function fetchData() {
      await getLocationData();
      await getBatchSlotData();
      await getSubjectData();
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (defaultBatchSlot) {
      setValue("batchSlot", [defaultBatchSlot]);
    }
  }, [defaultBatchSlot, setValue]);

  const isBatchSlotDataLoaded = batchSlotData.length > 0;
  const defaultBatchSlotValues = isBatchSlotDataLoaded
    ? [batchSlotData[0], batchSlotData[1]] // Pass an array of selected options
    : null;
  

  const onSubmit = async (data) => {
    const subjectIds = data.subject.map((item) => item.id);
    const locationIds = data.locations.map((item) => item.id);
    const batchSlotIds = data.batchSlot.flatMap((nestedArray) => nestedArray.map(item => item.id));

   
    const profilePicFile = data.profilePic[0];

    const formData = new FormData();
    formData.append("first_name", data.firstname);
    formData.append("last_name", data.lastname);

    formData.append("mail", data.email);
    formData.append("phone", data.phoneNumber);
    formData.append("address", data.address);
    formData.append("gender", data.gender);
    formData.append("faculty_code", data.facultyCode);
    subjectIds.forEach((id) => formData.append("subject_id[]", id));
    formData.append("age", data.age);
    formData.append("experience", data.experience);
    formData.append("image", profilePicFile);
    locationIds.forEach((id) => formData.append("location_id[]", id));
    batchSlotIds.forEach((id) => formData.append("batch_slot_id[]", id));
    try {
      const response = await axios.post(
        "http://dev.allen-api.com:5020/api/createfaculty",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
        navigate("/facultylist");
      }, 3000);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div className="  ">
        <>
          <ToastContainer />
        </>
        <TableHeader
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Faculty List", path: "/facultylist" },
            { name: "Faculty Create" },
          ]}
        />

        <div className="  ml-4 mr-4  pb-6   mb-4  ">
          <form onSubmit={handleSubmit(onSubmit)} style={{height:"37vw"}} className="   overflow-y-auto bg-secondaryColour">
            <div className=" mt-2 ">
              <div className="  grid grid-cols-12 ml-6 pt-3  font-serif ">
                <div className="col-span-6">
                  <label className="text-base mb-1 mt-3 font-serif text-primary">
                    Faculty Code:
                  </label>
                  <div>
                    <input
                      id="facultyCode"
                      type="text"
                      autoFocus
                      placeholder=" Faculty Code"
                      style={{ height: "30px", outline: "none" }}
                      value={facultyCode}
                      {...register("facultyCode", {
                        required: "This is required",
                      })}
                      onChange={handleFacultyCodeChange}
                      className="input"
                      autoComplete="off"
                    />
                    <div>
                      {errors.facultyCode && (
                        <span className="validationcolor">
                          {errors.facultyCode.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" col-span-6">
                  <label className=" font-serif text-base  mb-1 mt-3 text-primary">
                    First Name:
                  </label>
                  <div>
                    <input
                      id="firstname"
                      type="text"
                      placeholder=" First Name"
                      style={{ height: "30px", outline: "none" }}
                      {...register("firstname", {
                        required: "This is required",

                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "This is not a valid First Name",
                        },
                        validate: {
                          startsWithLetter: (value) =>
                            /^[A-Za-z][^\s]*$/.test(value) ||
                            "First character should be a letter and spaces are not allowed as the first character",
                        },

                        minLength: {
                          value: 3,
                          message:
                            "First Name must be at least 3 characters long",
                        },
                        maxLength: {
                          value: 15,
                          message:
                            "First Name can be at most 10 characters long",
                        },
                      })}
                      className="input   "
                      onChange={handleFirstNameChange}
                      value={firstName}
                      autoComplete="off"
                    />
                    <div>
                      {errors.firstname && (
                        <span className="validationcolor">
                          {errors.firstname.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" col-span-6 mt-1 ">
                  <label className="text-base font-serif  mb-1 mt-3 text-primary">
                    Last Name:
                  </label>
                  <div>
                    <input
                      id="lastname"
                      type="text"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Last Name"
                      autoComplete="off"
                      {...register("lastname", {
                        required: "This is required",

                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "This is not a valid First Name",
                        },
                        validate: {
                          startsWithLetter: (value) =>
                            /^[A-Za-z][^\s]*$/.test(value) ||
                            "First character should be a letter and spaces are not allowed as the first character",
                        },

                        minLength: {
                          value: 3,
                          message:
                            "First Name must be at least 3 characters long",
                        },
                        maxLength: {
                          value: 15,
                          message:
                            "First Name can be at most 10 characters long",
                        },
                      })}
                      className="input  "
                      onChange={handleLastNameChange}
                      value={lastName}
                    />
                    <div>
                      {errors.lastname && (
                        <span className="validationcolor">
                          {errors.lastname.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" col-span-6 mt-1">
                  <label className=" text-base  font-serif  mb-1 mt-3 text-primary">
                    Email:
                  </label>
                  <div>
                    <input
                      id="email"
                      type="email"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Email"
                      autoComplete="off"
                      {...register("email", {
                        required: "This is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className={`input     border-gray-400 `}
                    />
                    <div>
                      {errors.email && (
                        <span className="validationcolor">
                          {errors.email.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-6 mt-1">
                  <label className="text-base mb-1  text-primary font-serif ">
                    Phone No:
                  </label>
                  <div>
                    <input
                      id="number"
                      type="number"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Contact"
                      autoComplete="off"
                      {...register("phoneNumber", {
                        required: "This is required",
                        pattern: {
                          value: /^(\+\d{1,3}[- ]?)?[1-9]\d{9}$/,
                          message: "This is not a valid phone number",
                        },
                      })}
                      className="input"
                    />
                    <div>
                      {errors.phoneNumber && (
                        <span className="validationcolor">
                          {errors.phoneNumber.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className=" col-span-4 mt-1"
                  style={{ width: "30vw", outline: "none" }}
                >
                  <label className="text-base mb-1  text-primary font-serif ">
                    Center Locations:
                  </label>
                  <Select
                    isMulti
                    options={locationData}
                    {...register("locations", { required: true })}
                    onChange={(selectedOptions) => {
                      setValue("locations", selectedOptions);
                    }}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: "white",
                        borderRadius: 0,
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        height: "22px",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                    }}
                  />
                  <div>
                    {errors.locations && (
                      <p className="error validationcolor">
                        This is required {"*"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-span-2 mt-1"></div>

                <div className=" col-span-6  font-serif  ">
                  <label className="text-base mb-1  text-primary font-serif  ">
                    Gender:
                  </label>
                  <div>
                    <select
                      {...register("gender", { required: true })}
                      style={{ height: "30px", width: "30vw", outline: "none" }}
                      className=" bg-white font-serif  "
                      placeholder="Select Gender"
                    >
                      <option value="" disabled selected>
                        Select Gender
                      </option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>

                    <div>
                      {errors.gender && errors.gender.type === "required" && (
                        <span className="validationcolor font-serif ">
                          This is required {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" col-span-6  mt-1  font-serif ">
                  <label className="text-base mb-1 mt-3 text-primary">Age:</label>
                  <div>
                    <input
                      id="age"
                      type="number"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Age"
                      {...register("age", {
                        required: "This is required",
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Please enter a valid age   ",
                        },
                      })}
                      className={`input   `}
                    />
                    <div>
                      {errors.age && (
                        <span className="validationcolor">
                          {errors.age.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" col-span-6 ">
                  <label className=" text-base mb-1  text-primary font-serif ">
                    Faculty Experience:
                  </label>
                  <div>
                    <input
                      id="experience"
                      type="text"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Experience"
                      autoComplete="off"
                      {...register("experience", {
                        required: "This is required",
                        // pattern: {
                        //   value: /^[0-9]*$/,
                        //   message: "Please enter a valid age",
                        // },
                      })}
                      className={`input   border-gray-400 `}
                    />
                    <div>
                      {errors.experience && (
                        <span className="validationcolor">
                          {errors.experience.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-6 rounded-sm mt-1">
                  <label className="text-base mb-1  text-primary font-serif ">
                    Address:
                  </label>
                  <div>
                    <input
                      id="address"
                      type="text"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Address"
                      autoComplete="off"
                      {...register("address", {
                        required: "This is required",

                        pattern: {
                          value: /^[a-zA-Z0-9\s]+$/,
                          message:
                            "Special characters are not allowed in the address",
                        },
                      })}
                      onChange={handleAddressChange}
                      value={address}
                      className={`input border-gray-400`}
                    />
                    <div className="font-serif ">
                      {errors.address && (
                        <span className="validationcolor">
                          {errors.address.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className=" col-span-4  "
                  style={{ width: "30vw", outline: "none" }}
                >
                  <label className="text-base mb-1 text-primary">
                    Subjects:
                  </label>
                  <Select
                    isMulti
                    className="  "
                    options={subjectData}
                    {...register("subject", { required: true })}
                    onChange={(selectedOptions) => {
                      setValue("subject", selectedOptions);
                    }}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: "white",
                        borderRadius: 0,
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        height: "30px",
                        
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: "156px", // Set maximum height of the dropdown menu
                        overflowY: "auto", // Add scrollbar when content overflows
                      }),
                    }}
                  />
                  <div>
                    {errors.subject && (
                      <p className="error validationcolor ">
                        This is required {"*"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-2"></div>

                <div className="  col-span-4 mt-1 font-serif " style={{ width: "30vw" }}>
                  <label className="text-base mb-1 mt-3 text-primary">
                    Prefered Slots:
                  </label>
                  {isBatchSlotDataLoaded ? (
                    <Select
                      placeholder="Batch Slots"
                      isMulti
                      options={batchSlotData}
                      defaultValue={defaultBatchSlotValues}
                      style={{ outline: "none", border: "none" }}
                      {...register("batchSlot", { required: true })}
                      onChange={(selectedOptions) => {
                        setValue("batchSlot", selectedOptions);
                      }}
                      className="custom-select"
                      classNamePrefix="custom-select font-serif "
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          backgroundColor: "white",
                          borderRadius: 0,
                          border: "none",
                          outline: "none",
                          boxShadow: "none",
                          height: "30px",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          color: "black",
                        }),
                      }}
                    />
                  ) : (
                    // Show a loading state or placeholder while data is being fetched
                    <p>Loading batch slots...</p>
                  )}
                  <div>
                    {errors.batchSlot && (
                      <p className="error validationcolor">
                        This is required {"*"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-6 ">
                  <label className="text-base mb-1 text-primary">
                    Profile Photo:
                  </label>
                  <div>
                    <input
                      type="file"
                      id="file"
                      {...register("profilePic", { required: true })}
                      onChange={handleFileChange}
                      style={{ height: "34px", outline: "none" }}
                      className="file-input input bg-white border-gray-400     "
                    />
                    <div>
                      {errors.address && errors.address.type === "required" && (
                        <span className="validationcolor ">
                          This is required {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedFile && (
                    <img
                      src={selectedFile}
                      alt="Preview"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="  col-span-6 	 ml-6  flex mt-4 ">
                <div>
                  <button
                                      className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000  font-medium  text-sm px-5 py-2.5 me-2 "  
                  >
                    Create
                  </button>
                </div>
                <Link to={"/facultylist"} style={{ color: "white" }}>
                  <button
                                      className="text-gray-900   bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800" 

                  >
                    Cancel
                  </button>
                </Link>{" "}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FacultyCreate;
