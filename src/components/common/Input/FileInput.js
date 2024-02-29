import React, { useState } from 'react';

// FileInput component renders an input field for selecting files
function FileInput({ accept, id, fileHandleFun, text }) {
    // State to track the selected file
    const [fileSelected, setFileSelected] = useState("");

    // Function to handle file selection
    const onChange = (e) => {
        // Update the selected file name
        setFileSelected(e.target.files[0].name);
        // Pass the selected file to the parent component's function
        fileHandleFun(e.target.files[0]);
    }

    return (
        <>
            {/* Label for file input */}
            <label htmlFor={id} className={`custom-input ${!fileSelected ? "label-input" : "active"}`}>
                {/* Display the selected file name or the default text */}
                {fileSelected ? `The File ${fileSelected} was Selected` : text}
            </label>
            {/* Hidden file input */}
            <input type='file' accept={accept} id={id} style={{ display: 'none' }} onChange={onChange} />
        </>
    );
}

export default FileInput;
