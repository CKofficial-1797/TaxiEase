// Brevo API configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3';

// Email templates
const emailTemplates = {
  contactConfirmation: (contact) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inquiry Received</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .inquiry-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .message-box { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .inquiry-id { background: #667eea; color: white; padding: 10px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Inquiry Received!</h1>
          <p>Thank you for contacting TaxiEase</p>
        </div>
        <div class="content">
          <p>Dear ${contact.name},</p>
          <p>We have received your inquiry and our team will get back to you within 24 hours.</p>
          
          <div class="inquiry-id">
            Inquiry ID: ${contact.inquiryId}
          </div>
          
          <div class="inquiry-details">
            <h3>📋 Your Inquiry Details</h3>
            <div class="detail-row">
              <span class="detail-label">Subject:</span>
              <span class="detail-value">${contact.subject}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${contact.inquiryType.charAt(0).toUpperCase() + contact.inquiryType.slice(1)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Submitted:</span>
              <span class="detail-value">${new Date(contact.inquiryDate).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          
          <div class="message-box">
            <h4>Your Message:</h4>
            <p>${contact.message}</p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our team will review your inquiry within 24 hours</li>
            <li>We'll contact you via email or phone to discuss your requirements</li>
            <li>If it's a booking inquiry, we'll provide you with a detailed quote</li>
            <li>For urgent matters, please call us at +91 98765 43210</li>
          </ul>
          
          <p>Thank you for choosing TaxiEase for your one-way trip needs!</p>
          
          <div class="footer">
            <p><strong>TaxiEase</strong></p>
            <p>📞 +91 98765 43210</p>
            <p>📧 info@taxiease.com</p>
            <p>🌐 One-Way Trip Booking Service</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  bookingConfirmation: (booking) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .total-price { background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        .status-completed { background: #d1ecf1; color: #0c5460; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Thank you for choosing TaxiEase for your one-way trip</p>
        </div>
        <div class="content">
          <p>Dear ${booking.name},</p>
          <p>We're excited to confirm your booking! Here are the details:</p>
          
          <div class="booking-details">
            <h3>📋 Booking Information</h3>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">${booking.bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value">
                <span class="status-badge status-${booking.status}">${booking.status}</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Route:</span>
              <span class="detail-value">${booking.region}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Pickup Date:</span>
              <span class="detail-value">${new Date(booking.pickupDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Pickup Time:</span>
              <span class="detail-value">${booking.pickupTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vehicle:</span>
              <span class="detail-value">${booking.vehicleType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Booking Date:</span>
              <span class="detail-value">${new Date(booking.bookingDate).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          <div class="total-price">
            Total Amount: ₹${booking.totalPrice.toLocaleString('en-IN')}
          </div>

          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Our team will contact you within 24 hours to confirm your booking</li>
            <li>Please keep your booking reference number handy for any queries</li>
            <li>Track your booking status anytime using the link sent to your phone</li>
            <li>For any changes or cancellations, contact us at least 2 hours before pickup</li>
          </ul>

          <p>If you have any questions, feel free to contact us.</p>
          <p>Best regards,<br>TaxiEase Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  statusUpdate: (booking, newStatus) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-update { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .status-badge { display: inline-block; padding: 10px 20px; border-radius: 25px; font-size: 16px; font-weight: bold; text-transform: uppercase; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        .status-completed { background: #d1ecf1; color: #0c5460; }
        .booking-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📢 Booking Status Update</h1>
          <p>Your TaxiEase booking status has been updated</p>
        </div>
        <div class="content">
          <p>Dear ${booking.name},</p>
          
          <div class="status-update">
            <h3>Your booking status has been updated to:</h3>
            <span class="status-badge status-${newStatus}">${newStatus}</span>
          </div>

          <div class="booking-info">
            <h3>📋 Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">${booking.bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Route:</span>
              <span class="detail-value">${booking.region}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Pickup Date:</span>
              <span class="detail-value">${new Date(booking.pickupDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vehicle:</span>
              <span class="detail-value">${booking.vehicleType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span class="detail-value">₹${booking.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          ${getStatusMessage(newStatus)}

          <p>If you have any questions, feel free to contact us.</p>
          <p>Best regards,<br>TaxiEase Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// SMS templates
const smsTemplates = {
  bookingConfirmation: (booking) => 
    `Thanks for choosing TaxiEase! Your booking ID: ${booking.bookingId}. Track your one-way trip status: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track/${booking.bookingId}`,

  statusUpdate: (booking, newStatus) => 
    `TaxiEase Update: Your booking ${booking.bookingId} status changed to ${newStatus.toUpperCase()}. Track: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track/${booking.bookingId}`
};

// Helper function to get status-specific messages
function getStatusMessage(status, isSMS = false) {
  const messages = {
    pending: isSMS ? "We're processing your booking." : 
      "<p><strong>Your booking is being processed.</strong></p><p>We'll review your booking and contact you shortly with confirmation details.</p>",
    
    confirmed: isSMS ? "Your trip is confirmed! Get ready for an amazing journey." :
      "<p><strong>🎉 Great news! Your booking is confirmed!</strong></p><p>Your trip is all set. Our team will contact you with further details about your journey.</p>",
    
    cancelled: isSMS ? "Your booking has been cancelled. Contact us for refund details." :
      "<p><strong>Your booking has been cancelled.</strong></p><p>If you have any questions about refunds or need to make a new booking, please contact our support team.</p>",
    
    completed: isSMS ? "Thank you for choosing us! We hope you had a wonderful trip." :
      "<p><strong>Thank you for choosing our services!</strong></p><p>We hope you had a wonderful trip. We'd love to hear about your experience and serve you again in the future.</p>"
  };
  
  return messages[status] || "";
}

// Send email function
export async function sendEmail(to, subject, htmlContent) {
  try {
    if (!BREVO_API_KEY || !process.env.SENDER_EMAIL || !process.env.SENDER_NAME) {
      console.error('❌ Brevo configuration missing');
      return { success: false, error: 'Email configuration missing' };
    }

    const emailData = {
      sender: { 
        email: process.env.SENDER_EMAIL, 
        name: process.env.SENDER_NAME 
      },
      to: [{ email: to.email, name: to.name || to.email }],
      subject: subject,
      htmlContent: htmlContent,
    };

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ Email sent successfully to:", to.email);
    return { success: true, response: result };
  } catch (error) {
    console.error("❌ Email error:", error.message);
    return { success: false, error: error.message };
  }
}

// Helper function to format phone number to international format
function formatPhoneNumber(phoneNumber) {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it already starts with 91 and is 12 digits, add +
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // If it's 10 digits (Indian mobile), add +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it's already in international format, return as is
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // Default: assume it's a 10-digit Indian number
  return `+91${cleaned}`;
}

// Send SMS function
export async function sendSMS(phoneNumber, content) {
  try {
    if (!BREVO_API_KEY || !process.env.SMS_SENDER) {
      console.error('❌ SMS configuration missing');
      return { success: false, error: 'SMS configuration missing' };
    }

    // Format phone number to international format
    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log(`📱 Original phone: ${phoneNumber} → Formatted: ${formattedPhone}`);

    const smsData = {
      sender: process.env.SMS_SENDER,
      recipient: formattedPhone,
      content: content,
      type: "transactional",
    };

    const response = await fetch(`${BREVO_API_URL}/transactionalSMS/send`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(smsData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo SMS API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ SMS sent successfully to:", formattedPhone);
    return { success: true, response: result };
  } catch (error) {
    console.error("❌ SMS error:", error.message);
    return { success: false, error: error.message };
  }
}

// Send contact confirmation notification (EMAIL ONLY)
export async function sendContactConfirmation(contact) {
  const results = { email: null };

  // Send email
  const emailContent = emailTemplates.contactConfirmation(contact);
  results.email = await sendEmail(
    { email: contact.email, name: contact.name },
    `Inquiry Received - ${contact.inquiryId}`,
    emailContent
  );

  return results;
}

// Send booking confirmation notifications
export async function sendBookingConfirmation(booking) {
  const results = { email: null, sms: null };

  // Send email
  const emailContent = emailTemplates.bookingConfirmation(booking);
  results.email = await sendEmail(
    { email: booking.email, name: booking.name },
    `Booking Confirmation - ${booking.bookingId}`,
    emailContent
  );

  // Send SMS
  const smsContent = smsTemplates.bookingConfirmation(booking);
  results.sms = await sendSMS(booking.phone, smsContent);

  return results;
}

// Send status update notifications (EMAIL ONLY - no SMS)
export async function sendStatusUpdate(booking, newStatus) {
  const results = { email: null, sms: null };

  // Send email
  const emailContent = emailTemplates.statusUpdate(booking, newStatus);
  results.email = await sendEmail(
    { email: booking.email, name: booking.name },
    `Booking Status Update - ${booking.bookingId}`,
    emailContent
  );

  // Send SMS for status updates
  const smsContent = smsTemplates.statusUpdate(booking, newStatus);
  results.sms = await sendSMS(booking.phone, smsContent);

  return results;
}

// Test function to verify Brevo setup
export async function testBrevoSetup() {
  console.log("🧪 Testing Brevo setup...");
  
  const testBooking = {
    bookingId: "BK12345678",
    name: "Test User",
    email: "test@example.com",
    phone: "9876543210", // Test with 10-digit format
    region: "Delhi → Ludhiana",
    pickupDate: new Date(),
    pickupTime: "10:00",
    vehicleType: "Sedan",
    totalPrice: 4500,
    status: "pending",
    bookingDate: new Date()
  };

  try {
    const results = await sendBookingConfirmation(testBooking);
    console.log("📧 Email result:", results.email);
    console.log("📱 SMS result:", results.sms);
    
    // Test status update (email only)
    console.log("🔄 Testing status update (email only)...");
    const statusResults = await sendStatusUpdate(testBooking, 'confirmed');
    console.log("📧 Status update email result:", statusResults.email);
    console.log("📱 Status update SMS result:", statusResults.sms);
    
    return { ...results, statusUpdateTest: statusResults };
  } catch (error) {
    console.error("❌ Test failed:", error);
    return { success: false, error: error.message };
  }
}

