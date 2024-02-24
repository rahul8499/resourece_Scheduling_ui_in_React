import { ToastContainer, toast } from "react-toastify";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { useForm } from "react-hook-form";
import Select from "react-select";
import React, { useContext, useEffect, useState } from "react";
import "../BatchCreate/BatchCreate.css";

import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";

import { Link, useNavigate } from "react-router-dom";
import { getApiService } from "../../../Services/Services";
import LocationContext from "../../../context/LocationContext";

const locationURL = `${process.env.REACT_APP_API_URL}/getlocation?q=&limit=&page=&name=&sortBy=name&sortOrder=DESC`;
const batchTypeURL = `${process.env.REACT_APP_API_URL}/getBatchtype`;
const batchStreamURL = `${process.env.REACT_APP_API_URL}/getBatchStream`;

const BatchCreate = () => {
  const [fixedChecked, setFixedChecked] = useState(true);
  const [flexibleChecked, setFlexibleChecked] = useState(false);

  const handleFixedCheckboxChange = () => {
    setFixedChecked(!fixedChecked);
    setFlexibleChecked(false); // Ensure flexible checkbox is unchecked
  };

  const handleFlexibleCheckboxChange = () => {
    setFlexibleChecked(!flexibleChecked);
    setFixedChecked(false); 
  };
  const { selectedLocation } = useContext(LocationContext);

  const [startTime, setStartTime] = useState({
    hour: "12",
    minute: "00",
    meridiem: "AM",
  });
  const [endTime, setEndTime] = useState({
    hour: "12",
    minute: "00",
    meridiem: "AM",
  });
  const [timeRanges, setTimeRanges] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTimeChange = (time, setTime) => {
    setTime(time);
  };
  const handleAddTimeRange = () => {
    const startHour = parseInt(startTime.hour, 10);
    const endHour = parseInt(endTime.hour, 10);

    const startMultiplier = startTime.meridiem === "PM" ? 12 : 0;
    const endMultiplier = endTime.meridiem === "PM" ? 12 : 0;

   
    const totalStartHours = startHour + startMultiplier;
    const totalEndHours = endHour + endMultiplier;
    const totalStartMinutes = parseInt(startTime.minute, 10);
    const totalEndMinutes = parseInt(endTime.minute, 10);

    if (
      totalStartHours < totalEndHours ||
      (totalStartHours === 12 && totalEndHours === 0) ||
      (totalStartHours === totalEndHours && totalStartMinutes < totalEndMinutes)
    ) {
      const newTimeRangeString = `${startTime.hour}:${startTime.minute} ${startTime.meridiem} - ${endTime.hour}:${endTime.minute} ${endTime.meridiem}`;

      const isOverlap = timeRanges.some((existingRange) => {
        const [existingStart, existingEnd] = existingRange.split(" - ");

        const [existingStartHour, existingStartMinute, existingStartMeridiem] =
          existingStart.split(/:|\s/);
        const [existingEndHour, existingEndMinute, existingEndMeridiem] =
          existingEnd.split(/:|\s/);

        const existingStartTotalHours =
          parseInt(existingStartHour, 10) +
          (existingStartMeridiem === "PM" ? 12 : 0);
        const existingStartTotalMinutes = parseInt(existingStartMinute, 10);
        const existingEndTotalHours =
          parseInt(existingEndHour, 10) +
          (existingEndMeridiem === "PM" ? 12 : 0);
        const existingEndTotalMinutes = parseInt(existingEndMinute, 10);

        const newStartTotalHours =
          parseInt(startTime.hour, 10) + (startTime.meridiem === "PM" ? 12 : 0);
        const newStartTotalMinutes = parseInt(startTime.minute, 10);
        const newEndTotalHours =
          parseInt(endTime.hour, 10) + (endTime.meridiem === "PM" ? 12 : 0);
        const newEndTotalMinutes = parseInt(endTime.minute, 10);

        return (
          ((newStartTotalHours < existingEndTotalHours ||
            (newStartTotalHours === existingEndTotalHours &&
              newStartTotalMinutes < existingEndTotalMinutes)) &&
            (newEndTotalHours > existingStartTotalHours ||
              (newEndTotalHours === existingStartTotalHours &&
                newEndTotalMinutes > existingStartTotalMinutes))) ||
          (newStartTotalHours <= existingStartTotalHours &&
            newEndTotalHours > existingStartTotalHours) ||
          (newStartTotalHours < existingEndTotalHours &&
            newEndTotalHours >= existingEndTotalHours)
        );
      });

      if (isOverlap) {
        setErrorMessage(
          "New time range overlaps with an existing range. Please select a different time range."
        );
      } else {
        setTimeRanges([...timeRanges, newTimeRangeString]);
        setErrorMessage("");
      }
    } else {
      setErrorMessage("Start time should be less than end time.");
    }
  };

  const handleDeleteTimeRange = (index) => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges.splice(index, 1);
    setTimeRanges(newTimeRanges);
  };
  const [selectedLocationId, setSelectedLocationId] = useState("");

  const facultyURL = `${process.env.REACT_APP_API_URL}/getfacultydata?q=&limit=&page=&gender=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation}`;
 

  const [locationData, setlocationData] = useState([]);
  const [batchTypeData, setBatchTypeData] = useState([]);
  const [batchStreamData, setBatchStreamData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [batchCode, setBatchCode] = useState("");
  const [facultyData, setFacultyData] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const options = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
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

  const handleInputChange = (event) => {
    const inputValue = event.target.value.toUpperCase();

    setBatchCode(inputValue);
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

  const getBatchTypeData = async () => {
    const Response = await getApiService(batchTypeURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return {
            label: response.name,
            value: response.name,
            id: response.id,
          };
        });
        setBatchTypeData(mappingResponse);
      } catch (error) {
        return error;
      }
    }
  };

  const getFacutyData = async () => {
    const Response = await getApiService(facultyURL);
    if (Response) {
      try {
        const mappingResponse = Response.data.map((response) => {
          const subjectCodes = response.subject.map((subject, index) => (
            <span key={index} style={{ color: "red" }}>
              {subject.subject_code}
            </span>
          ));

          return {
            label: (
              <>
                {response.first_name + " " + response.last_name} {subjectCodes}
              </>
            ),
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
  const getBatchStreamData = async () => {
    const Response = await getApiService(batchStreamURL);

    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          const subjects = response.subject || [];

          const mappedSubjects = subjects.map((subject) => {
            return {
              label: subject.subject_name,
              value: subject.subject_code,
              id: subject.id,
            };
          });

          return {
            id: response.id,
            label: response.stream_names,
            value: response.stream_names,
            subjects: mappedSubjects,
          };
        });

        setBatchStreamData(mappingResponse);
      } catch (error) {
        console.error("Error mapping subjects:", error);
      }
    }
  };

  function formatTo24Hour(timeString) {
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let formattedHours = hours;

    // Adjust hours for PM period
    if (period === "PM" && hours !== 12) {
      formattedHours += 12;
    }

    const paddedHours = formattedHours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    const formattedTime = `${paddedHours}:${paddedMinutes}`;

    return formattedTime;
  }
  const onSubmit = async (data) => {
    const timeData = [];
    const amSlot = [];
    const pmSlot = [];

    if (Array.isArray(timeRanges) && timeRanges.length > 0) {
      timeRanges.forEach((timeRange) => {
        const [startTime, endTime] = timeRange.split(" - ");

        const formattedStartTime = formatTo24Hour(startTime.trim());

        const formattedEndTime = formatTo24Hour(endTime.trim());

        const formattedTimeRange = `${formattedStartTime} - ${formattedEndTime}`;

        if (parseInt(formattedStartTime.split(":")[0]) < 12) {
          amSlot.push(formattedTimeRange);
        } else {
          pmSlot.push(formattedTimeRange);
        }
      });
    } else {
      console.error("Invalid or empty timeRanges array");
    }

    if (amSlot.length > 0) {
      timeData.push({
        slot: "morning",
        slot_times: amSlot,
      });
    }

    if (pmSlot.length > 0) {
      timeData.push({
        slot: "afternoon",
        slot_times: pmSlot,
      });
    }

    const facultyIds = data.faculyData?.map((item) => item.id) || [];

    const postData = {
      location_id: data.locations.id,
      batch_stream_id: data.batchStream.id,

      batch_type_id: Array.isArray(data.batchType)
        ? data.batchType.map((item) => item.id)
        : [data.batchType.id],

      ...(data.selectdays ? { selected_days: data.selectdays } : {}),

      ...(data.dayCount && !data.selectdays
        ? { selected_days_count: data.dayCount }
        : {}),

      batch_code: data.batchcode,
      starting_date: data.startingDate,
      duration: data.duration,
      duration_type: data.durationtype,
      faculty_id: facultyIds,
      slot: timeData,
    };

    axios.post(`${process.env.REACT_APP_API_URL}/createbatch`, postData); //post method
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
      navigate("/batchlist");
    }, 3000);
  };

  useEffect(() => {
    getLocationData();
    getBatchStreamData();
    getBatchTypeData();
  }, []);

  useEffect(() => {
    getFacutyData();
  }, [selectedLocationId]);

  useEffect(() => {
    if (fixedChecked || flexibleChecked) {
      setSelectedOptions([]);
    }
  }, [fixedChecked, flexibleChecked]);
  return (
    <>
      <div className="  ">
        <>
          <ToastContainer />
        </>
        <TableHeader
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Batches", path: "/batchlist" },
            { name: "New Batch" },
          ]}
        />
      </div>
      <div className=" bg-secondaryColour ml-6 mr-4  h-auto pb-6  font-serif mb-4  ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" mt-1 ">
            <div className="  grid grid-cols-12 ml-6 pt-3  ">
              <div className=" col-span-6 ">
                <label className="text-sm mb-1 mt-3 text-primary">Code:</label>
                <div>
                  <input
                    id="batchcode"
                    type="text"
                    className="input"
                    style={{ height: "32px", outline: "none" }}
                    autoComplete="off"
                    {...register("batchcode", {
                      required: "This is required",
                    })}
                    placeholder="Batch Code"
                    autoFocus
                    value={batchCode}
                    onChange={handleInputChange}
                  />
                  <div>
                    {errors.batchcode && (
                      <span className="validationcolor">
                        {errors.batchcode.message}
                        {" *"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div
                className=" col-span-6 "
                style={{ width: "30vw", outline: "none" }}
              >
                <label className="text-sm mb-1 mt-3 text-primary">
                  Location:
                </label>
                <Select
                  options={locationData}
                  {...register("locations", { required: true })}
                  onChange={(selectedOptions) => {
                    setValue("locations", selectedOptions);
                    setSelectedLocationId(selectedOptions.id);
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
                  }}
                />
                <div>
                  {errors.locations && (
                    <p className="error validationcolor">
                      This is required{" *"}{" "}
                    </p>
                  )}
                </div>
              </div>

              <div className="  col-span-6  mt-1" style={{ width: "30vw" }}>
                <label className="text-sm mb-1 mt-2 text-primary">Type:</label>
                <Select
                  placeholder="Batch Type"
                  options={batchTypeData}
                  style={{ outline: "none", border: "none" }}
                  {...register("batchType", { required: true })}
                  onChange={(selectedOptions) => {
                    setValue("batchType", selectedOptions);
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
                      height: "32px",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                  }}
                />
                <div>
                  {errors.batchType && (
                    <p className="error validationcolor">
                      This is required {" *"}
                    </p>
                  )}
                </div>
              </div>
              <div className=" col-span-6 mt-1 ">
                <label className="text-sm mb-1 mt-3 text-primary">
                  Duration & Duration Type:
                </label>
                <div className="flex">
                  <div className="">
                    <div>
                      <input
                        id="duration"
                        type="number"
                        style={{
                          height: "32px",
                          width: "16vw",
                          outline: "none",
                          paddingLeft: "8px",
                        }}
                        placeholder="Duration"
                        {...register("duration", {
                          required: "This is required",
                        })}
                        className=" "
                      />
                      <div>
                        {errors.duration && (
                          <span className="validationcolor">
                            {errors.duration.message}
                            {" *"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <div className=" " style={{ marginLeft: "0.1vw" }}>
                      <select
                        {...register("durationtype", { required: true })}
                        style={{
                          height: "32px",
                          width: "14vw",
                          outline: "none",
                        }}
                        className=" bg-white  "
                        onChange={(e) => e.target.value}
                        placeholder="Duration"
                      >
                        <option value="" disabled selected>
                          Select Duration Type
                        </option>
                        <option value="Days">Days</option>
                        <option value="Weeks">Weeks</option>
                        <option value="Months">Months</option>
                        <option value="Years">Years</option>
                      </select>

                      <div>
                        {errors.durationtype &&
                          errors.durationtype.type === "required" && (
                            <span className="validationcolor">
                              This is required{" *"}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="  col-span-6 mt-1 " style={{ width: "30vw" }}>
                <label className="text-sm mb-1 mt-3 text-primary">
                  Streams:
                </label>
                <Select
                  placeholder="Batch Stream"
                  // isMulti
                  options={batchStreamData.map((stream) => ({
                    label: `${stream.label} (${stream.subjects
                      .map((subject) => subject.label)
                      .join(", ")})`,
                    id: stream.id,
                  }))}
                  // options={batchStreamData}
                  style={{ outline: "none", border: "none" }}
                  {...register("batchStream", { required: true })}
                  onChange={(selectedOptions) => {
                    setValue("batchStream", selectedOptions);
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
                      height: "32px;",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                  }}
                />
                <div class="">
                  {errors.batchStream && (
                    <p className="error validationcolor">
                      This is required {" *"}
                    </p>
                  )}
                </div>
              </div>
              <div className=" col-span-6 mt-1">
                <label className="text-sm mb-1  text-primary">
                  Start Date:
                </label>
                <div>
                  <input
                    id="date"
                    type="date"
                    style={{ height: "32px", outline: "none" }}
                    placeholder="Starting Date"
                    {...register("startingDate", {
                      required: "This is required",
                    })}
                    className="input "
                  />
                  <div>
                    {errors.startingDate && (
                      <span className="validationcolor">
                        {errors.startingDate.message}
                        {" *"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="  col-span-6 mt-1 " style={{ width: "30vw" }}>
                <label className="text-sm mb-1 mt-3 text-primary">
                  Faculty:
                </label>
                <Select
                  placeholder="select Faculty"
                  isMulti
                  options={facultyData}
                  style={{ outline: "none", border: "none" }}
                  {...register("faculyData", { required: true })}
                  onChange={(selectedOptions) => {
                    setValue("faculyData", selectedOptions);
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
                      height: "32px",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                  }}
                />
                <div>
                  {errors.faculyData && (
                    <p className="error validationcolor">
                      This is required {" *"}
                    </p>
                  )}
                </div>
              </div>

              <div className="  col-span-6 mt-1   ">
                <label className="text-sm mb-1  text-primary">
                  Create Slots:
                </label>
                <div className="">
                  <div className="custom-time-picker flex ">
                    <div className="flex">
                      <div>
                        {/* <label>Start Time: </label> */}
                        <select
                          className=" "
                          value={startTime.hour}
                          onChange={(e) =>
                            handleTimeChange(
                              {
                                ...startTime,
                                hour: e.target.value.padStart(2, "0"),
                              },
                              setStartTime
                            )
                          }
                        >
                          {Array.from(Array(12), (x, index) => index + 1).map(
                            (hour) => (
                              <option
                                key={hour}
                                value={String(hour).padStart(2, "0")}
                              >
                                {String(hour).padStart(2, "0")}
                              </option>
                            )
                          )}
                        </select>
                        :
                        <select
                          value={startTime.minute}
                          onChange={(e) =>
                            handleTimeChange(
                              { ...startTime, minute: e.target.value },
                              setStartTime
                            )
                          }
                        >
                          {Array.from(Array(60), (x, index) => index).map(
                            (minute) => (
                              <option
                                key={minute}
                                value={minute < 10 ? `0${minute}` : minute}
                              >
                                {minute < 10 ? `0${minute}` : minute}
                              </option>
                            )
                          )}
                        </select>
                        <select
                          value={startTime.meridiem}
                          onChange={(e) =>
                            handleTimeChange(
                              { ...startTime, meridiem: e.target.value },
                              setStartTime
                            )
                          }
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>

                      <div className="">
                        <label>- </label>
                        <select
                          value={endTime.hour}
                          onChange={(e) =>
                            handleTimeChange(
                              {
                                ...endTime,
                                hour: e.target.value.padStart(2, "0"),
                              },
                              setEndTime
                            )
                          }
                        >
                          {Array.from(Array(12), (x, index) => index + 1).map(
                            (hour) => (
                              <option
                                key={hour}
                                value={String(hour).padStart(2, "0")}
                              >
                                {String(hour).padStart(2, "0")}
                              </option>
                            )
                          )}
                        </select>
                        :
                        <select
                          value={endTime.minute}
                          onChange={(e) =>
                            handleTimeChange(
                              { ...endTime, minute: e.target.value },
                              setEndTime
                            )
                          }
                        >
                          {Array.from(Array(60), (x, index) => index).map(
                            (minute) => (
                              <option
                                key={minute}
                                value={minute < 10 ? `0${minute}` : minute}
                              >
                                {minute < 10 ? `0${minute}` : minute}
                              </option>
                            )
                          )}
                        </select>
                        <select
                          value={endTime.meridiem}
                          onChange={(e) =>
                            handleTimeChange(
                              { ...endTime, meridiem: e.target.value },
                              setEndTime
                            )
                          }
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <button
                        onClick={handleAddTimeRange}
                        type="button"
                        className="bg-white hover:bg-gray-100 text-gray-800 text-1xl font-bold py-1 px-4 border border-gray-400 shadow"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {errorMessage && (
                    <p className="error">
                      {errorMessage}
                      {" *"}
                    </p>
                  )}
                </div>
                <div className=" flex">
                  {timeRanges.map((range, index) => (
                    <div key={index} className="mt-2">
                      {range}
                      <button
                        className=" ml-1 "
                        type="button"
                        onClick={() => handleDeleteTimeRange(index)}
                      >
                        {" "}
                        <RiDeleteBin6Line className="text-red-700 text-sm mr-3 mt-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-6 mt-1" style={{ width: "30vw" }}>
                <div className="flex items-center ">
                  <label className="text-sm mb-1  text-primary">
                    Select Days:
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    value="sunday-to-monday"
                    checked={fixedChecked}
                    onChange={handleFixedCheckboxChange}
                    // disabled
                    className="form-checkbox-square h-4 w-4 text-primary border border-gray-400 rounded-none"
                  />
                  <span className="ml-2">Fixed</span>

                  <input
                    type="checkbox"
                    value="sunday-to-monday"
                    checked={flexibleChecked}
                    onChange={handleFlexibleCheckboxChange}
                    // disabled
                    className="form-checkbox-square ml-4 h-4 w-4 text-primary border border-gray-400 rounded-none"
                  />
                  <span className="ml-2">Flexible</span>
                </div>
                <div className=" mt-2">
                  <select
                    {...(flexibleChecked
                      ? register("dayCount", { required: "This is required" })
                      : {})}
                    style={{
                      height: "32px",
                      // width: "14vw",
                      width: "30vw",
                      outline: "none",
                      outline: "none",
                    }}
                    value={fixedChecked ? "" : undefined} 
                    className={fixedChecked ? "bg-gray-200" : "bg-white"}
                    disabled={fixedChecked || !flexibleChecked} 
                    placeholder="Duration"
                  >
                    <option value="" disabled selected>
                      Select Days Count
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7].map((dayCount) => (
                      <option key={dayCount} value={dayCount}>
                        {dayCount}
                      </option>
                    ))}
                  </select>
                  <div>
                    {flexibleChecked &&
                      errors.dayCount && ( 
                        <span className="validationcolor">
                          {errors.dayCount.message}
                          {" *"}
                        </span>
                      )}
                  </div>
                  <div></div>
                </div>

                <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2">
                  {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option.value}
                        {...(fixedChecked
                          ? register("selectdays", {
                              required: "This is required",
                            })
                          : {})}
                        checked={
                          !flexibleChecked &&
                          selectedOptions.includes(option.value)
                        }
                        onChange={() => handleOptionChange(option.value)}
                        disabled={!fixedChecked || flexibleChecked} 
                        className="form-checkbox-square h-4 w-4 text-primary border border-gray-400 rounded-none"
                      />
                      <span className="ml-2">{option.label}</span>
                    </div>
                  ))}
                  <div>
                    {fixedChecked &&
                      errors.selectdays && ( 
                        <span className="validationcolor">
                          {errors.selectdays.message}
                          {" *"}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="  col-span-6 	ml-6   flex mt-2 ">
              <div>
                <button
                  className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000  font-medium  text-sm px-5 py-2.5 me-2 "
                  type="submit"
                >
                  Create
                </button>
              </div>
              <Link to={"/batchlist"} style={{ color: "white" }}>
                <button
                  className="text-gray-900   bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800" // style={{ height: "35px", width: "7vw" }}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default BatchCreate;
