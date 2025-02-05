import React, { useState, useEffect } from 'react';
import '../styles/NewEmailPopup.css';

const NewEmailPopup = ({ onClose, draftData }) => {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const DRAFTS_KEY = 'draft_emails';

  useEffect(() => {
    if (draftData) {
      setTo(draftData.to || '');
      setCc(draftData.cc || '');
      setSubject(draftData.subject || '');
      setBody(draftData.body || '');
    }
  }, [draftData]);

  const handleClose = () => {
    if (!to && !cc && !subject && !body) {
      onClose();
      return;
    }

    const draft = {
      to,
      cc,
      subject,
      body,
      timestamp: Date.now(),
    };

    let drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY)) || [];

    drafts = drafts.filter(d => Date.now() - d.timestamp < 12 * 60 * 60 * 1000);

    const existingIndex = drafts.findIndex(d => d.timestamp === draftData?.timestamp);

    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    onClose();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
      setError('User is not logged in.');
      return;
    }

    if (!to || !subject || !body) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: user.email,
          to: to.split(',').map((email) => email.trim()),
          cc: cc.split(',').map((email) => email.trim()),
          date: new Date().toISOString(),
          subject,
          body,
        }),
      });

      if (response.ok) {
        setSuccess('Email sent successfully!');
        
        let drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY)) || [];
        drafts = drafts.filter(d => d.timestamp !== draftData?.timestamp);
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));

        setTimeout(() => onClose(), 2000);
      } else {
        setError('Failed to send email.');
      }
    } catch (err) {
      setError('Failed to send email.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <div className="popup-header">
          <h3>New Email</h3>
          <button className="popup-close-btn" onClick={handleClose}>X</button>
        </div>
        <form className="popup-form" onSubmit={handleSend}>
          <div className="form-group">
            <label>To</label>
            <input type="text" placeholder="Enter recipient(s)" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="form-group">
            <label>CC</label>
            <input type="text" placeholder="Enter CC recipient(s)" value={cc} onChange={(e) => setCc(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input type="text" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Body</label>
            <textarea placeholder="Enter your message" value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="popup-actions">
            <button type="submit" className="popup-send-btn">Send</button>
            <button type="button" className="popup-cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmailPopup;
