import React, { useContext, useEffect, useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
// import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import createPlotlyComponent from "react-plotly.js/factory";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import axios from "axios";
import { getApiService } from "../Services/Services";
import LocationContext from "../context/LocationContext";
import TableHeader from "../components/TableHeader/TableHeader";
import './pivot.css'
const Plot = createPlotlyComponent(window.Plotly);
const PlotlyRenderers = createPlotlyRenderers(Plot);

const PivoteTablePage = () => {
    const { selectedDate, selectedLocation } = useContext(LocationContext);
    const selectedDateArray = Array.isArray(selectedDate) ? selectedDate : [];
    const [refresh, setRefresh] = useState(false);
  
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
  
    const [data, setData] = useState([]);
    const [finalData, setFinalData] = useState([]);
    const [state, setState] = useState({
      rows: ["Faculty"], // Default rows
      cols: ["Batch"], // Default columns
    });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (selectedDate && selectedLocation) {
            const url = `${process.env.REACT_APP_API_URL}/getSchedule?starting_date=${startDate}&ending_date=${endDate}&location_id=${selectedLocation}`;
            const response = await getApiService(url);
            setData(response);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [selectedDate, selectedLocation, startDate, endDate]);
    useEffect(() => {
      if (data) {
        const filteredData = data.map((item) => ({
          Faculty : item.faculty.first_name + " " + item.faculty.last_name,
          'Faculty Code': item.faculty.faculty_code,
          Date : item.date,
          Batch : item.batch.batch_code,
          Time: item.slot_time,
          Location: item.location.name,
          'Batch Type': item.batch.batch_types[0].name, // Assuming there's only one batch type
          Subject: item.subject.subject_name,
        }));
        setFinalData(filteredData);
      }
    }, [data, selectedLocation, selectedDate]);
  
    return (
      <>
      <TableHeader
        breadcrumbs={[{ name: "Dashboard" }]}
      />
       <div style={{ width: 'auto', height:"40vw" }} className=" overflow-auto  ml-4  ">
      {!data ? (
        <div className="  pt-40 " style={{margin:"auto", textAlign:"center", justifyContent:"center"}} >No Records to show table</div>
      ) : (
        <PivotTableUI
          data={finalData}
          onChange={(s) => setState(s)}
          renderers={Object.assign({}, TableRenderers)} //PlotlyRenderers
          {...state}
        />
      )}
    </div>
       
      </>
    );
};

export default PivoteTablePage;
