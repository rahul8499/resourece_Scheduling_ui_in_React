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
import Select, { components } from "react-select";

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
    onOpenPopup({ id, isOpen: true, facultyName });

    toggleMenu(false);
  };

  const { setModalOpenEdit, setEditItemId } = useContext(LocationContext);
  const handleOpenModal = (id) => {
    setEditItemId(id);
    setModalOpenEdit(true);
    toggleMenu(false);
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

    scheduleRefresh,
    setScheduleRefresh,
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
    if (deleteScheduleId) {
      setSchedule((prevSchedule) =>
        prevSchedule.filter((data) => data.id !== deleteScheduleId)
      );
    }
  };

  const selectedDateArray = Array.isArray(selectedDate) ? selectedDate : [];
  function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const formattedDates = selectedDateArray.map((dateString) => {
    const startingDateDecoded = decodeURIComponent(dateString);
    return formatDate(startingDateDecoded);
  });
  const startDate = formattedDates[0];
  const endDate = formattedDates[1];

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

  const getScheduleURL = `${process.env.REACT_APP_API_URL}/getSchedule?starting_date=${formattedDates[0]}&ending_date=${formattedDates[1]}&location_id=${selectedLocation}`;
  const getSchedulingData = async () => {
    try {
      const Response = await getApiService(getScheduleURL);
      if (Response) {
        setSchedule(Response);

        const hasDraft = Response.some((item) => item.status === "draft");

        setScheduleStatusCheck(hasDraft);
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
    if (scheduleRefresh) {
      getSchedulingData();
      setScheduleRefresh(false);
    }
  }, [scheduleRefresh]);

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
  useEffect(() => {}, [tableData]);

  function compareTimeRanges(a, b) {
    const timeA = a.split(" - ")[0];
    const timeB = b.split(" - ")[0];

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
    batch.map((i) => {
      const morningSlotTimes =
        i.batch_slots.find((slot) => slot.slot === "morning")?.slot_times || [];
      const afternoonSlotTimes =
        i.batch_slots.find((slot) => slot.slot === "afternoon")?.slot_times ||
        [];
      morningSlotTimes.sort(compareTimeRanges);
      afternoonSlotTimes.sort(compareTimeRanges);

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
        `${process.env.REACT_APP_API_URL}/createSchedule`,
        preparePostData
      );

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

    console.log("batchDetails.bathchId", batchDetails.bathchId);
    // const checkScheduleDayIsValid = batchDetails.bathchId.selected_days.includes(
    //   date.day
    // );

    // if (!checkScheduleDayIsValid) {
    //   const errorMessage = "Schedule day is not valid.";
    //   const warnMessage = `${batchDetails.bathchId.batch_code} is valid for ${batchDetails.bathchId.selected_days}`;
    //   toast.warn(warnMessage, toastConfig);
    // }
    if (batchDetails.bathchId.selected_days !== null) {
      console.log("batchDetails.bathchId", batchDetails.bathchId);
      const checkScheduleDayIsValid =
        batchDetails.bathchId.selected_days.includes(date.day);

      if (!checkScheduleDayIsValid) {
        const errorMessage = "Schedule day is not valid.";
        const warnMessage = `${batchDetails.bathchId.batch_code} is valid for ${batchDetails.bathchId.selected_days}`;
        toast.warn(warnMessage, toastConfig);
      }
    } else {
      console.log("selected_days is null day count is present ");
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

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item, monitor) => {
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
    if (dropFacutly.length !== 0) {
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
  const [isOpenCreateSchedule, setIsOpenCreateSchedule] = useState(false);

  const [facultyData, setFacultyData] = useState([]);

  const facultyURL = `${
    process.env.REACT_APP_API_URL
  }/getfacultydata?q=&limit=${100}&page=&gender=&sortBy=updated_at&sortOrder=DESC&location_id=${selectedLocation}`;

  const getFacutyData = async () => {
    const Response = await getApiService(facultyURL);
    if (Response) {
      try {
        const mappingResponse = Response.data.map((response) => {
          console.log("response", response);
          const subjectData = response.subject.map((subject) => ({
            id: subject.id,
            code: subject.subject_name,
            label: subject.subject_name,
          }));

          return {
            label: (
              <>
                <div className="flex">
                  <img
                    src={response.image_url}
                    alt="Faculty Image"
                    style={{
                      width: "50px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                  {response.first_name + " " + response.last_name + " "}
                  {subjectData.map((subject, index) => (
                    <span key={index} style={{ color: "red" }}>
                      ({subject.code})
                    </span>
                  ))}
                </div>
              </>
            ),
            value: response.faculty_code,
            facultyId: response.id,
            subjectData: subjectData,
          };
        });

        setFacultyData(mappingResponse);
      } catch (error) {
        console.error("Error mapping faculty data:", error);
      }
    }
  };

  useEffect(() => {
    if (isOpenCreateSchedule) {
      getFacutyData();
    }
  }, [isOpenCreateSchedule]);

  const [selectedSubjectData, setSelectedSubjectData] = useState([]);

  const closePopupCreateSchedule = () => {
    setIsOpenCreateSchedule(false);
    setSelectedSubjectData([]);
    setSubjectId([]);
  };

  const [createScheduleDate, setCreateScheduleDate] = useState([]);
  const [createScheduleTime, setCreateScheduleTime] = useState([]);
  const [createScheduleBatchDetails, setCreateScheduleBatchDetails] = useState(
    []
  );
  const [batchNameHeadingForPop, setbatchNameHeadingForPop] = useState([]);

  const [FacultyDetails, setFacultyDetails] = useState([]);

  const handleTimeClick = (item, time, group) => {
    setCreateScheduleDate(item);
    setCreateScheduleTime(time);
    setbatchNameHeadingForPop(group.bathchId.batch_code);
    setCreateScheduleBatchDetails(group);

    setIsOpenCreateSchedule(true);
  };

  const [SubjectId, setSubjectId] = useState([]);
  const handleCreateSchedule = async () => {
    const preparePostData = {
      location_id: createScheduleBatchDetails.bathchId.locations[0].id,

      batch_id: createScheduleBatchDetails.bathchId?.id || null,
      date: createScheduleDate?.date || null,
      faculty_id: FacultyDetails?.facultyId || null,
      slot_time: createScheduleTime || null,
      subject_id: SubjectId || null,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/createSchedule`,
        preparePostData
      );

      if (response.status === 201) {
        setIsOpenCreateSchedule(false);
        setSelectedSubjectData([]);
        setSubjectId([]);

        setFacultyDetails([]);

        toast.success("Schedule Successfully Created..", toastConfig);
        setScheduleStatusCheck(true);
        setFacultyHrsUpdate(true);
        getSchedulingData();
      } else {
        toast.error("Schedule creation failed. Please try again.", toastConfig);
        setFacultyHrsUpdate(false);

        getSchedulingData();
      }
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
      setFacultyHrsUpdate(false);
    }
  };

  return (
    <>
      <ToastContainer />

      {allFilteredAndSortedData.length > 0 ? (
        <div
          ref={drop}
          style={{ overflow: "auto", height: "34vw" }}
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

            <Popup
              isOpen={isOpenCreateSchedule}
              onClose={closePopupCreateSchedule}
              heading={`Create Schedule (${batchNameHeadingForPop} ${createScheduleTime})`}
            >
              <div className="  col-span-6 mt-1 " style={{ width: "24vw" }}>
                <Select
                  placeholder="Select Faculty"
                  options={facultyData}
                  onChange={(selectedOption) => {
                    const subjectData = selectedOption?.subjectData || [];
                    console.log("SubjectData", subjectData);
                    setSelectedSubjectData(subjectData);

                    setFacultyDetails(selectedOption);
                  }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: "white",
                      borderRadius: 0,
                      border: "none",
                      outline: "2px solid green",
                      boxShadow: "none",
                      fontSize: "0.9vw",
                    }),
                    dropdownIndicator: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                  }}
                  className="custom-select"
                  classNamePrefix="custom-select"
                  isMulti={false}
                  components={{
                    ClearIndicator: () => null,
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => null,
                    SingleValue: (props) => (
                      <components.SingleValue
                        {...props}
                        className="flex justify-center"
                        // style={{ cursor: props.data.value ? "pointer" : "default" }}
                      >
                        {props.data.label}
                        {props.data.value && (
                          <div
                            onClick={props.clearValue}
                            style={{ marginLeft: "20px" }}
                            className="text-2xl h-14 w-8  cursor-pointer"
                          >
                            <span className=" cursor-pointer ">&times;</span>
                          </div>
                        )}
                      </components.SingleValue>
                    ),
                  }}
                />
              </div>
              {/* <div className="flex mt-2">
                
              <label class="subject-label text-lg" for="">Select Subject</label>
                {selectedSubjectData.map((subject, index) => (
                  <div key={subject.id}>
                    <input
                      type="radio"
                      className="  "
                      id={subject.id}
                      name="selectedSubject"
                      value={subject.id}
                      onChange={(selectedOption) => {
                        setSubjectId(subject.id);
                      }}
                    />

                    <label
                      htmlFor={subject.id}
                      className=" text-lg mr-2 font-bold "
                    >
                      {subject.label}
                    </label>
                  </div>
                ))}
              </div> */}
              <div className="flex mt-2">
                {selectedSubjectData.length > 0 && (
                  <label className="subject-label text-lg font-bold" htmlFor="">
                    Select Subject:
                  </label>
                )}
                {selectedSubjectData.map((subject, index) => (
                  <div key={subject.id} className="ml-2">
                    <input
                      type="radio"
                      id={subject.id}
                      name="selectedSubject"
                      value={subject.id}
                      onChange={(selectedOption) => {
                        setSubjectId(subject.id);
                      }}
                    />

                    <label htmlFor={subject.id} className="text-lg mr-2 ">
                      {subject.label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="button-container">
                <button
                  className="text-gray-900  bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800"
                  onClick={() => {
                    setIsOpenCreateSchedule(false);
                    setSelectedSubjectData([]);
                    setSubjectId([]);

                    setFacultyDetails([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000 focus:ring-4 focus:ring-green-300 font-medium  text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={() => handleCreateSchedule()}
                  disabled={
                    !FacultyDetails ||
                    (FacultyDetails.length === 0 && !SubjectId) ||
                    typeof SubjectId !== "string" ||
                    SubjectId.trim() === ""
                  }
                >
                  Create
                </button>
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
                                        width: compactSizeTable
                                          ? "4vw"
                                          : "10vw",
                                        height: compactSizeTable ? "" : "7vw", //
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border:
                                          dataItem.error &&
                                          dataItem.error.length > 0
                                            ? "2px solid red"
                                            : dataItem.status === "draft"
                                            ? "2px solid black"
                                            : "none",
                                        boxShadow:
                                          dataItem.status === "draft"
                                            ? "0px 0px 10px rgba(0, 0, 0, 0.5)"
                                            : "none",
                                        backgroundColor:
                                          dataItem.status === "draft"
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
                                                    e.target.src = defaultImage;
                                                  }}
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
                                      width: compactSizeTable ? "4vw" : "10vw",
                                      height: compactSizeTable ? "" : "6vw", //
                                      // width: compactSizeTable ? "10vh" : "10vw",

                                      // height: compactSizeTable
                                      //   ? undefined
                                      //   : "6vw",

                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() =>
                                      handleTimeClick(item, time, group)
                                    }
                                    onDrop={(event) => {
                                      handleDrop(
                                        item, //date
                                        time, //drop time
                                        group //batchDetails
                                      );
                                    }}
                                  >
                                    <div
                                      className={
                                        compactSizeTable
                                          ? " font-serif cursor-pointer relative "
                                          : "px-8 font-serif cursor-pointer relative"
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
                                          className="time-text"
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
                                          <p
                                            className={
                                              compactSizeTable
                                                ? "pl-2 font-serif cursor-pointer relative"
                                                : "font-serif cursor-pointer relative"
                                            }
                                            style={{ position: "relative" }}
                                          >
                                            {compactSizeTable && (
                                              <button className="plus-icon bg-white hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400 shadow hidden">
                                                +
                                              </button>
                                            )}

                                            {!compactSizeTable && (
                                              <button className="plus-icon bg-white hover:bg-gray-100 text-gray-800 text-2xl font-bold py-4 px-6 mt-2 border border-gray-400 shadow hidden">
                                                +
                                              </button>
                                            )}
                                            <div
                                              className={
                                                compactSizeTable
                                                  ? "time-text"
                                                  : ""
                                              }
                                            >
                                              {time}
                                            </div>
                                          </p>
                                        </div>
                                      </p>

                                      {compactSizeTable ? null : (
                                        <span className="font-serif time-text">
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
                                      group //batchDetails
                                    );
                                  }}
                                  className=" font-serif cursor-pointer relative  "
                                  onClick={() =>
                                    handleTimeClick(item, time, group)
                                  }
                                  style={{
                                    width: compactSizeTable ? "4vw" : "10vw",
                                    height: compactSizeTable ? "" : "6vw", //
                                    // width: compactSizeTable ? "" : "10vw",

                                    // height: compactSizeTable
                                    //   ? undefined
                                    //   : "6vw",

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
                                      className="time-text"
                                    />
                                  )}
                                  <p
                                    className={
                                      compactSizeTable
                                        ? "pl-2 font-serif cursor-pointer relative"
                                        : "font-serif cursor-pointer relative"
                                    }
                                    style={{ position: "relative" }}
                                  >
                                    {/* Plus icon */}
                                    {compactSizeTable && (
                                      <button className="plus-icon bg-white hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400 shadow hidden">
                                        +
                                      </button>
                                    )}

                                    {!compactSizeTable && (
                                      <button className="plus-icon bg-white hover:bg-gray-100 text-gray-800 text-2xl font-bold py-4 px-6 mt-2 border border-gray-400 shadow hidden">
                                        +
                                      </button>
                                    )}
                                    <div
                                      className={
                                        compactSizeTable ? "time-text" : ""
                                      }
                                    >
                                      {time}
                                    </div>
                                  </p>

                                  {compactSizeTable ? null : (
                                    <span className="font-serif time-text">
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
                                          dataItem.error &&
                                          dataItem.error.length > 0
                                            ? "2px solid red"
                                            : dataItem.status === "draft"
                                            ? "2px solid black"
                                            : "none",
                                        boxShadow:
                                          dataItem.status === "draft"
                                            ? "0px 0px 10px rgba(0, 0, 0, 0.5)"
                                            : "none",
                                        backgroundColor:
                                          dataItem.status === "draft"
                                            ? subjectCodeColors[
                                                dataItem.subject.subject_code
                                              ] || "black"
                                            : dataItem.status === "publish"
                                            ? subjectCodeColors[
                                                dataItem.subject.subject_code
                                              ] || "black"
                                            : "transparent",

                                        width: compactSizeTable
                                          ? "4vw"
                                          : "10vw",
                                        height: compactSizeTable ? "" : "7vw", //
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
                                              ? "2.3vw"
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
                                                    e.target.src = defaultImage;
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
                                    className={
                                      compactSizeTable
                                        ? "py-3  text-center cursor-pointer"
                                        : " text-center cursor-pointer"
                                    }
                                    style={{
                                      width: compactSizeTable ? "4vw" : "10vw",
                                      height: compactSizeTable ? "" : "6vw", //
                                      // width: compactSizeTable ? "10vh" : "10vw",

                                      // height: compactSizeTable
                                      //   ? undefined
                                      //   : "6vw",

                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() =>
                                      handleTimeClick(item, time, group)
                                    }
                                    onDrop={(event) => {
                                      handleDrop(
                                        item, //date
                                        time, //drop time
                                        group //batchDetails
                                      );
                                    }}
                                  >
                                    <div
                                      className={
                                        compactSizeTable
                                          ? " font-serif cursor-pointer relative "
                                          : "px-8 font-serif cursor-pointer relative"
                                      }
                                      // className=" font-serif cursor-pointer relative"

                                      style={{
                                        display: "grid",
                                        placeItems: "center",
                                        width: compactSizeTable
                                          ? "4vw"
                                          : "10vw",
                                        height: compactSizeTable
                                          ? "2.5vw"
                                          : "6vw", //
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
                                          className="time-text"
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
                                          <p
                                            className={
                                              compactSizeTable
                                                ? "pl-2 font-serif cursor-pointer relative"
                                                : "font-serif cursor-pointer relative"
                                            }
                                            style={{ position: "relative" }}
                                          >
                                            {/* Plus icon */}
                                            {compactSizeTable && (
                                              <button className="plus-icon bg-white hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400 shadow hidden">
                                                +
                                              </button>
                                            )}

                                            {!compactSizeTable && (
                                              <button className="plus-icon bg-white hover:bg-gray-100 text-gray-800 text-2xl font-bold py-4 px-6 mt-2 border border-gray-400 shadow hidden">
                                                +
                                              </button>
                                            )}
                                            <div
                                              className={
                                                compactSizeTable
                                                  ? "time-text"
                                                  : ""
                                              }
                                            >
                                              {time}
                                            </div>
                                          </p>
                                        </div>
                                      </p>

                                      {compactSizeTable ? null : (
                                        <span className="font-serif time-text">
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
                                  className=" font-serif cursor-pointer relative"
                                  onClick={() =>
                                    handleTimeClick(item, time, group)
                                  }
                                  style={{
                                    width: compactSizeTable ? "4vw" : "10vw",
                                    height: compactSizeTable ? "" : "6vw", //
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
                                      className="time-text"
                                    />
                                  )}
                                  <p
                                    className={
                                      compactSizeTable
                                        ? "pl-2 font-serif cursor-pointer relative"
                                        : "font-serif cursor-pointer relative"
                                    }
                                    style={{ position: "relative" }}
                                  >
                                    {/* Plus icon */}
                                    {compactSizeTable && (
                                      <button className="plus-icon bg-white hover:bg-gray-100 text-gray-800 text-2xl font-bold py-1 px-3 border border-gray-400 shadow hidden">
                                        +
                                      </button>
                                    )}
                                    {!compactSizeTable && (
                                      <button className="plus-icon bg-white hover:bg-gray-100 text-gray-800 text-2xl font-bold py-4 px-6 mt-2 border border-gray-400 shadow hidden">
                                        +
                                      </button>
                                    )}
                                    <div
                                      className={
                                        compactSizeTable ? "time-text" : ""
                                      }
                                    >
                                      {time}
                                    </div>{" "}
                                  </p>
                                  {compactSizeTable ? null : (
                                    <span className="time-text">
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
