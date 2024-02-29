import React from 'react';
import Header from '../components/common/Header';
import CreatePodcastForm from '../components/StartAPodcast/CreatePodcastForm';

// Functional component for the page to create a podcast
function CreateAPodcastPage() {
  return (
    <div>
      {/* Header component */}
      <Header />
      {/* Wrapper for input fields */}
      <div className="input-wrapper space">
        {/* Title for the page */}
        <h1>Create A Podcast</h1>
        {/* Component containing the form for creating a podcast */}
        <CreatePodcastForm />
      </div>
    </div>
  )
}

// Exporting the component
export default CreateAPodcastPage;
