import React, { useEffect, useState } from 'react';

function InviteLinkPage({ match }) {
  const inviteLink = match.params.inviteLink;
  const [landingPageUrl, setLandingPageUrl] = useState('');

  useEffect(() => {
    // Make a call to retrieve the landing page URL associated with the invite link from the backend server
    const getLandingPageUrl = async () => {
      try {
       //TODO: Get invite code from server
      } catch (error) {
        console.error(error);
      }
    };

    getLandingPageUrl();
  }, [inviteLink]);

  return (
    <div>
      {landingPageUrl ? (
        <iframe src={landingPageUrl} title="landing page" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default InviteLinkPage;