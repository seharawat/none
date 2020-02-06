import React, { Component, useState, useEffect } from 'react';

const ButtonContainer = (props) => {
   
    return (

        <div className="container-buttons">
            <div className="slider-button second-button">
                <span onClick={zoomOut} className="button-icon"></span>
            </div>
            <div className="slidecontainer">
                <input
                    type="range"
                    min="10"
                    max="100"
                    defaultValue="50"
                    className="slider"
                    id="zoomRange"
                    onChange={calcZoom}
                />
            </div>
            <div className="slider-button third-button">
                <span onClick={zoomIn} className="button-icon"></span>
            </div>
            <div className="div-text">
                <span className="span-text">100%</span>
            </div>
        </div>
    )
}

export default ButtonContainer;
