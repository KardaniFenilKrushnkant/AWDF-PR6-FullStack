import React, { useState } from 'react';
import './Contact.css';

/**
 * Contact Page Component
 * Route: /contact
 * Lazy-loaded route component fulfilling Practical 8 core objective.
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  }

  return (
    <div className="contact-page">
      <header className="page-header">
        <div className="header-badge">Route-Based Chunk &bull; Contact.chunk.js</div>
        <h1>Support &amp; Developer Information</h1>
        <p className="header-sub">
          Charotar University of Science and Technology (CHARUSAT) &bull; Department of Information Technology.
          Lazy loaded on demand to prevent loading unnecessary contact assets during initial landing.
        </p>
      </header>

      <div className="contact-layout">
        {/* Contact info cards */}
        <div className="info-column">
          <div className="info-card">
            <h3>🎓 Academic Details</h3>
            <ul className="info-list">
              <li>
                <strong>Course:</strong> Advanced Web Development Frameworks (ITUE301)
              </li>
              <li>
                <strong>Institution:</strong> Charotar University of Science and Technology
              </li>
              <li>
                <strong>Department:</strong> Faculty of Technology and Engineering (FTE)
              </li>
              <li>
                <strong>Program:</strong> B. Tech (IT / CE / CSE / AIML)
              </li>
              <li>
                <strong>Lab Session:</strong> Practical 8 &bull; Performance &amp; Lazy Loading
              </li>
            </ul>
          </div>

          <div className="info-card highlight">
            <h3>⚡ Code Splitting Notice</h3>
            <p>
              This entire page is bundled in <code>Contact.chunk.js</code>. The browser only
              requested and executed this bundle when you clicked the "Contact" tab, saving critical
              bandwidth and parsing time on initial page visit.
            </p>
          </div>
        </div>

        {/* Interactive feedback & inquiry form */}
        <div className="form-column">
          <div className="form-card">
            <h2>Send an Inquiry / Feedback</h2>
            <p className="form-sub">
              Have questions regarding Practical 8 or need support with the Task Management app?
            </p>

            {submitted ? (
              <div className="success-banner">
                <span className="success-icon">✅</span>
                <div>
                  <h4>Thank You for Your Feedback!</h4>
                  <p>Your inquiry has been recorded successfully.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <label>
                    Your Name
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Fenil Kardani"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    Email Address
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="student@charusat.edu.in"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <label>
                  Subject
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="e.g. Question regarding route-based code splitting"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Message
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Write your query or remarks..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </label>

                <button type="submit" className="submit-btn">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
