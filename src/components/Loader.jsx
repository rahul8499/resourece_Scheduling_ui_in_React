import React from 'react'
import './loader.css'; // You can style your loader in a separate CSS file

const Loader = ({ message }) => {
  
    return (
      <>
      <div className="loader-overlay  ">
        <div className=' mt-64  '>

      <div className="loader-container  ">
        <div className="loader font-serif">
          
        </div>
      </div>
      <div className="loader-message font-serif">{message}</div>
        </div>
    </div>
      </>
        // <div className="loader-container">
        //   <div className="loader"></div>
        // </div>
      );
}

export default Loader