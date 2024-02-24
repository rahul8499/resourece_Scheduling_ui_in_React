import React, { useContext, useEffect, useMemo, useState } from "react";
import LocationContext from "../../context/LocationContext";
import { getApiService } from "../../Services/Services";
import { filterAndSortDataByWeeksss } from "../../Services/CommonFucntion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useDrop } from "react-dnd";
import MorningIMG from "../../utils/Images/morning.png";
import AfterNoonIMG from "../../utils/Images/fullsun.png";
import nophoto from "../../utils/Images/nophoto2i.png";
import { ReactDialogBox } from "react-js-dialog-box";
import "react-js-dialog-box/dist/index.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { FaBars, FaEllipsisV } from "react-icons/fa";
import "./table.css";
import Select, { components } from 'react-select';

import defaultImage from "../../utils/Images/defaultImage.jpg";
import Popup from "../Popup";

const Humberger = ({
  dataItem,
  isOpens,
  toggleMenu,
  isCompactSIze,

  onOpenPopup,
}) => {
  //

  const opendialogue = (id, facultyName) => {
    onOpenPopup({ id, isOpen: true, facultyName }); // Pass an object containing id and isOpen

    toggleMenu(false);
  };

  const { setModalOpenEdit, setEditItemId } = useContext(LocationContext);
  const handleOpenModal = (id) => {
    setEditItemId(id);
    setModalOpenEdit(true);
    toggleMenu(false); // Close the menu
  };

  const styles = isCompactSIze
    ? { cursor: "pointer", position: "absolute" }
    : { cursor: "pointer", position: "absolute", right: 0, top: 0 };
  return (
    <div className="text-center  relative">
      <div
        className={`hamburger ${isOpens ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div
          className=" mt-1 dots-icon flex flex-col items-center    "
          style={styles}
        >
          <div>
            <FaEllipsisV
              className={`${isCompactSIze ? "text-xm" : "text-xl"}`}
            />
          </div>
        </div>
      </div>

      {isOpens && (
        <div className="relative bg-white">
          <div
            className="menu-box absolute top-full"
            style={{
              right: isCompactSIze ? "1px" : "20px",
              marginTop: "20px",
              padding: isCompactSIze ? "4px" : "8px",
            }}
          >
            <div className="  custom-button">
              <button
                onClick={() => handleOpenModal(dataItem.id)}
                className="flex "
              >
                <AiFillEdit className="text-lg text-green-700 cursor-pointer " />
                <p className=" ml-1 "> Edit</p>
              </button>
            </div>

            <div className="  custom-button">
              <button
                className="mt-2 flex"
                onClick={() =>
                  opendialogue(
                    dataItem.id,
                    dataItem.faculty.first_name +
                      " " +
                      dataItem.faculty.last_name
                  )
                }
              >
                <RiDeleteBin6Line className="text-red-700 text-lg cursor-pointer " />
                <p className="  ml-1">Delete</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const Table = () => {
  const {
    selectedDate,
    selectedLocation,

    compactSizeTable,
    setScheduleStatusCheck,
    setHasSchedule,

    setcardHeaderRefresh,
    scheduleRefresh,
    setScheduleRefresh,
    facultyHrsUpdate,
    setFacultyHrsUpdate,
  } = useContext(LocationContext);
  const [schedule, setSchedule] = useState([]);
  const [dropFacutly, setDropFaculty] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [batch, setBatch] = useState([]);
  const [foundationBatch, setfoundationBatch] = useState([]);
  const [openColumns, setOpenColumns] = useState({});
  const [state, setState] = useState([]);

  const [state1, setState1] = useState([]);
  const [state2, setState2] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  const [deleteFacultyname, setDeleteFacultyname] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);
  const closePopup = () => {
    setIsOpen(false);
    setDeleteScheduleId("");

    toggleMenu(false); // Close the menu
    setDeleteFacultyname("");
  };
  const handleOpenPopup = ({ id, isOpen, facultyName }) => {
    setDeleteScheduleId(id);
    // Now you have access to the id, you can perform any necessary actions here
    console.log("Received id:", id);
    console.log("IsOpen:", isOpen);
    setIsOpen(isOpen);
    setDeleteFacultyname(facultyName);
  };

  const handleDeleteSchedule = () => {
    setIsOpen(false);
    if (deleteScheduleId !== null) {
      axios
        .delete(
          `http://dev.allen-api.com:5020/api/DeleteSchedule/${deleteScheduleId}`
        )
        .then(() => {
          toast.success("Schedule Successfully Deleted.. ", toastConfig);
          setFacultyHrsUpdate(true);
          getSchedulingData();
        });
    }
  };

  const selectedDateArray = Array.isArray(selectedDate) ? selectedDate : [];
  function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
    // return `${year}-${month}-${day}`;
  }

  const formattedDates = selectedDateArray.map((dateString) => {
    const startingDateDecoded = decodeURIComponent(dateString);
    return formatDate(startingDateDecoded);
  });
  const startDate = formattedDates[0];
  const endDate = formattedDates[1];

  console.log("startDat", startDate);
  console.log("endDate", endDate);
  const getBatchLocationById = async () => {
    try {
      const response = await axios.get(
        `http://dev.allen-api.com:5020/api/getbatchdata?q=&limit=&page=&sortBy=starting_date&sortOrder=DESC&location_id=${selectedLocation}`
      );

      const jeeMedicalBatches = [];
      const foundationBatches = [];

      response.data.data.forEach((batch) => {
        const streamNames = batch.batch_stream.map(
          (stream) => stream.stream_names
        );

        if (streamNames.includes("JEE") || streamNames.includes("Medical")) {
          jeeMedicalBatches.push(batch);
        }

        if (streamNames.includes("Foundation")) {
          foundationBatches.push(batch);
        }
      });

      setBatch(jeeMedicalBatches);
      setfoundationBatch(foundationBatches);
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };
  console.log("batchData", batch);

  const getScheduleURL = `${process.env.REACT_APP_API_URL}/getSchedule?starting_date=${formattedDates[0]}&ending_date=${formattedDates[1]}&location_id=${selectedLocation}`;
  const getSchedulingData = async () => {
    try {
      const Response = await getApiService(getScheduleURL);
      if (Response) {
        setSchedule(Response);

        const hasDraft = Response.some((item) => item.status === "draft");

        console.log("hasDraft ", hasDraft);

        setScheduleStatusCheck(hasDraft);
        // setSchedule(Response);
        setHasSchedule(true);
      } else {
        setHasSchedule(false);
        setScheduleStatusCheck(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedLocation) {
        await getBatchLocationById();
        getSchedulingData();
      } else {
        console.log("Location not selected.");
      }
    };

    fetchData();
  }, [selectedDate, selectedLocation]);
  useEffect(() => {
    getSchedulingData();
    setScheduleRefresh(false);
  }, [scheduleRefresh]);
  console.log("scheduleRefresh", scheduleRefresh);
  console.log("schedulingData", schedule);
  function getDayNameFromDate(dateString) {
    const dateObj = new Date(dateString);
    const dayOfWeek = dateObj.getDay();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[dayOfWeek];
  }

  useEffect(() => {
    const updatedData = schedule.map((data) => ({
      ...data,
      dayOfWeek: getDayNameFromDate(data.date),
    }));

    setTableData(updatedData);
  }, [schedule]);
  console.log(scheduleRefresh, "scheduleresher----------");
  useEffect(() => {}, [tableData]);

  function compareTimeRanges(a, b) {
    const timeA = a.split(' - ')[0]; // Get the start time of range a
    const timeB = b.split(' - ')[0]; // Get the start time of range b
    
    // Compare the start times
    if (timeA < timeB) {
      return -1;
    }
    if (timeA > timeB) {
      return 1;
    }
    return 0;
  }
  const allFilteredAndSortedData = [];

  function processBatchIds() {
    foundationBatch.map((i) => {
      const morningSlotTimes =
        i.batch_slots.find((slot) => slot.slot === "morning")?.slot_times || [];
      const afternoonSlotTimes =
        i.batch_slots.find((slot) => slot.slot === "afternoon")?.slot_times ||
        [];
        morningSlotTimes.sort(compareTimeRanges);
        afternoonSlotTimes.sort(compareTimeRanges)

      const hasMorningSlots = morningSlotTimes.length > 0;
      const hasAfternoonSlots = afternoonSlotTimes.length > 0;

      const filteredAndSortedDataByWeek = filterAndSortDataByWeeksss(
        tableData,
        startDate,
        endDate,
        i.id,
        i.batch_code,
        hasMorningSlots,
        hasAfternoonSlots,
        morningSlotTimes,
        afternoonSlotTimes,

        i
      );

      allFilteredAndSortedData.push(filteredAndSortedDataByWeek);
    });
  }
  processBatchIds();

  const createScheduling = async () => {
    const preparePostData = {
      location_id:
        state2?.locations && state2.locations.length > 0
          ? state2.locations[0].id
          : null,
      batch_id: state2?.id || null,
      date: state1?.date || null,
      faculty_id: dropFacutly?.facultydata?.id || null,
      slot_time: state?.[0] || null,
      subject_id: dropFacutly?.facultydata?.subject?.[0]?.id || null,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/createSchedule/foundation`,        preparePostData);

      if (response.status === 201) {
        toast.success("Schedule Successfully Created..", toastConfig);
        // setcardHeaderRefresh(true);
        setScheduleStatusCheck(true);
        setFacultyHrsUpdate(true);
        setDropFaculty([]);
        getSchedulingData();
      } else {
        toast.error("Schedule creation failed. Please try again.", toastConfig);
        // setcardHeaderRefresh(false);
        setFacultyHrsUpdate(false);

        getSchedulingData();
        setDropFaculty([]);
      }
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
      // setcardHeaderRefresh(false);
      setFacultyHrsUpdate(false);

      setDropFaculty([]);
    }
  };

  console.log("dropFaculty", dropFacutly);
  const toggleMenu = (columnIndex, dataItemId) => {
    setOpenColumns((prevOpenItems) => {
      const isCurrentlyOpen = prevOpenItems[columnIndex]?.[dataItemId];

      // Close the currently open hamburger if any
      const closeCurrentHamburger = Object.entries(prevOpenItems).reduce(
        (acc, [colIndex, dataItemIds]) => {
          if (colIndex !== columnIndex) {
            Object.keys(dataItemIds).forEach((itemId) => {
              acc[colIndex] = { ...acc[colIndex], [itemId]: false };
            });
          }
          return acc;
        },
        {}
      );

      return {
        ...closeCurrentHamburger,
        [columnIndex]: {
          ...prevOpenItems[columnIndex],
          [dataItemId]: !isCurrentlyOpen,
        },
      };
    });
  };

  const handleDrop = (date, time, batchDetails) => {
    console.log("batchTimening", batchDetails)
    // console.log("batchDetails", batchDetails)

    const extractedData = {
      index: 0,
      message: "Data not found",
      slotTime: time,
    };

    const result = {
      index: extractedData.index,
      message: extractedData.message,
      slotTime: extractedData.slotTime,
    };

    let combinedTimeSlots = [];

    if (
      batchDetails.mornning_time !== "null" &&
      batchDetails.mornning_time.length > 0
    ) {
      combinedTimeSlots.push(...batchDetails.mornning_time);
    }

    if (
      batchDetails.afternoon_time !== "null" &&
      batchDetails.afternoon_time.length > 0
    ) {
      combinedTimeSlots.push(...batchDetails.afternoon_time);
    }

    const checkScheduleDayIsValid = batchDetails.bathchId.selected_days.includes(
      date.day
    );

    if (!checkScheduleDayIsValid) {
      const errorMessage = "Schedule day is not valid.";
      const warnMessage = `${batchDetails.bathchId.batch_code} is valid for ${batchDetails.bathchId.selected_days}`;
      // toast.error(errorMessage, toastConfig);
      toast.warn(warnMessage, toastConfig);
      // return;
    }

    if (result?.slotTime === undefined) {
      const slotTimeToFind = result?.slotTime || result?.slotTime;
      const findSlotTime = combinedTimeSlots.filter((slot) => {
        return slot === slotTimeToFind;
      });
      setState(findSlotTime);
    } else {
      const slotTimeToFind = result?.slotTime || result?.slotTime;
      const findSlotTime = combinedTimeSlots.filter((slot) => {
        return slot === slotTimeToFind;
      });

      setState(findSlotTime);
    }

    setState1(date);
    setState2(batchDetails.bathchId);
  };

  console.log("state2222", state2)

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item, monitor) => {
      console.log("faculydrop", item);
      setDropFaculty(item);
    },
  });

  const subjectCodeColors = {
    E: "#FFD3B0 ",
    S: "#F2D7D9",
    H: "#B1D7B4",
    M: "#FCB69F",
    C: " #C2E9FB",
    P: "#1EAE98",
    B: " #FFC371",
  };

  const toastConfig = useMemo(
    () => ({
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        marginBottom: "4vw",
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
        fontSize: "1.2em",
        width: "400px",
        padding: "10px",
      },
    }),
    []
  );

  useEffect(() => {
    // This useEffect will run when dropFacutly changes
    if (dropFacutly.length !== 0) {
      // Only call getSchedulingData when dropFacutly becomes an empty array
      createScheduling();
    }
  }, [dropFacutly]);

  useEffect(() => {
    if (dropFacutly) {
      setIsMounted(true);
    }
  }, [dropFacutly]);

  function formatDateddmmyy(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}-${month}-${year}`;
  }
  const [isOpenCreateSchedule, setIsOpenCreateSchedule,] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [facultyData, setFacultyData] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleClearValue = () => {
    setSelectedFaculty(null); // Clear selected faculty when clicking the clear icon
  };

  
  // const [isOpen, setIsOpen] = useState(false);
  const facultyURL = `${process.env.REACT_APP_API_URL}/getfacultydata?q=&limit=&page=&gender=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation}`;
  const getFacutyData = async () => {
    const Response = await getApiService(facultyURL);
    if (Response) {

      console.log("facultyResponse", Response)
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
  <div className="flex">
    <img src={response.image_url} alt="Faculty Image" style={{ width: "50px", height: "40px", borderRadius: "50%" }} />
    {response.first_name + " " + response.last_name + " "} ({subjectCodes})
  </div>
</>

              // <>
              //   {response.first_name + " " + response.last_name} {subjectCodes}
              // </>
            ),
            value: response.faculty_code,
            facultyId: response.id,
            subjectId:response.subject[0].id


          };
        });
        setFacultyData(mappingResponse);
      } catch (error) {
        return error;
      }
    }
  };
  useEffect(()=>{
    getFacutyData();
  }, [])

  const closePopupCreateSchedule = () => {
    setIsOpenCreateSchedule(false);
   
  };

  const [createScheduleDate, setCreateScheduleDate] = useState([])
  const [createScheduleTime, setCreateScheduleTime] = useState([])
  const [createScheduleBatchDetails, setCreateScheduleBatchDetails] = useState([])
  const [batchNameHeadingForPop, setbatchNameHeadingForPop] = useState([])

  const [FacultyDetails, setFacultyDetails]= useState([])
  console.log("FacultyDetails", FacultyDetails)

  const handleTimeClick = (item, time, group) => {
    setCreateScheduleDate(item)
    setCreateScheduleTime(time)
    setbatchNameHeadingForPop(group.bathchId.batch_code )
    setCreateScheduleBatchDetails(group)

    console.log("item, time, group", item, time, group)
    setSelectedData({ item, time, group });
    setIsOpenCreateSchedule(true)
    // setShowPopup(true);
  };

  console.log("createScheduleBatchDetails", createScheduleBatchDetails)
  const handleCreateSchedule = async () => {


    const preparePostData = {
      location_id:createScheduleBatchDetails.bathchId.locations[0].id,
      
      batch_id: createScheduleBatchDetails.bathchId?.id || null,
      date: createScheduleDate?.date || null,
      faculty_id: FacultyDetails?.facultyId || null,
      slot_time: createScheduleTime || null,
      subject_id: FacultyDetails?.subjectId || null,
    };


    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/createSchedule`,
        preparePostData
      );

      if (response.status === 201) {
        setIsOpenCreateSchedule(false);

        toast.success("Schedule Successfully Created..", toastConfig);
        // setcardHeaderRefresh(true);
        setScheduleStatusCheck(true);
        setFacultyHrsUpdate(true);
        // setDropFaculty([]);
        getSchedulingData();
      } else {
        toast.error("Schedule creation failed. Please try again.", toastConfig);
        // setcardHeaderRefresh(false);
        setFacultyHrsUpdate(false);

        getSchedulingData();
        // setDropFaculty([]);
      }
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
      // setcardHeaderRefresh(false);
      setFacultyHrsUpdate(false);

      // setDropFaculty([]);
    }
    // Implement your logic for creating a schedule here using selectedData
    // For example, you can make an API call or update state variables
    console.log("Creating schedule:", preparePostData);
    // Close the popup after handling the action
  };
  console.log("allfilterSOrtedData", allFilteredAndSortedData);

  return (
    <>
      <ToastContainer />

      {allFilteredAndSortedData.length > 0 ? (
        <div
          ref={drop}
          style={{ overflow: "auto", height: "30vw" }}
          className="ml-4 bg-secondaryColour font-serif"
        >
          <table className="">
            <Popup
              isOpen={isOpen}
              onClose={closePopup}
              heading={deleteFacultyname}
            >
              <h6 className="font-serif">
                Do you want to delete the Schedule ?
              </h6>
              <div className="button-container">
                <button
                  className="text-gray-900 font-serif  bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800"
                  onClick={closePopup}
                >
                  No
                </button>
                <button
                  className="focus:outline-none font-serif text-white bg-primaryColour hover:bg-primaryColour-1000 focus:ring-4 focus:ring-green-300 font-medium  text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={() => handleDeleteSchedule()}
                >
                  Yes
                </button>
              </div>
            </Popup>

            <Popup isOpen={isOpenCreateSchedule} onClose={closePopupCreateSchedule} heading= {`Create Schedule (${batchNameHeadingForPop} ${createScheduleTime})`}>
  {/* <h6>Do you want to delete the batch ?</h6> */}
      <div className="  col-span-6 mt-1 " style={{ width: "30vw" }}>
                <label className="text-sm mb-1 mt-3 text-primary">
                  Faculty:
                </label>
                <Select
      placeholder="Select Faculty"
      options={facultyData}
      onChange={(selectedOption) => {
        setFacultyDetails(selectedOption)
        // Handle the change here
        console.log("Selected option:", selectedOption);
      }}
      styles={{
        control: (provided, state) => ({
          ...provided,
          backgroundColor: "white",
          borderRadius: 0,
          border: "none",
          outline: "2px solid green", // Always red outline
          boxShadow: "none",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: "black",
        }),
      }}
      className="custom-select"
      classNamePrefix="custom-select"
      isMulti={false} // Single-select
      components={{
        ClearIndicator: () => null, // Hide default clear indicator
        IndicatorSeparator: () => null, // Hide default separator
        DropdownIndicator: () => null, // Hide default dropdown indicator
        SingleValue: (props) => (
          <components.SingleValue {...props} className=" flex  justify-center ">
            {props.data.label} 
            {props.data.value && (
              <div onClick={props.clearValue} style={{ marginLeft: '20px'  , cursor: "pointer"}} className=" text-lg">
                {/* Add your custom clear icon here */}
                <span>&times;</span>
              </div>
            )}
          </components.SingleValue>
        ),
      }}
    />
               
              </div>
<div className="button-container">
      <button className="text-gray-900  bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800" onClick={() => setIsOpenCreateSchedule(false)}>Cancel</button>
      <button className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000 focus:ring-4 focus:ring-green-300 font-medium  text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => handleCreateSchedule()} >Create</button>
    </div>
  </Popup>

            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              {" "}
              <tr
                className={` ${
                  compactSizeTable ? "text-xs" : "text-sm"
                } font-semibold text-left font-serif  uppercase border-b border-black bg-primaryColour text-white p-auto`}
              >
                <th class=" px-12 py-1 font-serif text-center border border-white ">
                  Batch Codes
                </th>

                {allFilteredAndSortedData[0].data.map((item) => (
                  <th
                    key={item.date}
                    style={{
                      height: "0.6vw",
                      width: "12vw",
                    }}
                    class="  text-center border border-white font-serif "
                  >
                    {formatDateddmmyy(item.date)} - {item.day}
                    {/* {item.date} - {item.day} */}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFilteredAndSortedData.map((group) => {
                if (group.mornning_Slots === true) {
                  return (
                    <tr key={group.batchid}>
                      <td className="border font-serif  border-gray-400 text-center  gap-4  tooltip ">
                        <div
                          className={`${
                            compactSizeTable ? "text-xs" : "text-sm"
                          }`}
                        >
                          <img
                            src={MorningIMG}
                            alt=""
                            style={{
                              width: compactSizeTable ? "2vw" : "3vw",

                              margin: "auto",
                            }}
                          />
                          <span class="tooltiptext font-serif ">
                            {group.batch_code}
                          </span>
                          {compactSizeTable
                            ? group.batch_code.substring(0, 20) + "..."
                            : group.batch_code.length > 15
                            ? `${group.batch_code.substring(0, 20)}...`
                            : group.batch_code}
                        </div>
                      </td>

                      {group.data.map((item) => (
                        <td
                          key={item.date}
                          class="border font-serif border-gray-400  "
                        >
                          {item.data.length > 0 ? (
                            <div
                              className=" grid-cols-1  flex "
                              style={{
                                position: "relative",
                              }}
                            >
                              {group.mornning_time.map((time, columnIndex) => {
                                const matchingDataItems = item.data.filter(
                                  (dataItem) => {
                                    const slotTimeParts = dataItem.slot_time
                                      .split("-")[0]
                                      .split(":");
                                    const slotHour = parseInt(
                                      slotTimeParts[0],
                                      10
                                    );
                                    const slotMinute = parseInt(
                                      slotTimeParts[1],
                                      10
                                    );

                                    const morningTimeParts = time
                                      .split("-")[0]
                                      .split(":");
                                    const morningHour = parseInt(
                                      morningTimeParts[0],
                                      10
                                    );
                                    const morningMinute = parseInt(
                                      morningTimeParts[1],
                                      10
                                    );

                                    return (
                                      slotHour === morningHour &&
                                      slotMinute === morningMinute
                                    );
                                  }
                                );

                                return matchingDataItems.length > 0 ? (
                                  matchingDataItems.map((dataItem) => (
                                    <div
                                      key={dataItem.date}
                                      className=" text-center font-serif tooltip "
                                      style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border:
                                          dataItem.status === "draft"
                                            ? "2px solid black"
                                            : "none",
                                        boxShadow:
                                          dataItem.status === "draft"
                                            ? "0px 0px 10px rgba(0, 0, 0, 0.5)"
                                            : "none",
                                        backgroundColor:
                                          dataItem.error &&
                                          dataItem.error.length > 0
                                            ? "red"
                                            : dataItem.status === "draft"
                                            ? subjectCodeColors[
                                                dataItem.subject.subject_code
                                              ] || "black"
                                            : dataItem.status === "publish"
                                            ? subjectCodeColors[
                                                dataItem.subject.subject_code
                                              ] || "black"
                                            : "transparent",
                                      }}
                                    >
                                      {dataItem.error &&
                                        dataItem.error.length > 0 && (
                                          <span className="tooltiptext font-serif">
                                            {dataItem.error[0]}
                                          </span>
                                        )}

                                      <div
                                        className={
                                          compactSizeTable ? "py-2  " : "py-2"
                                        }
                                        style={{
                                          display: "grid ",
                                          placeItems: "center",
                                        }}
                                      >
                                        <div
                                          className=" "
                                          style={{
                                            marginLeft: compactSizeTable
                                              ? "2.2vw"
                                              : "10vw",

                                            display: "flex",
                                          }}
                                        >
                                          <Humberger
                                            key={dataItem.id}
                                            dataItem={dataItem}
                                            isOpens={
                                              openColumns[columnIndex]?.[
                                                dataItem.id
                                              ]
                                            }
                                            toggleMenu={() =>
                                              toggleMenu(
                                                columnIndex,
                                                dataItem.id
                                              )
                                            }
                                            getSchedulingData={
                                              getSchedulingData
                                            }
                                            isCompactSIze={compactSizeTable}
                                            setScheduleRefresh={
                                              setScheduleRefresh
                                            }
                                            onOpenPopup={handleOpenPopup}
                                          />
                                        </div>
                                        {dataItem.faculty &&
                                          !compactSizeTable && (
                                            <th>
                                              {dataItem.faculty.image_url ? (
                                                <img
                                                  src={
                                                    dataItem.faculty.image_url
                                                  }
                                                  onError={(e) => {
                                                    e.target.src = defaultImage; // Set defaultImage when faculty.image_url fails to load
                                                  }}
                                                  // alt="Faculty Image"
                                                  style={{
                                                    width: "3.2vw",
                                                    height: "3.7vw",
                                                  }}
                                                  className="rounded-full"
                                                />
                                              ) : (
                                                <img
                                                  src={defaultImage}
                                                  alt="Default Faculty Image"
                                                  style={{
                                                    width: "3.2vw",
                                                    height: "3.7vw",
                                                  }}
                                                  className="rounded-full"
                                                />
                                              )}
                                            </th>
                                          )}

                                        <p
                                          className=" text-center  text-xs font-serif"
                                          style={{
                                            fontWeight: "bold",
                                            color: "black",
                                          }}
                                        >
                                          {" "}
                                          {dataItem.subject.subject_code +
                                            group.bathchId.batch_stream[0]
                                              .stream_code +
                                            dataItem.faculty.faculty_code}
                                        </p>
                                        <span
                                          className=" px-2 text-xs font-serif"
                                          style={{
                                            color: "black",
                                          }}
                                        >
                                          {dataItem.slot_time}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    key={time}
                                    className={
                                      compactSizeTable
                                        ? "py-3  text-center cursor-pointer"
                                        : " text-center cursor-pointer"
                                    }
                                    style={{
                                      width: compactSizeTable ? "10vh" : "10vw",

                                      height: compactSizeTable
                                        ? undefined
                                        : "6vw",

                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}

                                    onClick={() => handleTimeClick(item, time, group)}

                                    onDrop={(event) => {
                                      handleDrop(
                                        item, //date
                                        time, //drop time
                                        group, //batchDetails
                                      );
                                    }}
                                  >
                                    <div
                                      className={
                                        compactSizeTable ? "  " : "px-8"
                                      }
                                      style={{
                                        display: "grid",
                                        placeItems: "center",
                                      }}
                                    >
                                      {!compactSizeTable && (
                                        <img
                                          src={nophoto}
                                          alt="Faculty Image"
                                          style={{
                                            width: "3.5vw",
                                            height: "3.7vw",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        />
                                      )}
                                      <p
                                        className={
                                          compactSizeTable
                                            ? "pl-2 font-serif"
                                            : " font-serif"
                                        }
                                      >
                                        <div>
      {/* Your existing time element */}
      <p
        className={
          compactSizeTable
            ? "pl-2 font-serif  cursor-pointer"
            : "font-serif cursor-pointer"
        }
        // onClick={() => openPopup(item.id, item.batch_code)}
        // onClick={() => handleTimeClick(item, time, group)}
      >
        {time}
      </p>
      
    
    </div>
                                        {/* {time} */}
                                      </p>

                                      {compactSizeTable ? null : (
                                        <span className="font-serif">
                                          No Schedule
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              className=" grid-cols-1  flex  font-serif  "
                              style={{ display: "flex" }}
                            >
                              {group.mornning_time.map((time, index) => (
                                <div
                                  key={index}
                                  onDrop={(event) => {
                                    handleDrop(
                                      item, //date
                                      time, //drop time
                                      group, //batchDetails
                                    
                                    );
                                  }}
                                  className="cursor-pointer"
                                  onClick={() => handleTimeClick(item, time, group)}

                                  style={{
                                    width: compactSizeTable
                                      ? undefined
                                      : "10vw",

                                    height: compactSizeTable
                                      ? undefined
                                      : "6vw",

                                    paddingLeft: compactSizeTable
                                      ? "1vw"
                                      : "2.5vw",
                                  }}
                                >
                                  {!compactSizeTable && (
                                    <img
                                      src={nophoto}
                                      alt="Faculty Image"
                                      style={{
                                        width: "3.5vw",
                                        height: "3.7vw",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    />
                                  )}
                                 <p
        className={
          compactSizeTable
            ? "pl-2 font-serif "
            : "font-serif "
        }
        // onClick={() => openPopup(item.id, item.batch_code)}
        // onClick={() => handleTimeClick(item, time, group)}
      >
        {time}
      </p>  
                                  {compactSizeTable ? null : (
                                    <span className="font-serif">
                                      No Schedule
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                } else {
                  return null;
                }
              })}

              {allFilteredAndSortedData.map((group) => {
                if (group.afternoonSlots === true) {
                  return (
                    <tr key={group.batchid}>
                      <td className="border font-serif  border-gray-400 text-center  gap-4  tooltip ">
                        <div
                          className={`${
                            compactSizeTable ? "text-xs" : "text-sm"
                          }`}
                        >
                          <img
                            src={AfterNoonIMG}
                            alt=""
                            style={{
                              width: compactSizeTable ? "2vw" : "3vw",

                              margin: "auto",
                            }}
                          />
                          <span class="tooltiptext font-serif ">
                            {group.batch_code}
                          </span>
                          {compactSizeTable
                            ? group.batch_code.substring(0, 20) + "..."
                            : group.batch_code.length > 15
                            ? `${group.batch_code.substring(0, 20)}...`
                            : group.batch_code}
                        </div>
                      </td>

                      {group.data.map((item) => (
                        <td key={item.date} class="border border-gray-400 ">
                          {item.data.length > 0 ? (
                            <div
                              className=" grid-cols-1  flex"
                              style={{
                                position: "relative",
                              }}
                            >
                              {group.afternoon_time.map((time, columnIndex) => {
                                const matchingDataItems = item.data.filter(
                                  (dataItem) => {
                                    const slotTimeParts = dataItem.slot_time
                                      .split("-")[0]
                                      .split(":");
                                    const slotHour = parseInt(
                                      slotTimeParts[0],
                                      10
                                    );
                                    const slotMinute = parseInt(
                                      slotTimeParts[1],
                                      10
                                    );

                                    const morningTimeParts = time
                                      .split("-")[0]
                                      .split(":");
                                    const morningHour = parseInt(
                                      morningTimeParts[0],
                                      10
                                    );
                                    const morningMinute = parseInt(
                                      morningTimeParts[1],
                                      10
                                    );

                                    return (
                                      slotHour === morningHour &&
                                      slotMinute === morningMinute
                                    );
                                  }
                                );

                                return matchingDataItems.length > 0 ? (
                                  matchingDataItems.map((dataItem) => (
                                    <div
                                      key={dataItem.date}
                                      className=" text-center  tooltip "
                                      style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border:
                                          dataItem.status === "draft"
                                            ? "2px solid black"
                                            : "none",
                                        boxShadow:
                                          dataItem.status === "draft"
                                            ? "0px 0px 10px rgba(0, 0, 0, 0.5)"
                                            : "none",
                                        backgroundColor:
                                          dataItem.error &&
                                          dataItem.error.length > 0
                                            ? "red"
                                            : dataItem.status === "draft"
                                            ? subjectCodeColors[
                                                dataItem.subject.subject_code
                                              ] || "black"
                                            : dataItem.status === "publish"
                                            ? subjectCodeColors[
                                                dataItem.subject.subject_code
                                              ] || "black"
                                            : "transparent",

                                        width: compactSizeTable
                                          ? "10.2vh"
                                          : undefined,
                                      }}
                                    >
                                      {dataItem.error &&
                                        dataItem.error.length > 0 && (
                                          <span className="tooltiptext font-serif">
                                            {dataItem.error[0]}
                                          </span>
                                        )}

                                      <div
                                        className={
                                          compactSizeTable ? "  py-1" : "py-2"
                                        }
                                        style={{
                                          display: "grid ",
                                          placeItems: "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            marginLeft: compactSizeTable
                                              ? "2.8vw"
                                              : "10vw",

                                            display: "flex",
                                          }}
                                        >
                                          <Humberger
                                            key={dataItem.id}
                                            dataItem={dataItem}
                                            isOpens={
                                              openColumns[columnIndex]?.[
                                                dataItem.id
                                              ]
                                            }
                                            toggleMenu={() =>
                                              toggleMenu(
                                                columnIndex,
                                                dataItem.id
                                              )
                                            }
                                            getSchedulingData={
                                              getSchedulingData
                                            }
                                            isCompactSIze={compactSizeTable}
                                            setScheduleRefresh={
                                              setScheduleRefresh
                                            }
                                            onOpenPopup={handleOpenPopup}
                                          />
                                        </div>
                                        {dataItem.faculty &&
                                          !compactSizeTable && (
                                            <th>
                                              {dataItem.faculty.image_url ? (
                                                <img
                                                  src={
                                                    dataItem.faculty.image_url
                                                  }
                                                  onError={(e) => {
                                                    e.target.src = defaultImage; // Set defaultImage when faculty.image_url fails to load
                                                  }}
                                                  // alt="Faculty Image"

                                                  style={{
                                                    width: "3.2vw",
                                                    height: "3.7vw",
                                                  }}
                                                  className="rounded-full"
                                                />
                                              ) : (
                                                <img
                                                  src={defaultImage}
                                                  alt="Default Faculty Image"
                                                  style={{
                                                    width: "3.2vw",
                                                    height: "3.7vw",
                                                  }}
                                                  className="rounded-full"
                                                />
                                              )}
                                            </th>
                                          )}

                                        <p
                                          className=" text-center "
                                          style={{
                                            fontWeight: "bold",
                                            color: "black",
                                          }}
                                        >
                                          {" "}
                                          {dataItem.subject.subject_code +
                                            group.bathchId.batch_stream[0]
                                              .stream_code +
                                            dataItem.faculty.faculty_code}
                                        </p>
                                        <span
                                          className=" px-2"
                                          style={{
                                            color: "black",
                                          }}
                                        >
                                          {dataItem.slot_time}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    key={time}
                                    className=" text-center  py-3 cursor-pointer "
                                    style={{
                                      width: compactSizeTable ? "9vh" : "10vw",

                                      height: compactSizeTable
                                        ? undefined
                                        : "6vw",

                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => handleTimeClick(item, time, group)}

                                    onDrop={(event) => {
                                      handleDrop(
                                        item, //date
                                        time, //time
                                        group, //batchTime
                                        group.bathchId
                                      );
                                    }}
                                  >
                                    <div
                                      className={compactSizeTable ? "" : "px-8"}
                                      style={{
                                        display: "grid",
                                        placeItems: "center",
                                      }}
                                    >
                                      {!compactSizeTable && (
                                        <img
                                          src={nophoto}
                                          alt="Faculty Image"
                                          style={{
                                            width: "3.5vw",
                                            height: "3.7vw",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        />
                                      )}
                                      <p
                                        className={
                                          compactSizeTable ? "pl-2" : ""
                                        }
                                      >
                                        {time}
                                      </p>

                                      {compactSizeTable ? null : (
                                        <span className="">No Schedule</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              className=" grid-cols-1  flex     "
                              style={{ display: "flex" }}
                            >
                              {group.afternoon_time.map((time, index) => (
                                <div
                                  key={index}
                                  onDrop={(event) => {
                                    handleDrop(
                                      item,
                                      time,
                                      group,
                                      group.bathchId
                                    );
                                  }}
                                  className=" cursor-pointer "
                                  onClick={() => handleTimeClick(item, time, group)}

                                  style={{
                                    width: compactSizeTable ? "9vh" : "10vw",

                                    height: compactSizeTable
                                      ? undefined
                                      : "6vw",

                                    paddingLeft: compactSizeTable
                                      ? "0.5vw"
                                      : "2.5vw",
                                  }}
                                >
                                  {!compactSizeTable && (
                                    <img
                                      src={nophoto}
                                      alt="Faculty Image"
                                      style={{
                                        width: "3.5vw",
                                        height: "3.7vw",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    />
                                  )}
                                  <p className=" ">{time}</p>

                                  {compactSizeTable ? null : (
                                    <span className="">No Schedule</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className=" font-serif " style={{ textAlign: "center" }}>
          No Batch Available this location
        </p>
      )}
    </>
  );
};

export default Table;
