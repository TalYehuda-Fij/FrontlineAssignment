import React, { useState } from 'react';
import '../styles/Inbox.css';

const Inbox = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const emails = [
    {
      id: 1,
      sender: 'Bob Marley',
      subject: 'Important meeting about...',
      body: "Hey, I just wanted to remind you that...",
      time: '7:50 PM',
    },
    {
      id: 2,
      sender: 'Stephan King',
      subject: 'New Book Announcement',
      body: 'We are excited to announce that the book...',
      time: '1:30 AM',
    },
    {
      id: 3,
      sender: 'UI Tutorials',
      subject: 'How to Use Placeholder Text...',
      body: 'A great email marketing campaign starts...',
      time: '5:32 PM',
    },
  ];

  return (
    <div className="inbox-container">
      <div className="navbar">
        <div className="nav-tabs">
          <button className="nav-tab active">Inbox</button>
          <button className="nav-tab">Outbox</button>
          <button className="nav-tab">Draft</button>
        </div>
        <div className="search-new-email">
          <input type="text" className="search-bar" placeholder="Search" />
          <button className="new-email-btn">New Email</button>
        </div>
      </div>

      <div className="content">
        <div className="email-list">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`email-item ${
                selectedEmail?.id === email.id ? 'selected' : ''
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <h4>{email.sender}</h4>
              <p>{email.subject}</p>
              <span className="email-time">{email.time}</span>
            </div>
          ))}
        </div>

        {selectedEmail && (
          <div className="email-viewer">
            <h3>{selectedEmail.subject}</h3>
            <p>From: {selectedEmail.sender}</p>
            <p>{selectedEmail.body}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
