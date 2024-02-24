import { tuple } from "rsuite/esm/@types/utils";
import { updateData } from "./Services";

export function filterDataBySlot(data, slotName) {
  if (Array.isArray(data)) {
    return data.filter((item) =>
      item?.batch?.batch_slots.some((slot) => slot.name === slotName)
    );
  } else {
    // console.log("batch_slots is not defined or not an array.");
    return [];
  }
}

export function calculatePercentage(startDate, endDate, hoursWorkedPerDay) {
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Calculate the difference in milliseconds between the two dates
  const dateDifference = endDate - startDate + oneDayInMilliseconds;
  const numberOfDays = dateDifference / oneDayInMilliseconds;

  // console.log("numberOfDays", numberOfDays)

  // const totalHours = numberOfDays * hoursWorkedPerDay;
  // console.log("otall", totalHours)
  // 28
  // Calculate the percentage of the total working hours
  const maxPossibleHours = numberOfDays * 10;
  // 70
  // console.log("maxPossibleHours", maxPossibleHours)

  // console.log("hoursss", hoursWorkedPerDay )
  // const percentage = (maxPossibleHours - totalHours )

  // const percentage = (totalHours / maxPossibleHours) * 100;
  const percentage = (hoursWorkedPerDay / maxPossibleHours) * 100;

  const formattedPercentage = percentage.toFixed(1);

  // const formattedPercentage = percentage.toFixed(1);

  // const percentage = (totalHours / maxPossibleHours) * 100;

  // console.log("percentage", percentage )

  return formattedPercentage;
}

// export function calculateValueFromDates(startDate, endDate, conversionRate) {
//   // Convert the start and end dates to Date objects
//   const startDateObj = new Date(startDate);
//   const endDateObj = new Date(endDate);

//   // Calculate the difference in milliseconds
//   const timeDifference = endDateObj - startDateObj;

//   // Calculate the number of days in the difference
//   const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

//   // Calculate the value based on the conversion rate
//   const calculatedValue = daysDifference * conversionRate;
//   return calculatedValue;
// }

// Create a utility function to group data by dayOfWeek
export function groupDataByDayOfWeek(data) {
  const groupedData = {};
  // Iterate over each item in the data array
  data.forEach((item) => {
    const day = item.dayOfWeek;
    // If the day does not exist in the groupedData object, create an array for that day
    if (!groupedData[day]) {
      groupedData[day] = [];
    }
    // Push the item to the corresponding day's array
    groupedData[day].push(item);
  });

  return groupedData;
}

// export function filterAndSortDataByWeeksss(data, startDate, endDate, batch_id) {
//   const filteredAndSortedDataByWeek = [];
//   const currentDate = new Date(startDate);
//   const lastDate = new Date(endDate);

//   // Helper function to get formatted date in 'YYYY-MM-DD' format
//   function formatDate(date) {
//     return date.toISOString().split("T")[0];
//   }

//   while (currentDate <= lastDate) {
//     const formattedDate = formatDate(currentDate);
//     const dayOfWeek = currentDate.toLocaleDateString("en-US", {
//       weekday: "long",
//     });

//     const filteredData = data.filter(
//       (item) => item.date === formattedDate && item.batch_id === batch_id
//     );

//     // Sort data for the current date based on slot_time
//     const sortedData = filteredData.sort((a, b) => {
//       const timeA = parseInt(a.slot_time.slot_time.replace(":", ""));
//       const timeB = parseInt(b.slot_time.slot_time.replace(":", ""));
//       return timeA - timeB;
//     });

//     // Add the current date's data to the result array
//     filteredAndSortedDataByWeek.push({
//       batch_id, // Add the batch_id
//       date: formattedDate,
//       day: dayOfWeek,
//       data: sortedData,
//     });

//     // Move to the next date
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   console.log("filteredAndSortedDataByWeek12",filteredAndSortedDataByWeek);

//   return filteredAndSortedDataByWeek;
// }
//foundation

