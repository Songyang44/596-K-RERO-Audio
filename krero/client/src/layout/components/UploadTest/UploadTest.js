import React from 'react';

const UploadFile = ({ audioUrl, imageUrl, editableTranscript }) => {
    return (
        <div>
            <h3>Uploaded Data</h3>
            <p><strong>Audio URL:</strong> {audioUrl}</p>
            <p><strong>Image URL:</strong> {imageUrl}</p>
            <p><strong>Editable Transcript:</strong> {editableTranscript}</p>
        </div>
    );
}

export default UploadFile;
