import React from 'react';
import "./styles.css";

// InputComponent renders a custom input field
function InputComponent({ type, state, setState, placeholder, required }) {
    return (
        <div>
            {/* Input field with custom styling */}
            <input 
                type={type}                // Input type (e.g., text, password)
                value={state}              // Value of the input field
                onChange={(e) => setState(e.target.value)}  // Function to handle input changes
                placeholder={placeholder} // Placeholder text for the input field
                required={required}        // Flag indicating if the input is required
                className="custom-input"   // Custom CSS class for styling
            />
        </div>
    );
}

export default InputComponent;
