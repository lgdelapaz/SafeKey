import React, { useState } from 'react';
import Header from '../components/Header';
import { MailIcon, GlobeIcon, SmartphoneIcon, CheckCircleIcon } from 'lucide-react';
const ContactSupport = () => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to a server
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      setSent(true);
      setMessage('');
      setSubject('');
    }, 1000);
  };
  return <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Contact Support" />
      <div className="p-4 pb-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Need help or have feedback?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Our team is here to assist you.
          </p>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Support Channels:
          </h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <MailIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-gray-800 dark:text-white">Email:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  support@safekeyapp.com
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  (placeholder — replace with your actual contact email)
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <GlobeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-gray-800 dark:text-white">Website:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  www.safekeyapp.com/support
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  (optional link)
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <SmartphoneIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-gray-800 dark:text-white">In-App:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Go to Settings → Contact Support to send a message directly
                  from your device.
                </p>
              </div>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            We can help you with:
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
            <li>Password vault setup and troubleshooting</li>
            <li>Questions about app security and encryption</li>
            <li>
              Accessibility features (text size, color contrast, voice assist)
            </li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Our team aims to respond within 24–48 hours on weekdays.
          </p>
          {sent ? <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
              <p className="text-green-700 dark:text-green-300">
                Your message has been sent. We'll respond as soon as possible.
              </p>
            </div> : <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="How can we help you?" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Please describe your issue or question" required></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Send Message
              </button>
            </form>}
        </div>
      </div>
    </div>;
};
export default ContactSupport;