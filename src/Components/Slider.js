import './Slider.css';
import React from "react";

const Slider = ({onChange, value}) => {

    return (
        // Create slider
        <div className="sliderCon">
            <input min="20" max="300" type="range" value={value} onChange={(event) => onChange(event)} className="slider" />
        </div>
    );
}

export default Slider;