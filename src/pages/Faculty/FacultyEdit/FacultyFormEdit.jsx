import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import { getApiService } from "../../../Services/Services";

const FacultyFormEdit = () => {
  const { id } = useParams();

  const locationURL = `${process.env.REACT_APP_API_URL}/getlocation`;
  const batchSloteURL = `${process.env.REACT_APP_API_URL}/getBatchslot?q=&limit=5&page=1&name=1&sortBy=name&sortOrder=DESC`;
  const subjectURL = `${process.env.REACT_APP_API_URL}/getSubject`;
  const facultyDataURL = `${process.env.REACT_APP_API_URL}/showfacultyById/${id}`;

  const [facultyData, setFacultyData] = useState({});
  const [locationData, setlocationData] = useState([]);
  const [batchSlotData, setBatchSlotData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const fileInputRef = useRef(null);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagePath(file.name);
    setImageFromApi("")
   
    setSelectedImage(file);
  };
 

 
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [getImageFromApi, setImageFromApi] = useState ('')
  
  const fetchFacultyData = async () => {
    try {
      const Response = await getApiService(facultyDataURL);
      if (Response) {
        setFacultyData(Response.data);
       
        setImageFromApi(Response.data.image_url);
     
        setImagePath(Response.data.image_url);

        setValue("profilePic", Response.data.image_url);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const getDataOfFacultyById = async () => {
    if (id) {
      setIsEditMode(true);
      fetchFacultyData();
    }
  };

  const getLocationData = async () => {
    const Response = await getApiService(locationURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return { label: response.name, value: response.id };
        });
        setlocationData(mappingResponse);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getBatchSlotData = async () => {
    const Response = await getApiService(batchSloteURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return { label: response.name, value: response.id };
        });
        setBatchSlotData(mappingResponse);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getSubjectData = async () => {
    const Response = await getApiService(subjectURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return { label: response.subject_name, value: response.id };
        });
        setSubjectData(mappingResponse);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDataOfFacultyById();
      await getLocationData();
      await getSubjectData();
      await getBatchSlotData();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode && facultyData.location) {
      const selectedLocationOptions = locationData.filter((option) =>
        facultyData.location.find(
          (location) => location.pivot.location_id === option.value
        )
      );
      setValue("location", selectedLocationOptions);
    }
  }, [isEditMode, facultyData.location, locationData]);

  useEffect(() => {
    if (isEditMode && facultyData.batch_slot) {
      const selectedBatchSlotOptions = batchSlotData.filter((option) =>
        facultyData.batch_slot.find(
          (batchSlot) => batchSlot.pivot.batch_slot_id === option.value
        )
      );

      setValue("batchSlot", selectedBatchSlotOptions);
    }
  }, [isEditMode, facultyData.batch_slot, batchSlotData]);

  useEffect(() => {
    if (isEditMode && facultyData.subject) {
      const selectedSubjectOptions = subjectData.filter((option) =>
        facultyData.subject.find(
          (subject) => subject.pivot.subject_id === option.value
        )
      );
      setValue("subject", selectedSubjectOptions);
    }
  }, [isEditMode, facultyData.subject, subjectData]);

  const [firstName, setFirstName] = useState(
    isEditMode ? facultyData.first_name : ""
  );
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lastName, setLastName] = useState(
    isEditMode ? facultyData.last_name : ""
  );
  const [age, setAge] = useState(isEditMode ? facultyData.age : "");
  const [experience, setexperience] = useState(
    isEditMode ? facultyData.experience : ""
  );
  const [gender, setGender] = useState(isEditMode ? facultyData.gender : "");
  const [facultyCode, setFacultyCode] = useState("");

  const [address, setAddress] = useState(isEditMode ? facultyData.address : "");

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
    setLastName(capitalizedValue);
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

  useEffect(() => {
    if (isEditMode) {
      setGender(facultyData.gender);

      setFirstName(facultyData.first_name);
      setLastName(facultyData.last_name);
      setAddress(facultyData.address);
      setAge(facultyData.age);
      setEmail(isEditMode ? facultyData.mail : "");
      setPhoneNumber(isEditMode ? facultyData.phone : "");
      setexperience(facultyData.experience);
      setFacultyCode(isEditMode ? facultyData.faculty_code : "");
    }
  }, [
    isEditMode,
    facultyData.first_name,
    facultyData.phone,
    gender,
    facultyData.faculty_code,
  ]);

  useEffect(() => {
    setValue("lastname", lastName);
    setValue("firstname", firstName);
    setValue("address", address);
    setValue("age", age);
    setValue("experience", experience);
    setValue("gender", gender);
    setValue("email", email);
    setValue("phoneNumber", phoneNumber);
    setValue("facultyCode", facultyCode);
  }, [
    lastName,
    firstName,
    address,
    age,
    experience,
    gender,
    email,
    phoneNumber,
    facultyCode,
    setValue,
  ]);
  const handleInputChange = (event) => {
    const inputValue = event.target.value.toUpperCase();

    setFacultyCode(inputValue);
  };

 

  

  const onSubmit = async (data) => {
    const subjectIds = data.subject
      ? data.subject.map((item) => item.value)
      : [];
    const locationIds = data.location.map((item) => item.value);

    const batchSlotIds = data.batchSlot
      ? data.batchSlot.map((item) => item.value)
      : [];

    const profilePicFile =  selectedImage ;



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
    if (getImageFromApi) {
      formData.append("image_url", getImageFromApi);
  } else if (selectedImage) {
      formData.append("image", profilePicFile);
  }
    locationIds.forEach((id) => formData.append("location_id[]", id));
    batchSlotIds.forEach((id) => formData.append("batch_slot_id[]", id));

    try {
      const response = await axios.post(
        `http://dev.allen-api.com:5020/api/updatefaculty/${id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
        navigate("/facultylist");
      }, 3000);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="  ">
        <>
          <ToastContainer />
        </>
        <TableHeader
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Faculty List", path: "/facultylist" },
            {
              name: isEditMode ? "Edit Faculty" : "Create Faculty",
            },
          ]}
        />

<div className="  ml-4 mr-4  pb-6   mb-4  ">
          <form onSubmit={handleSubmit(onSubmit)} style={{height:"38vw"}} className="   overflow-y-auto bg-secondaryColour">
            <div className=" mt-2  font-serif ">
              <div className="  grid grid-cols-12 ml-6 pt-3  ">
                <div className=" col-span-6">
                  <label className="  text-base  mb-1 mt-3 text-primary  font-serif">
                    Faculty Code:
                  </label>
                  <div>
                    <input
                      id="facultyCode"
                      autoFocus
                      type="text"
                      placeholder=" Faculty Code"
                      defaultValue={facultyCode}
                      style={{ height: "30px", outline: "none" }}
                      {...register("facultyCode", {
                        required: "This field is required",
                      })}
                      className="input   "
                      autoComplete="off"
                      onChange={handleInputChange}
                    />
                    <div>
                      {errors.facultyCode && (
                        <span className="validationcolor">
                          {errors.facultyCode.message}
                          {"* "}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" col-span-6">
                  <label className="  text-base font-serif   mb-1 mt-3 text-primary font-sarif">
                    First Name:
                  </label>
                  <div>
                    <input
                      id="firstname"
                      type="text"
                      placeholder=" First Name"
                      style={{ height: "30px", outline: "none" }}
                      {...register("firstname", {
                        required: "This field is required",

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
                      defaultValue={firstName}
                     
                    />
                    <div>
                      {errors.firstname && (
                        <span className="validationcolor">
                          {errors.firstname.message}
                          {" *"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className=" col-span-6 ">
                  <label className="text-base mb-1 mt-3 text-primary font-sarif">
                    Last Name:
                  </label>
                  <div>
                    <input
                      id="lastname"
                      type="text"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Last Name"
                      {...register("lastname", {
                        required: "This field is required",

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
                      defaultValue={lastName} // Set the default value here
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
                  <label className=" text-base mb-1 mt-3 text-primary font-sarif">
                    Email:
                  </label>
                  <div>
                    <input
                      id="email"
                      type="email"
                      style={{ height: "30px", outline: "none" }}
                      defaultValue={isEditMode ? facultyData.mail : ""}
                      placeholder="Email"
                      {...register("email", {
                        required: "This field is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className={`input    border-gray-400 `}
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
                <div className=" col-span-6 mt-1">
                  <label className=" text-base mb-1 mt-3 text-primary font-sarif">
                    Phone No:
                  </label>
                  <div>
                    <input
                      id="number"
                      type="number"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Contact"
                      defaultValue={isEditMode ? facultyData.phone : ""}
                      {...register("phoneNumber", {
                        required: "This field is required",
                        pattern: {
                          value: /^(\+\d{1,3}[- ]?)?[1-9]\d{9}$/,
                          message: "This is not a valid phone number",
                        },
                      })}
                      className=" input   "
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

                <div className="  col-span-4 mt-1" style={{ width: "30vw" }}>
                  <label className="text-base mb-1 mt-3 text-primary font-sarif">
                    Locations:
                  </label>
                  <Select
                    isMulti
                    options={locationData}
                    value={watch("location")}
                    {...register("location", { required: true })}
                    onChange={(selectedOptions) => {
                      setValue("location", selectedOptions);
                    }}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: "white",
                        borderRadius: 0,
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: "black",
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

                <div className=" col-span-2 mt-1"></div>

                <div className=" col-span-6    ">
                  <label className="text-base mb-1 mt-3 text-primary font-sarif ">
                    Gender:
                  </label>
                  <div>
                    <select
                      {...register("gender", { required: true })}
                      style={{ height: "30px", width: "30vw", outline: "none" }}
                      onChange={(e) => setGender(e.target.value)}
                      defaultValue={gender}
                      className=" bg-white  "
                      placeholder="Select Gender"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>

                    <div>
                      {errors.gender && errors.gender.type === "required" && (
                        <span className="validationcolor">
                          This is required {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" col-span-6  mt-1 ">
                  <label className="text-base mb-1 mt-3 text-primary font-sarif">
                    Age:
                  </label>
                  <div>
                    <input
                      id="age"
                      type="number"
                      style={{ height: "30px", outline: "none" }}
                      defaultValue={age}
                      placeholder="Age"
                      {...register("age", {
                        required: "This field is required",
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Please enter a valid age",
                        },
                      })}
                      className={`input     `}
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

                <div className=" col-span-6   ">
                  <label className="text-base mb-1 mt-3 text-primary font-sarif">
                    Experience:
                  </label>
                  <div>
                    <input
                      id="experience"
                      type="text"
                      style={{ height: "30px", outline: "none" }}
                      defaultValue={experience}
                      placeholder="experience"
                      {...register("experience", {
                        required: "This field is required",
                     
                      })}
                      className={`input    `}
                    />
                    <div>
                      {errors.age && (
                        <span className="validationcolor">
                          {errors.experience.message}
                          {"*"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" col-span-6  rounded-sm	 mt-1 ">
                  <label className="text-base mb-1 mt-3 text-primary font-sarif">
                    Address:
                  </label>
                  <div>
                    <input
                      id="address"
                      type="text"
                      style={{ height: "30px", outline: "none" }}
                      placeholder="Address"
                      {...register("address", {
                        required: "This field is required",
                        pattern: {
                          value: /^[a-zA-Z0-9\s]+$/,
                          message:
                            "Special characters are not allowed in the address",
                        },
                      })}
                      onChange={handleAddressChange}
                      defaultValue={address}
                      className={`input    border-gray-400 `}
                    />
                    <div>
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
                  className=" col-span-4 "
                  style={{ width: "30vw", outline: "none" }}
                >
                  <label className="text-base mb-1 mt-3 text-primary font-sarif">
                    Subjects:
                  </label>
                  <Select
                    isMulti
                    options={subjectData}
                    value={watch("subject")}
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

                <div className="  col-span-4 mt-1" style={{ width: "30vw" }}>
                  <label className="text-base mb-1 mt-3 text-primary font-sarif">
                    Prefered Slots:
                  </label>
                  <Select
                    placeholder="Batch Slots"
                    value={watch("batchSlot")}
                    isMulti
                    options={batchSlotData}
                    style={{ outline: "none", border: "none" }}
                    {...register("batchSlot", { required: true })}
                    onChange={(selectedOptions) => {
                      setValue("batchSlot", selectedOptions);
                    }}
                    className="custom-select"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        backgroundColor: "white",
                        borderRadius: 0,
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                    }}
                  />
                  <div>
                    {errors.batchSlot && (
                      <p className="error validationcolor">
                        This is required {"*"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-2"></div>
                <div>
                  <label>
                    Image Path:
                    <input
                      type="text"
                      value={imagePath}
                      readOnly
                      onClick={handleChooseFile}
                      style={{ height: "30px", outline: "none" }}
                      className={`input    border-gray-400 `}
                      {...register("profilePic", { required: true })}
                    />
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />

                  <div>
                    <p> Preview:</p>
                    <img
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : imagePath
                      }
                      alt="Selected"
                      style={{ maxWidth: "50%", maxHeight: "100px" }}
                    />
                  </div>
                </div>
                
              </div>
              <div className="  col-span-6 	ml-6   flex mt-4 ">
                <div>
                  <button
                      className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000  font-medium  text-sm px-5 py-2.5 me-2 "
                  >
                    Update
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

export default FacultyFormEdit;
