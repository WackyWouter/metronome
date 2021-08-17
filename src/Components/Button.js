import './Button.css';
import React from "react";

const Button = ({name, onClick, extraClass, disabled}) => {
    if (disabled) {
        return (
            <div className={`button disabled ${extraClass}`}><span>{name}</span></div>
        );
    }
    return (
		<div className={`button ${extraClass}`} onClick={onClick}><span>{name}</span></div>
	);
	
};

export default Button;
