import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LocationContext from "../../context/LocationContext";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactDialogBox } from "react-js-dialog-box";
import "react-js-dialog-box/dist/index.css";
import { getApiService } from "../../Services/Services";
import Popup from "../Popup";
import { FaDownload } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa';
import { checkWeekStatus } from "../../Services/CommonFucntion";


const TableHeader = ({ breadcrumbs }) => {
  const [isOpenAutoSchedule, setIsOpenAutoSchedule] = useState(false)

  const openPopup = () => {
    setIsOpenAutoSchedule(true);
  };

  const closePopupAutoschedule = () => {
    setIsOpenAutoSchedule(false);
  };



  const [isOpenPublishSchedule, setIsOpenPublishSchedule] = useState(false);

  const openPopupPublishSchedule = () => {
    setIsOpenPublishSchedule(true);
  };

  const closePopupPublishSchedule = () => {
    setIsOpenPublishSchedule(false);
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
        fontSize: "1.2em",
        width: "400px",
        padding: "10px",
      },
    }),
    []
  );

  const location = useLocation();
  const isFacultyListRoute = location.pathname === "/facultylist";
  const isSchedulepageRoute = location.pathname === "/schedule";
  const isSchedulepageRoute1 = location.pathname === "/schedule";
  const isSchedulepageRoute2 = location.pathname === "/schedule";
  const isSchedulepageRoute3 = location.pathname === "/schedule";
  const isBatchpageRoute = location.pathname === "/batchlist";
  const isLeavePageRoute = location.pathname === "/LeaveList";
  const isReportPageRoute = location.pathname === "/reports";

  const {
    selectedLocation,
    selectedScheduleType,
    refreshTable,
    setRefreshTable,
    loading,
    setLoading,
    getSchedulingDataState,
    setSchedulingDataState,
    selectedDate,
    facultyCardRefresh,
    setfacultyCardRefresh,
    hasSchedule,
    setHasSchedule,
    ScheduleStatusCheck,
    setScheduleStatusCheck,
    loaderMessage,
    setLoaderMessage,
    setScheduleRefresh,
    facultyHrsUpdate, setFacultyHrsUpdate
  } = useContext(LocationContext);

  const [showButtons, setShowButtons]= useState(false)




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
  
 useEffect(()=>{
  const checkDateIsCurrentorPastorPrevious= checkWeekStatus(startDate,endDate)
if(checkDateIsCurrentorPastorPrevious == true){
  setShowButtons(false) 
}else{
  setShowButtons(true)
}
 },[startDate, endDate])

  function extractDates(input) {
    const startDate = new Date(input[0]);
    const endDate = new Date(input[1]);

    const startFormatted = startDate.toISOString().split("T")[0];
    const endFormatted = endDate.toISOString().split("T")[0];

    return { start: startFormatted, end: endFormatted };
  }

  useEffect(() => {}, [hasSchedule, ScheduleStatusCheck, startDate, endDate]);

  const exportToFaculty = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/export-faculty/${selectedLocation}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "exported_sheet.xlsx";

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const exportReport = async () => {
    try {
      const response = await axios.get(
        `http://dev.allen-api.com:5020/api/export-report?location_id=${selectedLocation}&starting_date=$${startDate}&ending_date=${endDate}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "exported_sheet.xlsx";

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const exportToLeave = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/export-leave?locationId=${selectedLocation}`,
        {
          responseType: "blob", // Expect a binary response
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "exported_sheet.xlsx";

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const exportToExcel = async () => {
    try {
      let streamCode = "";

      if (selectedScheduleType === "jee/medical") {
        streamCode = "j/m";
      } else if (selectedScheduleType === "foundation") {
        streamCode = "f";
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/export-schedule?batch_stream=${streamCode}&location_id=${selectedLocation}&start_date=${startDate}&end_date=${endDate}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "exported_sheet.xlsx";

      document.body.appendChild(link);
      link.click();

      // Clean up resources
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const [autoScheduleInProgress, setAutoScheduleInProgress] = useState(false);

  const AutoSchedule = async () => {
    setIsOpenAutoSchedule(false);
    setAutoScheduleInProgress(true); // Set auto schedule in progress

    let scheduleTypeMessage = hasSchedule
      ? "Reschedule"
      : "Automated Scheduling";
    let autoMessage = `${scheduleTypeMessage} process is currently underway. Avoid refreshing the page as it may take a few minutes to complete.`;

    setLoaderMessage(<pre className=" font-serif ">{autoMessage}</pre>);
    setLoading(true);

    if (selectedDate && selectedDate[0] && selectedDate[1]) {
      const startDate = selectedDate[0].toISOString().split("T")[0];
      const endDate = selectedDate[1].toISOString().split("T")[0];
      const data = extractDates(selectedDate);

      const url = `${process.env.REACT_APP_API_URL}/sendAutoScheduleDataToApi?from_date=${data.start}&to_date=${data.end}&location_id=${selectedLocation}`;

      try {
        const response = await axios.post(url);

        if (response.status === 200) {
          setFacultyHrsUpdate(true)
          toast.success("Schedule Successfully Created.. ", toastConfig);
          setLoading(false);
          setScheduleRefresh(true);
          setScheduleStatusCheck(true);
        } else {
          toast.error("Failed to AutoSchedule. Please try again.", toastConfig);
        }
      } catch (error) {
        setFacultyHrsUpdate(false)

        console.error("AutoSchedule has error:", error);
        toast.error("Failed to AutoSchedule" + error, toastConfig);
      } finally {
        setAutoScheduleInProgress(false); // Reset auto schedule state

        setLoading(false);
        setFacultyHrsUpdate(false)

      }
    } else {
      console.error(
        "Invalid selectedDate array. Ensure both start and end dates are defined."
      );
    }
  };

  const PublishSchedule = async () => {

    let autoMessage = ` process is currently underway. Avoid refreshing the page as it may take a few minutes to complete.`;

    setLoaderMessage(<pre className=" font-serif ">{autoMessage}</pre>);
    setLoading(true);
    setIsOpenPublishSchedule(false);
    if (selectedDate && selectedDate[0] && selectedDate[1]) {
      const data = extractDates(selectedDate);

      const url = `${process.env.REACT_APP_API_URL}/publishSchedule?from_date=${data.start}&to_date=${data.end}&location_id=${selectedLocation}`;

      try {
        const response = await axios.post(url).then((item) => {
          setLoading(false);

          setFacultyHrsUpdate(true)

          toast.success("'All published schedules have been successfully emailed to all faculties. ", toastConfig);
          setScheduleStatusCheck(false);

          setScheduleRefresh(true);

        });
      } catch (error) {
        setFacultyHrsUpdate(false)

        console.error("publishing Schedule has error:", error);
        setLoading(false);
      }
    } else {
      setFacultyHrsUpdate(false)

      console.error(
        "Invalid selectedDate array. Ensure both start and end dates are defined."
      );
    }
  };
  const exportToBatch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/export-batch/${selectedLocation}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "exported_sheet.xlsx";

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <>
      <ToastContainer />

      <nav
        className="flex container-schedule h-[3rem] text-xl box-border border-b border-gray-400 border-solid"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3 ml-6 text-xl  font-serif">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index}>
              {breadcrumb.path ? (
                <Link to={breadcrumb.path} className=" font-serif ">
                  <div className="flex items-center mt-3 font-serif">
                    {index !== 0 && ( // Check if it's not the first breadcrumb
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                    <span
                      className={`ml-1 text-xl font-medium md:ml-2 font-serif  ${
                        index !== 0
                          ? "dark:text-gray-400 text-green-800"
                          : "dark:text-gray-400 text-gray-500"
                      }`}
                    >
                      {breadcrumb.name}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center mt-3 font-serif">
                  {index !== 0 && ( // Check if it's not the first breadcrumb
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                  <span
                    className={`ml-1 font-serif text-base md:text-base lg:text-xl xl:text-xl ${
                      index !== 0
                        ? "dark:text-gray-400 text-gray-500"
                        : "dark:text-gray-400 text-gray-500"
                    }`}
                  >
                    {breadcrumb.name}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
        <section className="notification flex justify-center bg-emerald-50 font-bold ml-4">
        {isSchedulepageRoute3 && (
          <div className="  ml-6 text-base flex  text-primaryColour  " style={{marginTop:"14px"}}>
            {/* Conditional rendering based on hasSchedule and ScheduleStatusCheck */}
            {!hasSchedule && !ScheduleStatusCheck && (
              <div className="flex font-serif">
Please go ahead with auto-scheduling         <FaArrowRight className=" mt-1 ml-1" />       </div>
            )}
            {hasSchedule && ScheduleStatusCheck && (
              <div className=" flex font-serif   "   >Schedule is in draft mode. Click "Publish" to finalize             <FaArrowRight className=" mt-1 ml-1" />
              </div>
            )}
            {hasSchedule && !ScheduleStatusCheck && (
              <div className=" font-serif">Schedule is Published.</div>
            )}
          </div>
        )}
        
</section>

        <div className="absolute right-4 origin-center mt-2 flex space-x-2">
          {isSchedulepageRoute2 && (
            <button
              
  className={`bg-${showButtons ? 'gray-400':'primaryColour' } w-22 h-8 text-white text-sm font-bold py-2 px-3 md:px-4 inline-flex items-center`}
              // onClick={AutoSchedule}
              onClick={() => openPopup()}
              disabled={autoScheduleInProgress || showButtons} // Disable button when auto schedule is in progress

            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6l6 6m0 0l-6 6m6-6H6"
              ></path>
    
              <span className="md:inline-block font-serif flex">
               <div className="flex">

                {hasSchedule ? "Reschedule" : "Auto Schedule"}
                <FaCalendarAlt  className=" mt-1 ml-1" />
               </div>
              </span>
            </button>
          )}
          <Popup
            isOpen={isOpenAutoSchedule}
            onClose={closePopupAutoschedule}
            // heading={"AutoSchedule"}
            heading={hasSchedule ? "Reschedule?" : "Auto Schedule?"}
          >
            <h6 className="font-serif">
              {hasSchedule
                ? "Rescheduling will replace existing records. Do you want to continue ?"
                : "Do you want to continue ?"}
            </h6>
            <div className="button-container">
              <button
className="text-gray-900  font-serif bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800"                onClick={() => setIsOpenAutoSchedule(false)}
              >
                No
              </button>
              <button
      className="focus:outline-none text-white font-serif bg-primaryColour hover:bg-primaryColour-1000 font-medium text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      onClick={() => AutoSchedule()}
              >
                Yes
              </button>
            </div>
          </Popup>

          {isSchedulepageRoute1 && (
            <button
              className={`bg-${
                ScheduleStatusCheck ? "primaryColour" : "gray-400"
              } w-22 h-8 text-white text-sm font-bold font-serif py-2 px-3 md:px-4 inline-flex items-center`}
              onClick={() => openPopupPublishSchedule()}
              disabled={!ScheduleStatusCheck || autoScheduleInProgress} // Disable button based on both states

              // disabled={!ScheduleStatusCheck}
              // disabled={autoScheduleInProgress} // Disable button when auto schedule is in progress

            >
              <path
                // className=" bg-slate-400"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6l6 6m0 0l-6 6m6-6H6"
              ></path>

              <span className="hidden md:inline-block font-serif">
                Publish Schedule
              </span>
            </button>
          )}
          <Popup
            isOpen={isOpenPublishSchedule}
            onClose={closePopupPublishSchedule}
            heading={"Publish Schedule?"}
          >
            <h6 className="font-serif">Do you want to continue ?</h6>
            <div className="button-container">
              <button
className="text-gray-900  font-serif bg-gray-50 border border-gray-300 focus:outline-none hover:bg-gray-100  font-medium  text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:focus:ring-gray-800"                onClick={() => setIsOpenPublishSchedule(false)}
              >
                No
              </button>
              <button
      className="focus:outline-none text-white bg-primaryColour hover:bg-primaryColour-1000 font-medium text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      onClick={() => PublishSchedule()}
              >
                Yes
              </button>
            </div>
          </Popup>
          {isSchedulepageRoute && (
            <button
              className="bg-primaryColour font-serif w-22 h-8 text-white text-sm font-bold py-2 px-3 md:px-4 inline-flex items-center"
              onClick={exportToExcel}
                            disabled={autoScheduleInProgress} // Disable button when auto schedule is in progress

            > 
            
             <FaDownload />
              <span className="hidden font-serif md:inline-block  ml-1" >Export</span>
            </button>
          )}

          {isFacultyListRoute && (
            <button
              className="bg-primaryColour font-serif w-22 h-8 text-white text-sm font-bold py-2 px-3 md:px-4 inline-flex items-center"
              onClick={exportToFaculty}
            >
                         <FaDownload />

              <span className="hidden font-serif md:inline-block ml-1">Export</span>
            </button>
          )}
          {isBatchpageRoute && (
            <button
              className="bg-primaryColour font-serif w-22 h-8 text-white text-sm font-bold py-2 px-3 md:px-4 inline-flex items-center"
              onClick={exportToBatch}
            >
                          <FaDownload />

              <span className="hidden  font-serif md:inline-block  ml-1">Export</span>
            </button>
          )}

          {isLeavePageRoute && (
            <button
              className="bg-primaryColour font-serif w-22 h-8 text-white text-sm font-bold py-2 px-3 md:px-4 inline-flex items-center"
              onClick={exportToLeave}
            >
                        <FaDownload />

              <span className="hidden font-serif md:inline-block  ml-1">Export</span>
            </button>
          )}

          {isReportPageRoute && (
            <button
              className="bg-primaryColour font-serif w-22 h-8 text-white text-sm font-bold py-2 px-3 md:px-4 inline-flex items-center"
              onClick={exportReport}
            >
                           <FaDownload />

              <span className="hidden md:inline-block font-serif ml-1">Export</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default TableHeader;
