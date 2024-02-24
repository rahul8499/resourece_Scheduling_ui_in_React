
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import LocationContext from "../../context/LocationContext";
import { DateRangePicker } from "rsuite";
import { useForm } from "react-hook-form";
import { getApiService } from "../../Services/Services";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

import { Link, useNavigate } from "react-router-dom";
import TableHeader from "../../components/TableHeader/TableHeader";

const Single = () => {
  const { selectedLocation } = useContext(LocationContext);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const navigate = useNavigate();
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

    // console.log("data", data)
    console.log("dataslots", data.selectSlots)

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
    try {
      const response = await axios.post(
        "http://dev.allen-api.com:5020/api/createLeave",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
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
            fontSize: "1.5em",
            width: "400px",
            padding: "10px",
          },
        });
        setTimeout(() => {
          navigate("/LeaveList");
        }, 3000);
      } else {
        toast.error("leave dates overlap with existing leave records..");
      }
    } catch (error) {
      toast.error("leave dates overlap with existing leave records..");
    }



  
  };

  useEffect(() => {
    getFacutyData();
  }, [selectedLocation]);

  return (
    <>
      <div className="  ">
        <>
          <ToastContainer />
        </>
        <TableHeader
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Leaves", path:'/LeaveList' }, { name: "New Leave" }]}
      />
        


        <div className=" bg-secondaryColour ml-4 mr-4    pb-6   mb-4  " style={ {height:"60vh"}}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" mt-4  ">
              <div className="   ml-6 pt-5  ">
                <div className="  ">
                  <label className="text-base mb-1 mt-3 text-primary">
                    Date:
                  </label>
                  <div className="relative flex-grow ">
                    <DateRangePicker
                      // oneTap
                      showOneCalendar
                      size="md"
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
                  <label className="text-base mb-1 mt-3 text-primary">
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
                    <label className="text-base mb-1  text-primary">
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
                          checked={selectedOptions.includes(option.value)}
                          onChange={() => handleOptionChange(option.value)}
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

              <div className="  col-span-6 	ml-6   flex mt-8 ">
                <div>
                  <button
                                          className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000  font-medium  text-sm px-5 py-2.5 me-2 "

                    onClick={handleSubmit}
                  >
                    Create
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
export default Single;
