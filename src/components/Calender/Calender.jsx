import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { DateRangePicker } from "rsuite";
import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import LocationContext from "../../context/LocationContext";
import "./Calender.css";

const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
    placement: "left",
  },
  {
    label: "Yesterday",
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: "left",
  },
  {
    label: "This week",
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: "left",
  },
  {
    label: "Last 7 days",
    value: [subDays(new Date(), 6), new Date()],
    placement: "left",
  },
  {
    label: "Last 30 days",
    value: [subDays(new Date(), 29), new Date()],
    placement: "left",
  },
  {
    label: "This month",
    value: [startOfMonth(new Date()), new Date()],
    placement: "left",
  },
  {
    label: "Last month",
    value: [
      startOfMonth(addMonths(new Date(), -1)),
      endOfMonth(addMonths(new Date(), -1)),
    ],
    placement: "left",
  },
  {
    label: "This year",
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last year",
    value: [
      new Date(new Date().getFullYear() - 1, 0, 1),
      new Date(new Date().getFullYear(), 0, 0),
    ],
    placement: "left",
  },
  {
    label: "All time",
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
    placement: "left",
  },
  {
    label: "Last week",
    closeOverlay: false,
    value: (value) => {
      const [start = new Date()] = value || [];
      const lastMonday = addDays(startOfWeek(start, { weekStartsOn: 1 }), -7);
      const lastSunday = endOfWeek(lastMonday, { weekStartsOn: 1 });
      return [lastMonday, lastSunday];
    },
    appearance: "default",
  },
 {
      label: "Next week",
      closeOverlay: false,
      value: (value) => {
        const [start = new Date()] = value || [];
        const nextMonday = addDays(startOfWeek(start, { weekStartsOn: 1 }), 7);
        const nextSunday = endOfWeek(nextMonday, { weekStartsOn: 1 });
        return [nextMonday, nextSunday];
      },
    appearance: "default",
  },
];

const Calender = () => {
  const { selectedDate, setSelectedDate } = useContext(LocationContext);
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - daysToSubtract);
      const daysToAdd = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + daysToAdd);
      handleDateChange([startOfWeek, endOfWeek]);
    }
  }, [selectedDate, handleDateChange]);

  return (
    <div>
      <DateRangePicker
        value={selectedDate}
        onChange={handleDateChange}
        ranges={predefinedRanges}
        showOneCalendar
        placeholder="Calendar"
        className="text-base custom-date-picker "
        style={{ width: 300, height: 20  ,}}
        format="dd-MM-yyyy" // Use "dd" for days of the month
      />
    </div>

    
  );
};

export default Calender;






