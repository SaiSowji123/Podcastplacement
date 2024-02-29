import React from 'react';
import "./styles.css"

// Button component renders a custom button
function Button({ text, onClick, disabled, style }) {
  return (
    // Div container representing the button
    <div onClick={onClick} className="custom-btn" disabled={disabled} style={style}>
      {/* Button text */}
      {text}
    </div>
  );
}

export default Button;