export function filterAndSortDataByWeeksss(
  data,
  startDate,
  endDate,
  batch_id,
  batch_code,
  morningSlots,
  afternoonSlots,
  mornning_time,
  afternoon_time,
  i
) {
  const filteredAndSortedDataByWeek = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  // console.log("batch_id", batch_id);

  // Helper function to get formatted date in 'YYYY-MM-DD' format
  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  while (currentDate <= lastDate) {
    const formattedDate = formatDate(currentDate);
    const dayOfWeek = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const filteredData = data.filter(
      (item) => item.date === formattedDate && item.batch_id === batch_id
    );

    // Sort data for the current date based on slot_time
    // const sortedData = filteredData.sort((a, b) => {
    //   const timeA = parseInt(a.slot_time.slot_time.replace(":", ""));
    //   const timeB = parseInt(b.slot_time.slot_time.replace(":", ""));
    //   return timeA - timeB;
    // });

    // Add the current date's data to the result array
    filteredAndSortedDataByWeek.push({
      date: formattedDate,
      day: dayOfWeek,
      data: filteredData,
    });

    // Move to the next date
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // console.log("filteredAndSortedDataByWeekdddddddd", filteredAndSortedDataByWeek)
  const result = {
    batchid: batch_id,
    batch_code: batch_code,
    mornning_Slots: morningSlots,
    afternoonSlots: afternoonSlots,
    data: filteredAndSortedDataByWeek,
    mornning_time: mornning_time ? mornning_time : " null",
    afternoon_time: afternoon_time ? afternoon_time : " null",
    bathchId: i,
  };

  // console.log("filteredAndSortedDataByWeek123", result)
  return result;
}

export function filterAndSortDataByWeek(data, startDate, endDate, batch_id) {
  const filteredAndSortedDataByWeek = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  // console.log("batch_id", batch_id);

  // Helper function to get formatted date in 'YYYY-MM-DD' format
  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  while (currentDate <= lastDate) {
    const formattedDate = formatDate(currentDate);
    const dayOfWeek = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const filteredData = data.filter(
      (item) => item.date === formattedDate && item.batch_id === batch_id
    );

    // console.log("filteredData", filteredData)

    // Sort data for the current date based on slot_time
    const sortedData = filteredData.sort((a, b) => {
      const timeA = parseInt(a.slotTime.slot_time.replace(":", ""));
      const timeB = parseInt(b.slotTime.slot_time.replace(":", ""));
      return timeA - timeB;
    });

    // Add the current date's data to the result array
    filteredAndSortedDataByWeek.push({
      date: formattedDate,
      day: dayOfWeek,
      data: sortedData,
    });

    // Move to the next date
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // console.log("filteredAndSortedDataByWeek",filteredAndSortedDataByWeek);
  return filteredAndSortedDataByWeek;
}

export function addDataNotFoundMessage(
  filteredAndSortedDataByWeek,
  missingSlotTimes
  // locationNew
) {
  // console.log()
  const updatedData = filteredAndSortedDataByWeek.map((item, outerIndex) => {
    // console.log('filterAndSortDataByWeek', item);
    if (item.data.length === 0) {
      return {
        date: item.date,
        day: item.day,
        data: missingSlotTimes.map((ele, innerIndex) => {
          return {
            index: innerIndex, // Use the innerIndex here
            message: "Data not found",
            slotTime: ele,
            // batchDetails: locationNew[outerIndex],
          };
        }),
      };
    } else {
      const slotTimes = item.data.map(
        (dataItem) => dataItem.slotTime.slot_time
      );
      // console.log("slotttttttttime", slotTimes)
      const missingTimes = missingSlotTimes.filter(
        (time) => !slotTimes.includes(time)
      );
      // console.log("slotTimessssssy", missingTimes)

      // console.log("miiiii", missingTimes)
      const newData = [...item.data];
      missingTimes.forEach((time) => {
        newData.push({
          slotTime: { slot_time: time },
          message: "Data not found",
        });
      });

      // console.log("newwwwwwwwwwwwData", newData)

      return {
        // newData
        date: item.date,
        day: item.day,
        data: newData.sort((a, b) => {
          const timeA = parseInt(a.slotTime.slot_time.replace(":", ""));
          const timeB = parseInt(b.slotTime.slot_time.replace(":", ""));
          return timeA - timeB;
        }),
      };
    }
  });

  return updatedData;
}

// console.log("uuuuuuuuu", updateData)

//----------------- for filtering data for onlyone batch
export function filterDataByBatchId(data, batchId) {
  // console.log('data', data)
  // console.log('bathid', batchId);;
  const filteredData = data.filter((item) => {
    if (item.batch_id === batchId) {
      return true;
    } else if (Array.isArray(item.data) && item.data.length > 0) {
      return item.data.some((nestedItem) => nestedItem.batch_id === batchId);
    }
    return false;
  });

  return filteredData;
}

export function groupDataByBatchId(data) {
  const groupedData = [];

  data.forEach((item) => {
    const existingGroup = groupedData.find(
      (group) => group.batch_id === item.batch_id
    );
    if (existingGroup) {
      existingGroup.data.push(item);
    } else {
      groupedData.push({ batch_id: item.batch_id, data: [item] });
    }
  });

  return groupedData;
}
//

export function getDateRangeWithSlots(
  startDateString,
  endDateString,
  slotTimes
) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

  const dateArray = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const date = currentDate.toISOString().slice(0, 10); // Get the date in 'YYYY-MM-DD' format
    const day = getDayOfWeek(currentDate);
    const slot = slotTimes.map((time) => time); // Clone the array of slotTimes

    dateArray.push({ date, day, slot });

    currentDate = new Date(currentDate.getTime() + oneDay);
  }

  return dateArray;
}

