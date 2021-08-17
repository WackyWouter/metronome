import './Button.css';
import React from "react";

const Button = ({name, onClick, extraClass, disabled}) => {
    if (disabled) {
        return (
            <div className={`button disabled ${extraClass}`}>{name}</div>
        );
    }
    return (
		<div className={`button ${extraClass}`} onClick={onClick}>{name}</div>
	);
	
};

export default Button;
