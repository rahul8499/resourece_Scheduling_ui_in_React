
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import LocationContext from "../../context/LocationContext";
import { DateRangePicker } from "rsuite";
import { useForm } from "react-hook-form";
import { getApiService } from "../../Services/Services";


import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

import { Link, useNavigate, useParams } from "react-router-dom";
import TableHeader from "../../components/TableHeader/TableHeader";



const  LeaveEdit = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: "99dd13ec-4fad-4b0d-80e8-e6693c4b7a3a", label: "Morning" },
    { value: "99dd14cf-19f1-4e5f-981e-7490a9cae3a3", label: "Afternoon" },
  ];

  const handleOptionChange = (value) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(value)) {
        return prevSelectedOptions.filter((option) => option !== value);
      } else {
        return [...prevSelectedOptions, value];
      }
    });
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedLocation } = useContext(LocationContext);

  const [date, setDate] = useState("");

  const leaveDataUrl = `  http://dev.allen-api.com:5020/api/leaveGetById/${id}
  `;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const fetchLeaveData = async () => {
    try {
      const response = await getApiService(leaveDataUrl);
      console.log("response", response)
      if (response && response.data) {
        setLeaveData(response);
  
        if (response.data.dates && response.data.dates.length > 0) {
          if (response.data.dates.length > 1) {
            // If there are multiple dates, set start and end dates
            const startDate = response.data.dates[0];
            const endDate = response.data.dates[response.data.dates.length - 1];
           
            setStartDate(startDate);
            setEndDate(endDate);
          } else {
            // If there's only one date, set a single date
            const leaveDate = response.data.dates[0];
            setDate(leaveDate);
          }
  
          // ... rest of your code
        } else {
          console.log("No leave data available");
        }
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };
  
 


  const getDataOfFacultyById = async () => {
    if (id) {
      fetchLeaveData();
    }
  };

  const styles = {
    width: 450,
    display: "block",
    height: "35px",
    outline: "none",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  //
  const [facultyData, setFacultyData] = useState([]);
  const facultyURL = `${process.env.REACT_APP_API_URL}/getfacultydata?q=&limit=&page=1&gender=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation}`;
  const getFacutyData = async () => {
    const Response = await getApiService(facultyURL);
    if (Response) {
      try {
        const mappingResponse = Response.data.map((response) => {
          return {
            label: <>{response.first_name + " " + response.last_name}</>,
            value: response.faculty_code,
            id: response.id,
          };
        });
        setFacultyData(mappingResponse);
      } catch (error) {
        return error;
      }
    }
  };

  const onSubmit = async (data) => {
    console.log("dataa", data)
    let formattedStartDate = "";
    let formattedEndDate = "";

    if (data.dateRange && data.dateRange[0] && data.dateRange[1]) {
      formattedStartDate = data.dateRange[0].toLocaleString("en-CA");
      formattedEndDate = data.dateRange[1].toLocaleString("en-CA");
    }

   
    const postData = {
      "faculty_id" : data.faculyData.id,
      "starting_date": formattedStartDate,
       "ending_date": formattedEndDate,
       "batch_slot_ids":data.selectSlots

    
    };
    console.log("postData", postData)
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/updateLeave/${id}`,
    
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
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
        fontSize: "1.5em",
        width: "400px",
        padding: "10px",
          },
        });
        setTimeout(() => {
          navigate("/LeaveList");
        }, 2000);
      } else {
        toast.error("leave dates overlap with existing leave records..");
      }
    } catch (error) {
      toast.error(error.response
        .data.error, {
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
      // toast.error(error.response
      //   .data.error);
    }
   
  };


  console.log("leaveData", leaveData)
  useEffect(() => {
    if (leaveData && leaveData.data) {
      const names = leaveData.data.batch_slot.name;
      setSelectedOptions([names]);
      setValue("selectSlots", [leaveData.data.batch_slot.id]);
    }
  }, [leaveData]);


  useEffect(() => {
    getFacutyData();
  }, [selectedLocation]);

  useEffect(() => {
    const fetchData = async () => {
      await getDataOfFacultyById();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (facultyData.length > 0 && leaveData.data  && leaveData.data .faculty_id) {
      const selectedFaculty = facultyData.find(
        (faculty) => faculty.id === leaveData.data.faculty_id
      );

      if (selectedFaculty) {
        setValue("faculyData", selectedFaculty);
      }
    }
  }, [selectedLocation, facultyData, leaveData]);

  const formatDateToString = (dateString) => {
    
    const dateObject = new Date(dateString);

    if (!isNaN(dateObject.getTime())) {
      const formattedDateString = dateObject.toISOString().split("T")[0];
      return formattedDateString;
    } else {
      return "";
    }
  };

  const formattedDate = formatDateToString(date);
  const formattedStartDate = formatDateToString(startDate);
  const formattedEndDate = formatDateToString(endDate);

  useEffect(() => {
    if (formattedDate) {
      const dateStrings = [formattedDate, formattedDate];
      const dateObjects = dateStrings.map((dateString) => new Date(dateString));
      setValue("dateRange", dateObjects);
    } else if (formattedStartDate && formattedEndDate) {
      const dateStrings = [formattedStartDate, formattedEndDate];
      const dateObjects = dateStrings.map((dateString) => new Date(dateString));
      setValue("dateRange", dateObjects);
    } else {
      console.error(" formattedEndDate is empty or invalid.");
    }
  }, [formattedDate, formattedStartDate, formattedEndDate]);


  return (
    <>
      <div className="  ">
        <>
          <ToastContainer />
        </>
        <TableHeader
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Leaves", path: "/LeaveList"}, { name: "Edit" }]}
      />
      

        <div className=" bg-secondaryColour ml-2 mr-4  h-auto pb-6   mb-4  mt-4 ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className=" bg-secondaryColour ml-8 mr-4  h-auto pb-6   mb-4  pt-8 "
              style={{ height: "60vh" }}
            >
              <div className="   ml-2 pt-5   ">
              <div className="  ">
                  <label className="text-lg mb-1 mt-3 text-primary">
                    Date:
                  </label>
                  <div className="relative flex-grow ">
                    <DateRangePicker
                      // oneTap
                      showOneCalendar
                      size="md"
                      value={watch("dateRange")}

                      placeholder="Calender"
                      {...register("dateRange", {
                        required: "This is required",
                        validate: (value) =>
                          (value && value[0] !== null && value[1] !== null) ||
                          "Please select a date range",
                      })}
                      onChange={(selectedOptions) => {
                        setValue("dateRange", selectedOptions);
                      }}
                      style={styles}
                    />
                  </div>
                  {errors.dateRange && (
                    <p className="error validationcolor">
                      {errors.dateRange.message}{"*"}
                    </p>
                  )}
                </div>
               
                <div className="  col-span-6  mt-3 " style={{ width: "460px" }}>
                  <label className="text-lg mb-1 mt-3 text-primary">
                    Faculty
                  </label>
                  <Select
                    placeholder="select Faculty"
                    // isMulti
                    options={facultyData}
                    style={{
                      height: "35px",
                      outline: "none",
                      borderRadius: "6px",
                    }}
                    {...register("faculyData", { required: true })}
                    onChange={(selectedOptions) => {
                      setValue("faculyData", selectedOptions);
                    }}
                    value={watch("faculyData")}
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
                        borderRadius: "6px",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        color: "black",
                      }),
                    }}
                  />
                  <div>
                    {errors.faculyData && (
                      <p className="error validationcolor">This is required {"*"}</p>
                    )}
                  </div>
                </div>

                <div className="col-span-6 mt-3" style={{ width: "30vw" }}>
                  <div className="flex items-center">
                    <label className="text-lg mb-1  text-primary">
                      Select Slots:
                    </label>
                  </div>

                  <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
                    {options.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option.value}
                          {...register("selectSlots", {
                            required: "This is required",
                          })}
                          checked={selectedOptions.includes(option.label)}
                          onChange={() => handleOptionChange(option.label)}
                          className="form-checkbox-square h-5 w-5 text-primary border border-gray-400 rounded-none"
                        />
                        <span className="ml-2">{option.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    {errors.selectSlots && (
                      <span className="validationcolor">
                        {errors.selectSlots.message}{"*"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className=" col-span-6 ml-2 flex mt-8 ">
                <div>
                  <button
                                                             className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000  font-medium  text-sm px-5 py-2.5 me-2 "

                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                </div>
                <Link to={"/LeaveList"} style={{ color: "white" }}>
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
export default LeaveEdit
