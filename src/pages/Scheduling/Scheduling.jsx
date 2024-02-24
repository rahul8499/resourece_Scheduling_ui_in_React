import React, { useContext, useEffect, useState } from "react";
import TableHeader from "../../components/TableHeader/TableHeader";
import CardHeader from "../../components/CardHeader/CardHeader";
import Table from "../../components/Table/Table";
import Foundation_table from "../../components/Table/Foundation_table";
import Loader from "../../components/Loader"; // Replace with your actual loader component

import LocationContext from "../../context/LocationContext";
import { Modal } from "../../components/Modal/Modal";
import { getApiService } from "../../Services/Services";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { EditSchedule } from "../../components/Table/EditSchedule";
import axios from "axios";

const SchedulingPage = () => {
  // const [loading, setLoading] = useState(false);

  const {
    setSelectedSubject,
    loading,
    setLoading,
    selectedSubject,
    setSelectedFaculty,
    setSelectedSubjectid,
    selectedSubjectid,
    setModalDate,
    modalDate,
    selectedLocation,

    modalOpen,
    setModalOpen,

    selectedTime,
    setSelectedTime,
    selectedFaculty,
    modalOpenEdit,
    setModalOpenEdit,
    refreshTable,

    selectedScheduleType,

    setScheduleStatusCheck,
    loaderMessage,
    setFacultyHrsUpdate,

    setScheduleRefresh,
  } = useContext(LocationContext);

  let createScheudleURL = `http://dev.allen-api.com:5020/api/createSchedule`;
  if (selectedScheduleType === "foundation") {
    createScheudleURL += "/foundation";
  }

  const postData = {
    location_id: selectedLocation,
    batch_id: localStorage.getItem("item"),
    faculty_id: selectedFaculty.value,
    subject_id: selectedSubjectid,
    slot_time: selectedTime,
    date: modalDate,
  };

  const handleCloseModal = () => {
    localStorage.removeItem("item");

    setSelectedFaculty("");
    setModalDate(""); //create la

    setModalOpen(false);
    setSelectedFaculty("");
    setModalDate("");
    setSelectedSubjectid("");
    setSelectedTime("");
  };
  const handleEditCloseModal = () => {
    localStorage.removeItem("item");
    setSelectedFaculty("");
    setModalDate("");

    setModalOpenEdit(false);
  };

  const createScheduling = async () => {
    const url = createScheudleURL;
    const response = await axios
      .post(url, postData)
      .then((res) => {
        setFacultyHrsUpdate(true);
        setScheduleStatusCheck(true);
        setScheduleRefresh(true);

        toast.success("Schedule Successfully Created.. ", {
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
        setSelectedFaculty("");
        setModalDate("");
        setSelectedSubjectid("");
        setSelectedTime("");
        setModalOpen(false);
      })
      .catch((err) => {
        setFacultyHrsUpdate(false);

        setModalOpen(true);
        setScheduleRefresh(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createScheduling();
  };

  return (
    <>
      <ToastContainer />
      <div className="">
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />

        <EditSchedule isOpen={modalOpenEdit} onClose={handleEditCloseModal} />

        <div>
          {selectedScheduleType === "jee/medical" ? (
            <TableHeader breadcrumbs={[{ name: "JEE/Medical Schedule" }]} />
          ) : null}
          {selectedScheduleType === "foundation" ? (
            <TableHeader breadcrumbs={[{ name: "Foundation Schedule " }]} />
          ) : null}
        </div>
        <div>
          <CardHeader />
        </div>
      </div>
      <div className="mt-1 overflow-auto ">
        {loading && <Loader message={loaderMessage} />}

        {selectedScheduleType === "jee/medical" ? (
          <Table key={refreshTable} />
        ) : selectedScheduleType === "foundation" ? (
          <Foundation_table key={refreshTable} />
        ) : null}
      </div>
    </>
  );
};

export default SchedulingPage;
