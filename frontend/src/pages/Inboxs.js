import React, { useState , useEffect} from 'react';
import '../styles/Inbox.css';
import axios from 'axios';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      setError('');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        setError('User is not logged in.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/email/fetch-emails', {
          emailAddress: user.email,
        });

        setEmails(response.data.emails);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch emails.');
      }
    };

    fetchEmails();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) return;

    if (activeTab === 'inbox') {
      setFilteredEmails(emails.filter(email => email.to.email == user.email));
    } else if(activeTab === 'outbox') {
      setFilteredEmails(emails.filter(email => email.from.email === user.email));
    }
  }, [activeTab, filteredEmails]);

  const handleNewEmail = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="inbox-container">
      <div className="navbar">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
          </button>
          <button
            className={`nav-tab ${activeTab === 'outbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('outbox')}
          >
            Outbox
          </button>
          <button className="nav-tab">Draft</button>
        </div>
        <div className="search-new-email">
          <input type="text" className="search-bar" placeholder="Search" />
          <button className="new-email-btn" onClick={handleNewEmail}>
            New Email
          </button>
        </div>
      </div>

      <div className="content">
        <div className="email-list">
          {filteredEmails.map((email) => (
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
      {isPopupVisible && <NewEmailPopup onClose={closePopup} />}
    </div>
  );
};


const NewEmailPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <div className="popup-header">
          <h3>New Email</h3>
          <button className="popup-close-btn" onClick={onClose}>
            X
          </button>
        </div>
        <form className="popup-form">
          <div className="form-group">
            <label>To</label>
            <input type="text" placeholder="Enter recipient(s)" />
          </div>
          <div className="form-group">
            <label>CC</label>
            <input type="text" placeholder="Enter CC recipient(s)" />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input type="text" placeholder="Enter subject" />
          </div>
          <div className="form-group">
            <label>Body</label>
            <textarea placeholder="Enter your message" />
          </div>
          <div className="popup-actions">
            <button type="submit" className="popup-send-btn">
              Send
            </button>
            <button type="button" className="popup-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default Inbox;
