import React, { useState } from 'react';
import shortid from 'shortid';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [inviteLink, setInviteLink] = useState('');
  //const navigate = useNavigate();

  const generateInviteLink = async () => {
    // Generate a unique invite link using the shortid library
    const newInviteLink = shortid.generate();

    // TODO: Send invite code to backend

    // Set the state to the new invite link and redirect the user
    setInviteLink(newInviteLink);
  //  navigate.push(`/invite/${newInviteLink}`);
  };

  return (
    <div>
      <h1>Welcome to the landing page!</h1>
      <button onClick={generateInviteLink}>Generate invite link</button>
      {inviteLink && (
        <p>
          Share this link with your friends: <a href={`http://localhost:3000/invite/${inviteLink}`}>{`http://localhost:3000/invite/${inviteLink}`}</a>
        </p>
      )}
    </div>
  );
}

export default LandingPage;
