import React, { useState, useEffect } from 'react';
import '../styles/Inbox.css';
import axios from 'axios';
import NewEmailPopup from './NewEmailPopup';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [draftToEdit, setDraftToEdit] = useState(null);

  const DRAFTS_KEY = 'draft_emails';

  useEffect(() => {
    const fetchEmails = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) return;

      try {
        const response = await axios.post('http://localhost:5000/api/email/fetch-emails', {
          emailAddress: user.email,
        });
        setEmails(response.data.emails);
      } catch (err) {
        console.error('Failed to fetch emails.');
      }
    };

    fetchEmails();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) return;

    if (activeTab === 'inbox') {
      setFilteredEmails(emails.filter(email => email.to.email === user.email));
    } else if (activeTab === 'outbox') {
      setFilteredEmails(emails.filter(email => email.from.email === user.email));
    } else if (activeTab === 'draft') {
      let drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY)) || [];
      drafts = drafts.filter(d => Date.now() - d.timestamp < 12 * 60 * 60 * 1000);
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
      setFilteredEmails(drafts);
    }
  }, [activeTab, emails]);

  const handleNewEmail = () => {
    setDraftToEdit(null);
    setIsPopupVisible(true);
  };

  const openDraft = (draft) => {
    setDraftToEdit(draft);
    setIsPopupVisible(true);
  };

  return (
    <div className="inbox-container">
      <div className="navbar">
        <div className="nav-tabs">
          <button className={`nav-tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
            Inbox
          </button>
          <button className={`nav-tab ${activeTab === 'outbox' ? 'active' : ''}`} onClick={() => setActiveTab('outbox')}>
            Outbox
          </button>
          <button className={`nav-tab ${activeTab === 'draft' ? 'active' : ''}`} onClick={() => setActiveTab('draft')}>
            Drafts
          </button>
        </div>
        <div className="search-new-email">
          <input type="text" className="search-bar" placeholder="Search" />
          <button className="new-email-btn" onClick={handleNewEmail}>New Email</button>
        </div>
      </div>

      <div className="content">
        <div className="email-list">
          {filteredEmails.length === 0 ? (
            <p className="no-emails">No emails in this tab.</p>
          ) : (
            filteredEmails.map((email, index) => (
              <div
                key={index}
                className="email-item"
                onClick={() => activeTab === 'draft' ? openDraft(email) : setSelectedEmail(email)}
              >
                <h4>{email.subject || "No Subject"}</h4>
                <p>{email.body.slice(0, 50)}...</p>
                <span className="email-time">{activeTab === 'draft' ? "Draft" : email.time}</span>
              </div>
            ))
          )}
        </div>

        {selectedEmail && activeTab !== 'draft' && (
          <div className="email-viewer">
            <h3>{selectedEmail.subject}</h3>
            <p>
              <strong>From:</strong> {selectedEmail.from?.email || selectedEmail.from || "Unknown Sender"}
            </p>
            <p>{selectedEmail.body}</p>
          </div>
        )}
      </div>
      {isPopupVisible && <NewEmailPopup onClose={() => setIsPopupVisible(false)} draftData={draftToEdit} />}
    </div>
  );
};

export default Inbox;
