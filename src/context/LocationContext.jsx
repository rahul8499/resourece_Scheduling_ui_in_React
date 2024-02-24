import React, { createContext, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hasSchedule, setHasSchedule] = useState(false);
  const [ScheduleStatusCheck, setScheduleStatusCheck] = useState(false);

  const [facultyHrsUpdate, setFacultyHrsUpdate] = useState(false);
  const [selectedScheduleType, setselectedScheduleType] =
    useState("jee/medical");
  // const [cardHeaderRefresh, setcardHeaderRefresh] = useState(false)
  const [loading, setLoading] = useState(false);
  const [compactSizeTable, setCompactSize] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateUpcomingSche, setSelectedDateUpcomingSche] = useState("");
  const [selectedDateHistorySche, setSelectedDateHistorySche] = useState("");
  const [selectedDateLeave, setSelectedDateLeave] = useState("");
  const [modalOpen, setModalOpen] = useState();
  const [modalOpenEdit, setModalOpenEdit] = useState();
  const [refreshTable, setRefreshTable] = useState(false);
  const [getSchedulingDataState, setSchedulingDataState] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [time, setTime] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [modalDate, setModalDate] = useState("");
  const [selectedSubjectid, setSelectedSubjectid] = useState("");
  const [scheduleRefresh, setScheduleRefresh] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  return (
    <LocationContext.Provider
      value={{
        facultyHrsUpdate,
        setFacultyHrsUpdate,
        selectedDateUpcomingSche,
        setSelectedDateUpcomingSche,
        selectedDateHistorySche,
        setSelectedDateHistorySche,
        selectedDateLeave,
        setSelectedDateLeave,
        loaderMessage,
        setLoaderMessage,
        scheduleRefresh,
        setScheduleRefresh,
        refreshTable,
        ScheduleStatusCheck,
        setScheduleStatusCheck,
        hasSchedule,
        setHasSchedule,
        setRefreshTable,
        compactSizeTable,
        setCompactSize,
        selectedSubjectid,
        getSchedulingDataState,
        setSchedulingDataState,
        loading,
        setLoading,
        setSelectedSubjectid,
        modalDate,
        setModalDate,
        editItemId,
        setEditItemId,
        selectedLocation,
        setSelectedLocation,
        selectedScheduleType,
        setselectedScheduleType,
        selectedDate,
        setSelectedDate,
        modalOpen,
        setModalOpen,
        modalOpenEdit,
        setModalOpenEdit,
        time,
        setTime,
        selectedTime,
        setSelectedTime,
        setSelectedSubject,
        selectedSubject,
        selectedFaculty,
        setSelectedFaculty,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
