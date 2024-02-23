import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { FaCirclePlay } from "react-icons/fa6";

function PodcastCard({ id, title, displayImage }) {
    return (
        <Link to={`/podcast/${id}`}>
            <div className="podcast-card">
                <img className="display-image-podcast" src={displayImage} />
                <div className="title-podcast">
                <p >{title}</p>
                <p><FaCirclePlay /></p>
                </div>
            </div>
        </Link>
    );
}

export default PodcastCard;