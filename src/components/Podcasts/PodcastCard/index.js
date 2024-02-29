import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";

// PodcastCard component to display a card for each podcast
function PodcastCard({ id, title, displayImage }) {
    return (
        // Link to the podcast details page
        <Link to={`/podcast/${id}`}>
            {/* Podcast card container */}
            <div className="podcast-card">
                {/* Display image of the podcast */}
                <img className="display-image-podcast" src={displayImage} />
                {/* Title and play icon */}
                <div className="title-podcast">
                    <p>{title}</p>
                    {/* Play icon */}
                    <p><FaCirclePlay /></p>
                </div>
            </div>
        </Link>
    );
}

export default PodcastCard;
