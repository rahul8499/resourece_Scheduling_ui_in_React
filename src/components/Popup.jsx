import React, { useState } from "react";
import "./popup.css";

const Popup = ({ isOpen,  heading,onClose, children }) => {
    // const [currentHeading, setCurrentHeading] = useState(heading);

    const closePopup = () => {
        // setCurrentHeading(""); // Set the heading to an empty string when closing the popup
        onClose(); // Call the onClose function provided by the parent component
      };
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="header bg-primaryColour">
      <h4 className=" font-serif ">{heading}</h4>
          <button className="close-btn font-serif" onClick={closePopup}>
            X
          </button>
        </div>
        <div className="content font-serif ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
