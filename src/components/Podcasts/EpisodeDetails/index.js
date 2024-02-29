import React from 'react';
import Button from '../../common/Button';

// EpisodeDetails component to display details of each episode
function EpisodeDetails({ index, title, description, audioFile, onClick, isPlaying }) {
  return (
    <div style={{ width: "100%" }}>
      {/* Episode title */}
      <h2 style={{ textAlign: "left", marginBottom: 0 }}>{index}. {title}</h2>
      {/* Episode description */}
      <p style={{ marginLeft: "1.5rem" }} className='podcast-description'>{description}</p>
      {/* Play button */}
      <Button style={{ width: "100px" }} text={"Play"} onClick={() => onClick(audioFile)} />
    </div>
  );
}

export default EpisodeDetails;
