
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./CardHeader.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDrag, useDrop } from "react-dnd";
import LocationContext from "../../context/LocationContext";
import ProgressBar from "@ramonak/react-progress-bar";
import { calculateValueFromDates } from "../../Services/CommonFucntion";
import { getApiService } from "../../Services/Services";
import { Link } from "react-router-dom";
import { FaGripVertical } from "react-icons/fa";
import defaultImage from "../../utils/Images/defaultImage.jpg";

const CardHeader = () => {
  const [facultyCard, setFacultyCard] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [calculateHrs, setCalculateHrs] = useState("");
  const [cardLimitState, SetCrdLimitState] = useState(7);

  let percentage;
  const {
    setModalOpen,
    selectedLocation,
    selectedScheduleType,
    selectedDate,
    compactSizeTable,
    setCompactSize,
    facultyHrsUpdate,
    setFacultyHrsUpdate,
    loading,
    setLoading,
  } = useContext(LocationContext);

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
  const startDate = "2023-09-01T00:00:00";
  const endDate = "2023-09-11T00:00:00"; // 10 days difference
  const conversionRate = 3; // 1 day = 10 units

  const calculatedValue = calculateValueFromDates(
    formattedDates[0],
    formattedDates[1],
    conversionRate
  );

  const getFacultyHrs = async () => {
    const reportURL = `${process.env.REACT_APP_API_URL}/getFacultiesCount?&location_id=${selectedLocation}&starting_date=${formattedDates[0]}&ending_date=${formattedDates[1]}`;
    try {
      const res = await getApiService(reportURL);
      setCalculateHrs(res);
    } catch (err) {
      setCalculateHrs(null);
    }
  };

  const getFacultyCard = async () => {
    let streamCode = "";

    if (selectedScheduleType === "jee/medical") {
      streamCode = "j/m";
    } else if (selectedScheduleType === "foundation") {
      streamCode = "f";
    }
    const url = `http://dev.allen-api.com:5020/api/getfacultydata?q=&limit=&page=&gender=&location_id=${selectedLocation}&sortBy=updated_at&sortOrder=ASC&stream_code=${streamCode}`;

    try {
      const res = await axios.get(url);
      setFacultyCard(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(selectedLocation)
    {

      getFacultyHrs();
    }
  }, [selectedLocation, formattedDates[0], formatDate[1]]);


  useEffect(() => {
    if (facultyHrsUpdate) {
      getFacultyHrs();

      setFacultyHrsUpdate(false);
    }

    getFacultyHrs();
  }, [facultyHrsUpdate, loading]);

  useEffect(() => {
    getFacultyCard();
  }, [selectedScheduleType, selectedLocation]);

  const handleNextCard = () => {
    const nextStartIndex = startIndex + 1;
    setStartIndex(nextStartIndex);
  };

  const handlePrevCard = () => {
    const prevStartIndex = startIndex - 1;
    setStartIndex(prevStartIndex);
  };

  const renderFacultyCards = () => {
    const endIndex = Math.min(startIndex + cardLimitState, total);
    return facultyCard.slice(startIndex, endIndex).map((faculty, index) => {
      const targetFacultyId = faculty?.id || null;
      let percentage = 0;
      let getReportSessionCount = null;
      let calculatedDateRangeDifference = null;

      if (calculateHrs) {
        const filteredData = calculateHrs.Faculties.filter(
          (item) => item?.faculty_id === targetFacultyId
        );
        const totaleCountOfSessionTaken = filteredData[0]?.count || null;
        const values =
          Math.floor((totaleCountOfSessionTaken / calculatedValue) * 100) || 0;
        percentage = values;
        getReportSessionCount = totaleCountOfSessionTaken;
        calculatedDateRangeDifference = calculatedValue;
      }

      return (
        <Link
          to={`/facultyview/${faculty.id}`}
          key={faculty.id}
          style={{
            textDecoration: "none",
            color: "black",
            transition: "color 0.3s",
          }}
        >
          <Card
            key={faculty.id}
            faculty={faculty}
            facultydata={faculty}
            calculateHRs={getReportSessionCount}
            calculatedValue={calculatedDateRangeDifference}
            percentage={percentage}
            moveCard={moveCard}
          />
        </Link>
      );
    });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCheckboxChange = () => {
    setCompactSize(!compactSizeTable);
  };

  const moveCard = (draggedItem, targetItem) => {
    console.log("Moving card from", draggedItem, "to", targetItem);
  };

  const cardsLeft = total - (startIndex + cardLimitState);

  return (
    <nav className="box-border border-b border-gray-400 border-solid pl-4 font-serif">
      <div className="flex items-center  h-24 px-4">
        <button
          className="bg-white hover:bg-gray-100 text-gray-800  text-2xl font-bold py-1 px-3 border border-gray-400 shadow"
          onClick={handleOpenModal}
        >
          +
        </button>

        {startIndex === 0 ? (
          <div className="ml-2 text-2xl text-gray-400 cursor-not-allowed">
            <FaChevronLeft className="fill-current text-gray-200 " />
          </div>
        ) : (
          <div
            className="ml-2 text-2xl cursor-pointer"
            onClick={handlePrevCard}
          >
            <FaChevronLeft className="fill-current text-green-700" />
          </div>
        )}

        <section className="flex ml-2 font-serif text-primaryColour">
          {renderFacultyCards()}
        </section>

        {startIndex + cardLimitState >= total ? (
          <div className="ml-2 text-2xl text-gray-400 cursor-not-allowed ">
            <FaChevronRight className="fill-current  text-gray-200   " />
          </div>
        ) : (
          <div
            className="ml-2 text-2xl cursor-pointer"
            onClick={handleNextCard}
          >
            <FaChevronRight className="fill-current text-green-700" />
          </div>
        )}

        {cardsLeft > 0 && (
          <span className="text-sm">
            {cardsLeft}/{total}
          </span>
        )}
        <div className=" ml-auto mt-2">
          <div className=" flex">
            <label className=" flex">
              <p className="  text-base font-serif  ">Compact View:</p>
              <input
                type="checkbox"
                checked={compactSizeTable}
                onChange={handleCheckboxChange}
                style={{ width: "20px", height: "20px" }}
              />
            </label>
          </div>
          {selectedScheduleType === "foundation" && (
            <div>
              <div className="flex items-end mb-1">
                <div
                  className="ml-4 w-4 h-4 font-serif"
                  style={{ backgroundColor: "#FFD3B0" }}
                ></div>
                <span className="ml-2 text-black text-xs font-semibold font-serif">
                  English
                </span>
              </div>
              <div className="flex items-end mb-1 font-serif">
                <div
                  className="ml-4 w-4 h-4 font-serif"
                  style={{ backgroundColor: "#F2D7D9" }}
                ></div>
                <span className="ml-2 text-black text-xs font-semibold font-serif">
                  Science
                </span>
              </div>
              <div className="flex items-end mb-1 font-serif">
                <div
                  className="ml-4 w-4 h-4 font-serif"
                  style={{ backgroundColor: "#B1D7B4" }}
                ></div>
                <span className="ml-2 text-black text-xs font-semibold font-serif ">
                  History
                </span>
              </div>
            </div>
          )}
        </div>
        {selectedScheduleType === "jee/medical" && (
          <div>
            <div className="flex items-end mb-1">
              <div
                className="ml-4 w-4 h-4 font-serif"
                style={{ backgroundColor: "#1EAE98" }}
              ></div>
              <span className="ml-2 text-black text-xs font-semibold font-serif">
                Physics
              </span>
            </div>
            <div className="flex items-center mb-1 font-serif">
              <div
                className="ml-4 w-4 h-4 font-serif"
                style={{ backgroundColor: "#C2E9FB" }}
              ></div>
              <span className="ml-2 text-black text-xs font-semibold font-serif">
                Chemistry
              </span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className="ml-4 w-4 h-4"
                style={{ backgroundColor: "#FCB69F" }}
              ></div>
              <span className="ml-2 text-black text-xs font-semibold font-serif">
                Maths
              </span>
            </div>
            <div className="flex items-center mb-1">
              <div
                className="ml-4 w-4 h-4 font-serif"
                style={{ backgroundColor: "#FFC371" }}
              ></div>
              <span className="ml-2 text-black text-xs font-semibold font-serif">
                Biology
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CardHeader;

const Card = ({
  faculty,
  facultydata,
  calculatedValue,
  calculateHRs,
  percentage,
  moveCard,
}) => {
  let getReportSessionCount;
  let calculatedDateRangeDifference;

  const subjectCodeColors = {
    E: "#FFD3B0 ",
    S: "#F2D7D9",
    H: "#B1D7B4",
    M: "#FCB69F",
    C: " #C2E9FB",
    P: "#1EAE98",
    B: " #FFC371",
  };

  const [, ref] = useDrag({
    type: "CARD",
    item: { facultydata },
  });

  const [, drop] = useDrop({
    accept: "CARD",
    hover: (draggedItem) => {
      if (draggedItem.facultydata !== facultydata) {
        moveCard(draggedItem.facultydata, facultydata);
        draggedItem.facultydata = facultydata;
      }
    },
  });

  const completed = percentage || 0;
  let bgColor = "#FFFF00"; // Default yellow color
  if (completed >= 70 && completed <= 100) {
    bgColor = "#008000"; // Green for 30% to below 95%
  } else if (completed >= 101) {
    bgColor = "#FF0000"; // red color for 95% and above
  } else {
    bgColor = "#F3C92C"; // yellow color for below 30%
  }

  return (
    <div
      ref={(node) => {
        ref(drop(node));
      }}
      className={`flex flex-col items-center justify-center m-0 mx-1 w-28 h-20 p-1 box-border border bg-white border-gray-400 tooltip`}
      key={faculty.id}
      value={faculty.id}
      style={{
        backgroundColor:
          subjectCodeColors[faculty.subject[0].subject_code] || "black",
        cursor: "grab",
        position: "relative",
      }}
    >
      <span class="tooltiptext font-serif">
        {faculty.first_name + " " + faculty.last_name}
      </span>

      <img
        src={faculty.image_url}
        onError={(e) => {
          e.target.src = defaultImage;
        }}
        className="faculty-card__name rounded-full w-10 h-10 mt-2"
        style={{ cursor: "pointer" }}
      />
      <div
        className="vertical-line font-serif"
        style={{ position: "absolute", top: "0", right: "0" }}
      >
        <FaGripVertical className=" pl-1 " />
      </div>
      <div>
        <span className="mt-1  text-xs font-semibold font-serif">
          {`${faculty.first_name
            .split(" ")[0]
            .charAt(0)
            .toUpperCase()}${faculty.last_name
            .split(" ")[0]
            .charAt(0)
            .toUpperCase()}`}
        </span>
        <span className="ml-2 text-xs font-semibold font-serif">
          ({calculateHRs ? calculateHRs : 0} / {calculatedValue})
        </span>
      </div>

      <ProgressBar
        completed={completed || 0}
        borderRadius={"1px"}
        bgColor={bgColor}
        className="w-full mb-0 "
        height={"12px"}
        customLabel="  "
      />
    </div>
  );
};
