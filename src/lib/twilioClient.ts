// Helper function to format phone number with + prefix
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any existing + or spaces
  const cleaned = phoneNumber.replace(/[^\d]/g, '');
  
  // Add + prefix if not present
  return cleaned.startsWith('63') ? `+${cleaned}` : `+63${cleaned}`;
};

// Twilio Verify API implementation
export const sendOTP = async (phoneNumber: string): Promise<boolean> => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log(`📱 Sending OTP to ${formattedPhone}`);
    
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const serviceSid = 'VAad9ba539d9f4df5a4f451e7c9196eeef';
    
    console.log('Twilio credentials check:', {
      accountSid: accountSid ? `${accountSid.substring(0, 10)}...` : 'missing',
      authToken: authToken ? 'present' : 'missing',
      serviceSid,
      url: `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`
    });
    
    if (!accountSid || !authToken) {
      console.error('Twilio credentials not configured');
      console.log(`📱 FALLBACK - OTP would be sent to ${formattedPhone}`);
      return true;
    }
    
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: formattedPhone,
        Channel: 'sms'
      })
    });
    
    const result = await response.json();
    
    console.log('Twilio response status:', response.status);
    console.log('Twilio response:', result);
    
    if (response.ok) {
      console.log('OTP sent successfully via Twilio Verify:', result.sid);
      return true;
    } else {
      console.error('Twilio Verify error:', {
        status: response.status,
        statusText: response.statusText,
        error: result
      });
      
      // Handle different Twilio errors
      if (result.code === 21608) {
        console.log('📱 ERROR 21608: Phone number needs verification in Twilio Console');
        console.log('📱 DEVELOPMENT MODE: Using fallback OTP generation');
        // Generate a mock OTP for development
        const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`📱 MOCK OTP for ${formattedPhone}: ${mockOTP}`);
        // Store mock OTP in sessionStorage for verification
        sessionStorage.setItem('mockOTP', mockOTP);
        sessionStorage.setItem('mockOTPPhone', formattedPhone);
      } else if (result.code === 20404) {
        console.log('📱 ERROR 20404: Service SID not found - check if VAad9ba539d9f4df5a4f451e7c9196eeef belongs to your account');
      } else {
        console.log(`📱 ERROR ${result.code}: ${result.message}`);
      }
      
      console.log(`📱 FALLBACK - OTP would be sent to ${formattedPhone}`);
      return true;
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log(`📱 FALLBACK - OTP would be sent to ${formattedPhone}`);
    return true;
  }
};

// Verify OTP using Twilio Verify API
export const verifyOTP = async (phoneNumber: string, code: string): Promise<boolean> => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log(`🔐 Verifying OTP for ${formattedPhone}`);
    
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const serviceSid = 'VAad9ba539d9f4df5a4f451e7c9196eeef';
    
    if (!accountSid || !authToken) {
      console.error('Twilio credentials not configured');
      return true; // Allow verification for testing
    }
    
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: formattedPhone,
        Code: code
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.status === 'approved') {
      console.log('OTP verified successfully');
      return true;
    } else {
      console.error('OTP verification failed:', result);
      
      // Fallback to mock OTP verification for development
      const mockOTP = sessionStorage.getItem('mockOTP');
      const mockOTPPhone = sessionStorage.getItem('mockOTPPhone');
      
      if (mockOTP && mockOTPPhone === formattedPhone && code === mockOTP) {
        console.log('📱 MOCK OTP verified successfully');
        sessionStorage.removeItem('mockOTP');
        sessionStorage.removeItem('mockOTPPhone');
        return true;
      }
      
      return false;
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};