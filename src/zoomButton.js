import React, { Component, useState, useEffect } from 'react';

const ButtonContainer = () => {
    let slider = null;
    let outText = null;
    const calcZoom = () => {
        let computedVal = parseInt(slider.value) / 50;
        outText.innerHTML = parseInt(computedVal * 100) + "%";
        setZoomLevel(computedVal);
    };

    useEffect(() => {
        debugger;
        slider = document.querySelector("#zoomRange");
        outText = document.getElementsByClassName("span-text")[0];
    });
    const setZoomLevel = (val) => {
        let transformAttr = window.d3.select("svg g").attr("transform");
        let transformAttrs = transformAttr.split(" ");
        window.d3.select("svg g").attr(
            "transform",
            transformAttrs[0] + " scale(" + val + ")"
        );
    };

    const zoomIn = () => {
        slider.value = parseInt(slider.value) + 1;
        calcZoom();
    };
    const zoomOut = () => {
        slider.value = parseInt(slider.value) - 1;
        calcZoom();
    };

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
