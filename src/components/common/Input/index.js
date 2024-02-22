import React from 'react';
import "./styles.css";

function InputComponent({ type, state, setState, placeholder, required }) {
    return (
        <div>
            <input type={type} value={state} onChange={(e) => setState(e.target.value)} placeholder={placeholder} required={required} className="custom-input"></input>
        </div>
    )
}

export default InputComponent;