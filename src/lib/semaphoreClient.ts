const TWILIO_API_URL = 'https://api.twilio.com/2010-04-01/Accounts';
const API_KEY = import.meta.env.VITE_TWILIO_API_KEY;

export const sendOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
  try {
    const message = `Your SafeKey verification code is: ${otp}. This code will expire in 10 minutes.`;
    
    // Note: This is a simplified implementation
    // In production, you'd need Account SID and Auth Token
    const response = await fetch(`${TWILIO_API_URL}/messages.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: new URLSearchParams({
        To: phoneNumber,
        Body: message,
        From: '+1234567890' // Replace with your Twilio phone number
      }),
    });

    if (response.ok) {
      return true;
    } else {
      console.error('Twilio SMS error:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};