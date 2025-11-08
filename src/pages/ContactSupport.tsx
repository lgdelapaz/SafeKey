import React, { useState, useEffect } from 'react';
import { useForm } from '@formspree/react';
import Header from '../components/Header';
import { MailIcon, GlobeIcon, SmartphoneIcon, CheckCircleIcon, AlertCircleIcon, XIcon } from 'lucide-react';
const ContactSupport = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  // Initialize Formspree hook - Replace 'YOUR_FORM_ID' with your actual Formspree form ID
  // To get a form ID: Go to formspree.io, sign up, and create a new form
  const [state, handleSubmit] = useForm('xvgvgzdy');
  // Show dialog when form submission completes
  useEffect(() => {
    if (state.succeeded) {
      setDialogType('success');
      setShowDialog(true);
      setSubject('');
      setMessage('');
    } else if (state.errors && state.errors.length > 0) {
      setDialogType('error');
      setShowDialog(true);
    }
  }, [state.succeeded, state.errors]);


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
                  lgdelapaz@mymail.mapua.edu.ph
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
          {/* CONTACT FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Subject
                  </label>
                  <input type="text" id="subject" name="subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="How can we help you?" required disabled={state.submitting} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Message
                  </label>
                  <textarea id="message" name="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Please describe your issue or question" required disabled={state.submitting}></textarea>
                </div>
                <button type="submit" disabled={state.submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
        </div>
      </div>
      
      {/* Dialog Box */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {dialogType === 'success' ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                  ) : (
                    <AlertCircleIcon className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {dialogType === 'success' ? 'Message Sent!' : 'Send Failed'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {dialogType === 'success'
                  ? 'Your message has been sent to lgdelapaz@mymail.mapua.edu.ph. We\'ll respond as soon as possible.'
                  : 'There was an error sending your message. Please try again or email us directly.'}
              </p>
              <button
                onClick={() => setShowDialog(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>;
};
export default ContactSupport;