function getDayOfWeek(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}
export function addReportsToFacultyCard(facultyCardState, calculateState) {
  // console.log(calculateState)
  if (!calculateState) {
    // console.log('hits')
    return facultyCardState;
  }
  const updatedFacultyCardState = facultyCardState.map((faculty) => {
    const calculateFaculty = calculateState.find(
      (calc) => calc && calc.id === faculty.id
    );
    if (calculateFaculty) {
      // console.log(calculateFaculty)
      // Add weekly and monthly reports to faculty object
      faculty.week_hours = calculateFaculty.week_hours;
      faculty.month_hours = calculateFaculty.month_hours;
      faculty.year_hours = calculateFaculty.year_hours;
    }
    return faculty;
  });

  return updatedFacultyCardState;
}

export function calculateValueFromDates(startDate, endDate, conversionRatePerDay) {
  // Convert the start and end dates to Date objects
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  let daysDifference = 0;

  // Iterate through each day between the start and end dates
  for (let date = startDateObj; date <= endDateObj; date.setDate(date.getDate() + 1)) {
    // Check if the current day is not Sunday (0 index for Sunday)
    if (date.getDay() !== 0) {
      daysDifference++;
    }
  }

  // Calculate the value based on the remaining weekdays and conversion rate per day
  const calculatedValue = daysDifference * conversionRatePerDay;
  return calculatedValue;
}



export function sortDates(dateArray) {
  const data = dateArray?.leave_records[0].dates;
  return data.sort((a, b) => new Date(a) - new Date(b));
}


export const formatDate = (dateString) => {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function checkWeekStatus(startDate, endDate) {
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Get Monday of current week
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay())); // Get Sunday of current week
  let showButton= false
  // Convert string dates to Date objects
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Check if the start date is after the end of the current week
  if (startDate > endOfWeek) {
    showButton = true
      return showButton ; // Start date is after the current week
  }

  // Check if the end date is before the start of the current week
  if (endDate < startOfWeek) {
      return showButton; // End date is before the current week
  }

  // Otherwise, the start and/or end date is within the current week
  return  showButton; // Start or end date is within the current week
}

