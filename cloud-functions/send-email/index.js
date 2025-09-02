const functions = require('@google-cloud/functions-framework');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Email templates
const generateContactAutoReply = (name) => {
  return `
Dear ${name},

Thank you for contacting fead.app! We've received your message and appreciate you reaching out to us.

Our team will review your inquiry and respond within 24 hours during business hours. We're committed to providing you with the best possible assistance.

In the meantime, feel free to explore our website to learn more about how our AI-powered Instagram customer support solution can transform your business communications.

If you have any urgent questions, please don't hesitate to reach out again.

Best regards,
The fead.app Team

---
This is an automated response. Please do not reply to this email.
fead.app - Transforming Instagram Customer Support with AI
  `.trim();
};

const generateDemoAutoReply = (name, company) => {
  return `
Dear ${name},

Thank you for your interest in fead.app! We're excited that ${company} is considering our AI-powered Instagram customer support solution.

We've received your demo request and our team will be in touch within 24 hours to:
- Schedule a personalized demo session
- Discuss your specific Instagram support needs
- Show you how our AI can transform your customer interactions
- Answer any questions about implementation and pricing

What you can expect in our demo:
✓ Live demonstration of AI-powered response automation
✓ Integration walkthrough with Instagram Business accounts
✓ Custom solution tailored to your business needs
✓ ROI analysis and implementation timeline

We're looking forward to showing you how fead.app can revolutionize your customer support experience!

Best regards,
The fead.app Team
Sadeq Aldallal
sadeq.aldallal@fead.app

---
This is an automated response. Please do not reply to this email.
fead.app - Transforming Instagram Customer Support with AI
  `.trim();
};

// Initialize Gmail API
async function createTransporter() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'sadeq.aldallal@fead.app',
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

// Send contact form emails
async function sendContactEmail(formData) {
  const transporter = await createTransporter();

  // Send notification email to you
  const notificationMail = {
    from: `"${formData.name}" <sadeq.aldallal@fead.app>`,
    to: 'sadeq.aldallal@fead.app',
    replyTo: formData.email,
    subject: `[Contact Form] ${formData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">New Contact Form Submission</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #22c55e;">
            ${formData.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #666; font-size: 12px;">Sent from fead.app contact form</p>
      </div>
    `
  };

  // Send auto-reply to user
  const autoReplyMail = {
    from: '"fead.app Team" <sadeq.aldallal@fead.app>',
    to: formData.email,
    subject: 'Thank you for contacting fead.app',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <img src="https://fead.app/fead.app_logo.png" alt="fead.app" style="height: 40px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; border-radius: 12px;">
          ${generateContactAutoReply(formData.name).replace(/\n/g, '<br>')}
        </div>
      </div>
    `
  };

  // Send both emails
  await Promise.all([
    transporter.sendMail(notificationMail),
    transporter.sendMail(autoReplyMail)
  ]);

  return { success: true };
}

// Send demo request emails
async function sendDemoEmail(formData) {
  const transporter = await createTransporter();

  // Send notification email to you
  const notificationMail = {
    from: `"${formData.name}" <sadeq.aldallal@fead.app>`,
    to: 'sadeq.aldallal@fead.app',
    replyTo: formData.email,
    subject: `[Demo Request] ${formData.company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">New Demo Request</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Company:</strong> ${formData.company}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #22c55e;">
            ${formData.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div style="background: #22c55e; color: white; padding: 15px; border-radius: 8px; text-align: center;">
          <strong>🎯 High Priority: Demo Request</strong>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Follow up within 24 hours</p>
        </div>
        <p style="color: #666; font-size: 12px;">Sent from fead.app demo request form</p>
      </div>
    `
  };

  // Send auto-reply to user
  const autoReplyMail = {
    from: '"fead.app Team" <sadeq.aldallal@fead.app>',
    to: formData.email,
    subject: 'Your fead.app Demo Request Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <img src="https://fead.app/fead.app_logo.png" alt="fead.app" style="height: 40px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; border-radius: 12px;">
          ${generateDemoAutoReply(formData.name, formData.company).replace(/\n/g, '<br>')}
        </div>
      </div>
    `
  };

  // Send both emails
  await Promise.all([
    transporter.sendMail(notificationMail),
    transporter.sendMail(autoReplyMail)
  ]);

  return { success: true };
}

// HTTP Cloud Function
functions.http('sendEmail', async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { type, formData } = req.body;

    let result;
    if (type === 'contact') {
      result = await sendContactEmail(formData);
    } else if (type === 'demo') {
      result = await sendDemoEmail(formData);
    } else {
      throw new Error('Invalid email type');
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email' 
    });
  }
});