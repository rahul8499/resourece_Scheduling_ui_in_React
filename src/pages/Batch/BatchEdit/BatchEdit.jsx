import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { getApiService } from "../../../Services/Services";
import { DateRangePicker } from "rsuite";
import { RiDeleteBin6Line } from "react-icons/ri";
import "../BatchCreate/BatchCreate.css";
import LocationContext from "../../../context/LocationContext";

const BatchEdit = () => {
  const [fixedChecked, setFixedChecked] = useState(false);
  const [flexibleChecked, setFlexibleChecked] = useState(false);

  const handleFixedCheckboxChange = () => {
    setFixedChecked(!fixedChecked);
    setFlexibleChecked(false); // Ensure flexible checkbox is unchecked
  };

  const handleFlexibleCheckboxChange = () => {
    setFlexibleChecked(!flexibleChecked);
    setFixedChecked(false); // Ensure fixed checkbox is unchecked
  };
  useEffect(() => {
    // Clear selectedOptions when either fixedChecked or flexibleChecked changes
    if (fixedChecked || flexibleChecked) {
      setSelectedOptions([]);
    }
  }, [fixedChecked, flexibleChecked]);
  const { id } = useParams();
  const { selectedLocation } = useContext(LocationContext);

  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedLocationId, setSelectedLocationId] = useState("");
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
    // Convert start and end time to hours for comparison
    const startHour = parseInt(startTime.hour, 10);
    const endHour = parseInt(endTime.hour, 10);

    // Convert meridiem to a multiplier for hour calculation
    const startMultiplier = startTime.meridiem === "PM" ? 12 : 0;
    const endMultiplier = endTime.meridiem === "PM" ? 12 : 0;

    // Calculate the total hours for start and end times
    // const totalStartHours = startHour + startMultiplier;
    // const totalEndHours = endHour + endMultiplier;
    const totalStartHours = startHour + startMultiplier;
    const totalEndHours = endHour + endMultiplier;
    const totalStartMinutes = parseInt(startTime.minute, 10);
    const totalEndMinutes = parseInt(endTime.minute, 10);

    // Check if the start time is less than the end time
    if (
      totalStartHours < totalEndHours ||
      (totalStartHours === 12 && totalEndHours === 0) ||
      (totalStartHours === totalEndHours && totalStartMinutes < totalEndMinutes)
    ) {
      // If valid, create the new time range string
      const newTimeRangeString = `${startTime.hour}:${startTime.minute}  ${startTime.meridiem} - ${endTime.hour}:${endTime.minute} ${endTime.meridiem}`;

      // Check for overlap with existing time ranges
      const isOverlap = timeRanges.some((existingRange) => {
        const [existingStart, existingEnd] = existingRange.split(" - ");

        // Parse the start and end times of the existing range
        const [existingStartHour, existingStartMinute, existingStartMeridiem] =
          existingStart.split(/:|\s/);
        const [existingEndHour, existingEndMinute, existingEndMeridiem] =
          existingEnd.split(/:|\s/);

        // Convert existing time to total hours and minutes for comparison
        const existingStartTotalHours =
          parseInt(existingStartHour, 10) +
          (existingStartMeridiem === "PM" ? 12 : 0);
        const existingStartTotalMinutes = parseInt(existingStartMinute, 10);
        const existingEndTotalHours =
          parseInt(existingEndHour, 10) +
          (existingEndMeridiem === "PM" ? 12 : 0);
        const existingEndTotalMinutes = parseInt(existingEndMinute, 10);

        // Convert new time to total hours and minutes for comparison
        const newStartTotalHours =
          parseInt(startTime.hour, 10) + (startTime.meridiem === "PM" ? 12 : 0);
        const newStartTotalMinutes = parseInt(startTime.minute, 10);
        const newEndTotalHours =
          parseInt(endTime.hour, 10) + (endTime.meridiem === "PM" ? 12 : 0);
        const newEndTotalMinutes = parseInt(endTime.minute, 10);

        // Check for overlap
        return (
          // Scenario 1: New range completely overlaps with existing range
          ((newStartTotalHours < existingEndTotalHours ||
            (newStartTotalHours === existingEndTotalHours &&
              newStartTotalMinutes < existingEndTotalMinutes)) &&
            (newEndTotalHours > existingStartTotalHours ||
              (newEndTotalHours === existingStartTotalHours &&
                newEndTotalMinutes > existingStartTotalMinutes))) ||
          // Scenario 2: New range partially overlaps with the start of existing range
          (newStartTotalHours <= existingStartTotalHours &&
            newEndTotalHours > existingStartTotalHours) ||
          // Scenario 3: New range partially overlaps with the end of existing range
          (newStartTotalHours < existingEndTotalHours &&
            newEndTotalHours >= existingEndTotalHours)
        );
      });

      if (isOverlap) {
        // If there is an overlap, set the error message in state
        setErrorMessage(
          "New time range overlaps with an existing range. Please select a different time range."
        );
      } else {
        // If there is no overlap, add the new time range to the array
        setTimeRanges([...timeRanges, newTimeRangeString]);
        setErrorMessage("");
      }
    } else {
      // If not valid, set the error message in state
      setErrorMessage("Start time should be less than end time.");
    }
  };
  const handleDeleteTimeRange = (index) => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges.splice(index, 1);
    setTimeRanges(newTimeRanges);
  };
  const [facultyData, setFacultyData] = useState([]);
  const [batchData, setBatchData] = useState({});
  const [batchTypeData, setBatchTypeData] = useState([]);
  const [batchStreamData, setBatchStreamData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [durationType, setDurationType] = useState("");
  const [duration, setDuration] = useState("");

  const [batchCode, setBatchCode] = useState("");
  const options = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },

    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleOptionChange = (value) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(value)) {
        return prevSelectedOptions.filter((option) => option !== value);
      } else {
        return [...prevSelectedOptions, value];
      }
    });
  };

  const locationURL = `${process.env.REACT_APP_API_URL}/getlocation?q=&limit=&page=&name=&sortBy=name&sortOrder=DESC`;
  const batchStreamURL = `${process.env.REACT_APP_API_URL}/getBatchStream`;
  const batchSlotURL = `${process.env.REACT_APP_API_URL}/getBatchslot?q=&limit=&page=&name=&sortBy=name&sortOrder=DESC`;
  const batchDataURL = `${process.env.REACT_APP_API_URL}/showBatchById/${id}`;
  const batchTypeURL = `${process.env.REACT_APP_API_URL}/getBatchtype`;
  const facultyURL = `${process.env.REACT_APP_API_URL}/getfacultydata?q=&limit=&page=&gender=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation}`;
  const [defaultFacultyValue, setDefaultFacultyValue] = useState(null);
  const fetchBatchData = async () => {
    try {
      const Response = await getApiService(batchDataURL);
      if (Response) {
        const defaultFaculty = Response.data.faculties[0];
        if (defaultFaculty) {
          const facultyData = [];

          Response.data.faculties.forEach((faculty) => {
            const subjectCode = faculty.subject[0]?.subject_code || "";

            facultyData.push({
              label: (
                <>
                  {faculty.first_name} {faculty.last_name}{" "}
                  <span style={{ color: "red" }}>{subjectCode}</span>
                </>
              ),
              value: faculty.faculty_code,
              id: faculty.id,
            });
          });

          setValue("faculyData", facultyData);
        }
        setBatchData(Response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const getDataOfBatchById = async () => {
    if (id) {
      setIsEditMode(true);
      fetchBatchData();
    }
  };
  const [selectedStreams, setSelectedStreams] = useState([]);

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
  const getBatchStreamData = async () => {
    const Response = await getApiService(batchStreamURL);

    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          // Assuming the subjects are present in the 'subject' property of each response
          const subjects = response.subject || [];

          // Map subjects for the current response
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

  const getBatchTypeData = async () => {
    const Response = await getApiService(batchTypeURL);
    if (Response) {
      try {
        const mappingResponse = Response.map((response) => {
          return {
            label: response.name,
            value: response.id,
          };
        });
        setBatchTypeData(mappingResponse);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchFormattedStartingDate = () => {
    if (batchData.starting_date) {
      const dateParts = batchData.starting_date.split("-");
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      return formattedDate;
    }
    return "";
  };

  const [startingDate, setStartingDate] = useState(
    fetchFormattedStartingDate()
  );




  useEffect(() => {
    getFacutyData();
  }, [selectedLocation]);

  useEffect(() => {
    const fetchData = async () => {
      await getDataOfBatchById();
      await getLocationData();
      await getBatchTypeData();
      await getBatchStreamData();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (batchData.selected_days && batchData.selected_days.length > 0) {
      setFixedChecked(true);
      setValue("selectdays", batchData.selected_days);

      if (flexibleChecked) {
        setValue(prevValue => ({
          ...prevValue,
          selectdays: ""
        }));
      }
    }
  }, [batchData.selected_days]);
  useEffect(() => {
    if (batchData.selected_days_count) {
      setFlexibleChecked(true);
      setValue("dayCount", batchData.selected_days_count);
    }
  }, [batchData.selected_days_count]);
  useEffect(() => {
    if (isEditMode && batchData.locations) {
      const selectedLocationOptions = locationData.filter((option) =>
        batchData.locations.find(
          (location) => location.pivot.location_id === option.value
        )
      );
      setValue("locations", selectedLocationOptions);
    }
  }, [isEditMode, batchData.locations, locationData]);

  useEffect(() => {
    if (isEditMode && batchData.batch_stream) {
      const selectedBatchStreamOptions = batchStreamData.filter((option) =>
        batchData.batch_stream.find(
          (batchstream) => batchstream.pivot.batch_stream_id === option.id
        )
      );


      if (selectedBatchStreamOptions.length > 0) {
        const firstSelectedOption = selectedBatchStreamOptions[0];

        const subjectsLabel = firstSelectedOption.subjects
          ? `(${firstSelectedOption.subjects
              .map((subject) => subject.label)
              .join(", ")})`
          : "";

        setValue("batchStream", {
          label: `${firstSelectedOption.label} ${subjectsLabel}`,
          id: firstSelectedOption.id,
        });
        setSelectedStreams(selectedBatchStreamOptions);
      }
    }
  }, [isEditMode, batchData.batch_stream, batchStreamData]);

  useEffect(() => {
    if (isEditMode && batchData.batch_types) {
      const selectedBatchStreamOptions = batchTypeData.filter((option) =>
        batchData.batch_types.find(
          (batchtype) => batchtype.pivot.batch_type_id === option.value
        )
      );
      setValue("batchtype", selectedBatchStreamOptions);
    }
  }, [isEditMode, batchData.batch_types, batchTypeData]);

  useEffect(() => {
    if (batchData.selected_days) {
      setSelectedOptions(batchData.selected_days);
    }
  }, [batchData.selected_days]);

  const formatTo12HourFormat = (timeRange) => {
    const [startTime, endTime] = timeRange.split("-").map((time) => {
      const [hours, minutes, seconds] = time.split(":");
      const parsedHours = parseInt(hours, 10);
      const period = parsedHours >= 12 ? "PM" : "AM";

      const formattedHours = (parsedHours % 12 || 12)
        .toString()
        .padStart(2, "0");

      return `${formattedHours}:${minutes} ${period}`;
    });

    return `${startTime} - ${endTime}`;
  };
  //time--------------------------------------
  useEffect(() => {
    const isFoundationStream = selectedStreams.some(
      (stream) => stream.label === "Foundation"
    );
    const batchSlots = batchData?.batch_slots || [];
 

    if (isFoundationStream) {
      const slotTimesFoundations = batchData?.slot_times_foundations || [];

      if (slotTimesFoundations.length > 0) {
        const morningSlot =
          batchSlots[0]?.slot_times?.map((time) =>
            formatTo12HourFormat(time)
          ) || [];
        const afternoonSlot =
          batchSlots[1]?.slot_times?.map((time) =>
            formatTo12HourFormat(time)
          ) || [];

        const combinedSlots = [...morningSlot, ...afternoonSlot];

        // setValue("SlotTime",combinedSlots)
        setTimeRanges(combinedSlots);
      }
    }
    if (batchSlots && batchSlots.length > 0) {

      const morningSlot =
        batchSlots[0]?.slot_times?.map((time) => formatTo12HourFormat(time)) ||
        [];
      const afternoonSlot =
        batchSlots[1]?.slot_times?.map((time) => formatTo12HourFormat(time)) ||
        [];

      const combinedSlots = [...morningSlot, ...afternoonSlot];

  

      setTimeRanges(combinedSlots);
      // setValue("SlotTime", combinedSlots)
    }
  }, [selectedStreams, batchData]);

  useEffect(() => {
    if (isEditMode) {
      setDurationType(isEditMode ? batchData.duration_type : "");
      setDuration(isEditMode ? batchData.duration : "");
      setStartingDate(isEditMode ? batchData.starting_date : "");
      setBatchCode(isEditMode ? batchData.batch_code : "");
    }
  }, [
    isEditMode,
    batchData.duration_type,
    batchData.duration,
    batchData.starting_date,
    batchData.duration_type,
    batchData.batchCode,
  ]);

  useEffect(() => {
    setValue("durationType", durationType);
    setValue("batchCode", batchCode);
    setValue("duration", duration);
    setValue("startingDate", startingDate);
  }, [durationType, duration, startingDate, batchData, batchCode]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value.toUpperCase();
    setBatchCode(inputValue);
  };

  
  const convertTo24HourFormat = (time) => {
    const [hours, minutes] = time.split(/:|\s/);
    let formattedHours = parseInt(hours, 10);

    if (time.includes("PM") && formattedHours !== 12) {
      formattedHours += 12;
    }

    const paddedHours = formattedHours.toString().padStart(2, "0");
    const paddedMinutes = minutes.padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };

  const convertTimeRangesTo24HourFormat = (timeRanges) => {
    return timeRanges.map((timeRange) => {
      const [startTime, endTime] = timeRange
        .split(" - ")
        .map(convertTo24HourFormat);
      return `${startTime} - ${endTime}`;
    });
  };

  const onSubmit = async (data) => {
 
   
    const convertedTimeRanges = convertTimeRangesTo24HourFormat(timeRanges);

    const amSlots = [];
    const pmSlots = [];
    const timeData = [];

    convertedTimeRanges.forEach((timeSlot) => {
      const startTime = timeSlot.split(" - ")[0];
      const hours = parseInt(startTime.split(":")[0], 10);

      if (hours < 12) {
        amSlots.push(timeSlot);
      } else {
        pmSlots.push(timeSlot);
      }
    });


    if (amSlots.length > 0) {
      timeData.push({
        slot: "morning",
        slot_times: amSlots,
      });
    }

    if (pmSlots.length > 0) {
      timeData.push({
        slot: "afternoon",
        slot_times: pmSlots,
      });
    }

    const facultyIds = data.faculyData?.map((item) => item.id) || [];

    const postData = {
      location_id: data.locations?.[0]?.value,
      batch_code: data.batchCode,
      batch_type_id: Array.isArray(data.batchtype)
        ? data.batchtype.map((item) => item.value)
        : [data.batchtype.value],
      // batch_slot_id: batchSlotIds,
      batch_stream_id: data.batchStream.id,
      faculty_id: facultyIds,
      starting_date: data.startingDate,
      duration: data.duration,
      duration_type: data.durationType,
      // selected_days: data.selectdays || [],
      slot: timeData,
      ...(data.selectdays ? { selected_days: data.selectdays } : {}),

  // Include selected_days_count only if data.dayCount is present and data.selectdays is not present
  ...(data.dayCount && !data.selectdays ? { selected_days_count: data.dayCount } : {}),
    };


    axios
      .patch(`http://dev.allen-api.com:5020/api/update/${id}`, postData)
      .then((res) => {
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
          navigate("/batchlist");
        }, 3000);
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
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
      });
  };


  useEffect(() => {
    if (flexibleChecked) {
      setValue("selectdays", "");
    }
  }, [flexibleChecked]);

  return (
    <div>
      <>
        <ToastContainer />
      </>
      <TableHeader
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Batches", path: "/batchlist" },
          { name: isEditMode ? "Edit batch" : "Create Batch" },
        ]}
      />

      <div className=" bg-secondaryColour ml-4 mr-4  h-auto pb-6   mb-4  ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" mt-1 ">
            <div className="  grid grid-cols-12 ml-6 pt-2    ">
              <div className=" col-span-6 ">
                <label className="text-sm mb-1 mt-3 text-primary">Code:</label>
                <div>
                  <input
                    id="batchcode"
                    defaultValue={batchCode}
                    autoFocus
                    type="text"
                    style={{ height: "30px", outline: "none" }}
                    placeholder="Batch Code"
                    {...register("batchCode", {
                      required: "This field is required",
                    })}
                    className="input text-sm "
                    autoComplete="off"
                    onChange={handleInputChange}
                  />
                  <div>
                    {errors.batchCode && (
                      <span className="validationcolor">This is required</span>
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
                  className=" text-sm"
                  {...register("locations", { required: true })}
                  onChange={(selectedOptions) => {
                    setValue("locations", selectedOptions);
                    setSelectedLocationId(selectedOptions.value);
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
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                  }}
                />
                <div>
                  {errors.locations && (
                    <p className="error validationcolor">This is required</p>
                  )}
                </div>
              </div>

              <div className=" col-span-6 " style={{ width: "30vw" }}>
                <label className="text-sm mb-1 mt-3 text-primary">Type:</label>
                <Select
                  options={batchTypeData}
                  value={watch("batchtype")}
                  style={{ outline: "none", border: "none" }}
                  {...register("batchtype", { required: true })}
                  onChange={(selectedOptions) => {
                    setValue("batchtype", selectedOptions);
                  }}
                  className="custom-select text-sm"
                  classNamePrefix="custom-select"
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
                  {errors.batchType && (
                    <p className="error validationcolor">This is required</p>
                  )}
                </div>
              </div>
              <div className=" col-span-6 ">
                <label className="text-sm mb-1 mt-3 text-primary">
                  Duration & Duration Type
                </label>
                <div className="flex">
                  <div className="">
                    <div>
                      <input
                        id="duration"
                        type="number"
                        defaultValue={isEditMode ? batchData.duration : ""}
                        style={{
                          height: "30px",

                          width: "16vw",
                          outline: "none",
                        }}
                        placeholder="Duration"
                        {...register("duration", {
                          required: "This is required",
                        })}
                        className=" text-sm "
                      />
                      <div>
                        {errors.duration && (
                          <span className="validationcolor">
                            {errors.duration.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <div className="" style={{ marginLeft: "0.1vw" }}>
                      <select
                        {...register("durationType", { required: true })}
                        defaultValue={durationType}
                        style={{
                          height: "30px",
                          width: "14vw",
                          outline: "none",
                        }}
                        className=" bg-white  text-sm "
                        onChange={(e) => setDurationType(e.target.value)}
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
                              This is required
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="  col-span-6  " style={{ width: "30vw" }}>
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
                  value={watch("batchStream")}
                  style={{ outline: "none", border: "none" }}
                  {...register("batchStream", { required: true })}
                  onChange={(selectedOptions) => {
                    console.log("batchStream", selectedOptions);
                    setValue("batchStream", selectedOptions);
                    setSelectedStreams([selectedOptions]);
                  }}
                  className="custom-select  text-sm"
                  classNamePrefix="custom-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: "white",
                      borderRadius: 0,
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      height: "30px;",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                  }}
                />
                <div>
                  {errors.batchStream && (
                    <p className="error validationcolor">This is required</p>
                  )}
                </div>
              </div>
              <div className=" col-span-6 ">
                <label className="text-sm mb-1 mt-3 text-primary">
                  Start Date:
                </label>
                <div>
                  <input
                    id="date"
                    type="date"
                    defaultValue={startingDate}
                    style={{ height: "30px", outline: "none" }}
                    placeholder="Starting Date"
                    onChange={(e) => setStartingDate(e.target.value)}
                    {...register("startingDate", {
                      required: "This field is required",
                    })}
                    className="input text-sm "
                  />
                  <div>
                    {errors.startingDate && (
                      <span className="validationcolor">
                        {errors.startingDate.message}{" "}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="  col-span-6  " style={{ width: "30vw" }}>
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
                  value={watch("faculyData")}
                  className="custom-select text-xs"
                  classNamePrefix="custom-select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: "white",
                      borderRadius: 0,
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      height: "px",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                  }}
                />
                <div>
                  {errors.faculyData && (
                    <p className="error validationcolor">This is required</p>
                  )}
                </div>
              </div>
              <div className="  col-span-6   ">
                <label className="text-sm mb-1  text-primary">
                  Create Slots:
                </label>
                <div className="">
                  <div className="custom-time-picker flex">
                    <div className="flex">
                      <div className="">
                        {/* <label>Start Time: </label> */}
                        <select
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
                    value={fixedChecked ? "" : undefined} // Empty selected option when fixedChecked is true
                    className={fixedChecked ? "bg-gray-200" : "bg-white"}
                    // disabled={fixedChecked}
                    disabled={fixedChecked || !flexibleChecked} // Disabled if fixed or flexible is selected
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
                      errors.dayCount && ( // Only show error if select days is enabled and there's an error
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
                        disabled={!fixedChecked || flexibleChecked} // Disabled if fixed or flexible is selected
                        className="form-checkbox-square h-4 w-4 text-primary border border-gray-400 rounded-none"
                      />
                      <span className="ml-2">{option.label}</span>
                    </div>
                  ))}
                  <div>
                    {fixedChecked &&
                      errors.selectdays && ( // Only show error if select days is enabled and there's an error
                        <span className="validationcolor">
                          {errors.selectdays.message}
                          {" *"}
                        </span>
                      )}
                  </div>
                </div>
              </div>

             
            </div>
            <div className=" col-span-6 flex mt-4  	ml-6 ">
              <div>
                <button className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000  font-medium  text-sm px-5 py-2.5 me-2 ">
                  Update
                </button>
              </div>
              <Link to={"/batchlist"} style={{ color: "white" }}>
                <button className="text-gray-900   bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchEdit;