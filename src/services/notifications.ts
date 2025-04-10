import axios from 'axios';
import nodemailer from 'nodemailer';

// Types for the form data
export interface VinRequestData {
  name: string;
  phone: string;
  email: string;
  vin: string;
  model: string;
  parts: string;
}

export interface ContactFormData {
  [key: string]: string; // Dynamic fields based on form configuration
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// Configuration (should be moved to environment variables in production)
const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || 'YOUR_TELEGRAM_CHAT_ID';

const EMAIL_HOST = process.env.NEXT_PUBLIC_EMAIL_HOST || 'smtp.example.com';
const EMAIL_PORT = parseInt(process.env.NEXT_PUBLIC_EMAIL_PORT || '587');
const EMAIL_USER = process.env.NEXT_PUBLIC_EMAIL_USER || 'user@example.com';
const EMAIL_PASS = process.env.NEXT_PUBLIC_EMAIL_PASS || 'password';
const EMAIL_FROM = process.env.NEXT_PUBLIC_EMAIL_FROM || 'Hett Automotive <noreply@hettauto.com>';
const EMAIL_TO = process.env.NEXT_PUBLIC_EMAIL_TO || 'info@hettauto.com';

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Add getCurrentCount function
async function getCurrentCount(type: 'contact_form' | 'vin_request'): Promise<number> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/email-metrics?where[type][equals]=${type}`);
    const data = await response.json();
    if (data.docs && data.docs.length > 0) {
      return data.docs[0].count || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting current count:', error);
    return 0;
  }
}

// Add incrementEmailCount function
async function incrementEmailCount(type: 'contact_form' | 'vin_request'): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/email-metrics?where[type][equals]=${type}`);
    const data = await response.json();
    
    if (data.docs && data.docs.length > 0) {
      const metric = data.docs[0];
      await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/email-metrics/${metric.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: (metric.count || 0) + 1,
          lastSentAt: new Date().toISOString()
        }),
      });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/email-metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          count: 1,
          lastSentAt: new Date().toISOString()
        }),
      });
    }
  } catch (error) {
    console.error('Error updating email metrics:', error);
  }
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    });
    return response.data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

/**
 * Send an email
 */
export async function sendEmail(subject: string, text: string, html: string): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Format VIN request data for Telegram message
 */
function formatVinRequestForTelegram(data: VinRequestData, requestNumber: number): string {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
🚗 <b>НОВЫЙ ЗАПРОС ПО VIN #${requestNumber}</b> 🚗
📅 <i>${currentDate}</i>

👤 <b>Имя:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone}
✉️ <b>Email:</b> ${data.email}
🔢 <b>VIN:</b> <code>${data.vin}</code>
🚘 <b>Модель:</b> ${data.model}
🔧 <b>Запчасти:</b> 
${data.parts}

#vin_запрос #hett_automotive
`;
}

/**
 * Format Contact form data for Telegram message
 */
function formatContactFormForTelegram(data: ContactFormData, requestNumber: number): string {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let message = `
📝 <b>НОВОЕ СООБЩЕНИЕ С ФОРМЫ ОБРАТНОЙ СВЯЗИ #${requestNumber}</b> 📝
📅 <i>${currentDate}</i>
`;

  // Add all form fields to the message with emojis based on field names
  Object.entries(data).forEach(([key, value]) => {
    let emoji = '📋';
    
    // Assign emojis based on common field names
    if (key.toLowerCase().includes('name') || key.toLowerCase().includes('имя')) emoji = '👤';
    if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('телефон')) emoji = '📞';
    if (key.toLowerCase().includes('email') || key.toLowerCase().includes('почта')) emoji = '✉️';
    if (key.toLowerCase().includes('message') || key.toLowerCase().includes('сообщение')) emoji = '💬';
    if (key.toLowerCase().includes('company') || key.toLowerCase().includes('компания')) emoji = '🏢';
    if (key.toLowerCase().includes('subject') || key.toLowerCase().includes('тема')) emoji = '📌';
    
    message += `\n${emoji} <b>${key}:</b> ${value}`;
  });
  
  message += `\n\n#обратная_связь #hett_automotive`;

  return message;
}

/**
 * Format VIN request data for email message
 */
function formatVinRequestForEmail(data: VinRequestData, requestNumber: number): { text: string; html: string } {
  const currentDate = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const text = `
Новый запрос по VIN #${requestNumber}

Имя: ${data.name}
Телефон: ${data.phone}
Email: ${data.email}
VIN: ${data.vin}
Модель: ${data.model}
Запчасти: ${data.parts}

Отправлено: ${currentDate}
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Новый запрос по VIN #${requestNumber}</title>
  <style>
    body {
      font-family: 'Roboto Condensed', Arial, sans-serif;
      line-height: 1.5;
      color: #181818;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 20px;
    }
    
    .logo {
      color: #38AE34;
      font-size: 24px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .title {
      color: #38AE34;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .date {
      color: #8898A4;
      margin-bottom: 20px;
      font-size: 14px;
    }
    
    .field {
      margin-bottom: 12px;
    }
    
    .field-label {
      font-weight: 700;
      margin-right: 8px;
      color: #181818;
    }
    
    .field-value {
      color: #333;
    }
    
    .highlight {
      background-color: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #38AE34;
      margin-bottom: 12px;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      color: #8898A4;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Hett Automotive</div>
    </div>
    
    <div class="title">Новый запрос по VIN #${requestNumber}</div>
    <div class="date">${currentDate}</div>
    
    <div class="highlight">
      <div class="field">
        <span class="field-label">Номер запроса:</span>
        <span class="field-value">${requestNumber}</span>
      </div>
    </div>
    
    <div class="field">
      <span class="field-label">Имя:</span>
      <span class="field-value">${data.name}</span>
    </div>
    
    <div class="field">
      <span class="field-label">Телефон:</span>
      <span class="field-value">${data.phone}</span>
    </div>
    
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${data.email}</span>
    </div>
    
    <div class="highlight">
      <div class="field">
        <span class="field-label">VIN:</span>
        <span class="field-value">${data.vin}</span>
      </div>
    </div>
    
    <div class="field">
      <span class="field-label">Модель:</span>
      <span class="field-value">${data.model}</span>
    </div>
    
    <div class="field">
      <span class="field-label">Запчасти:</span>
      <div class="field-value" style="white-space: pre-line">${data.parts}</div>
    </div>
    
    <div class="footer">
      &copy; ${new Date().getFullYear()} Hett Automotive. Все права защищены.
    </div>
  </div>
</body>
</html>
`;

  return { text, html };
}

/**
 * Format Contact form data for email message
 */
function formatContactFormForEmail(data: ContactFormData, requestNumber: number): { text: string; html: string } {
  let textContent = `Новое сообщение с формы обратной связи #${requestNumber}\n\n`;
  textContent += `Номер обращения: ${requestNumber}\n\n`;
  
  // Add all form fields to the message
  Object.entries(data).forEach(([key, value]) => {
    textContent += `${key}: ${value}\n`;
  });

  // Start building the HTML email
  let formFieldsHtml = '';
  
  // Add request number first
  formFieldsHtml += `
  <div class="highlight">
    <div class="field">
      <span class="field-label">Номер обращения:</span>
      <span class="field-value">${requestNumber}</span>
    </div>
  </div>`;
  
  Object.entries(data).forEach(([key, value]) => {
    // Check if the value might be a longer message
    const isMessage = 
      key.toLowerCase().includes('message') || 
      key.toLowerCase().includes('сообщение') ||
      value.length > 100;
    
    if (isMessage) {
      formFieldsHtml += `
      <div class="field" style="margin-bottom: 20px;">
        <div class="field-label">${key}:</div>
        <div class="message-box">${value.replace(/\n/g, '<br>')}</div>
      </div>`;
    } else {
      formFieldsHtml += `
      <div class="field">
        <span class="field-label">${key}:</span>
        <span class="field-value">${value}</span>
      </div>`;
    }
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Новое сообщение с формы обратной связи #${requestNumber}</title>
  <style>
    body {
      font-family: 'Roboto Condensed', Arial, sans-serif;
      line-height: 1.5;
      color: #181818;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 20px;
    }
    
    .logo {
      color: #38AE34;
      font-size: 24px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .title {
      color: #38AE34;
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .date {
      color: #8898A4;
      margin-bottom: 20px;
      font-size: 14px;
    }
    
    .field {
      margin-bottom: 12px;
    }
    
    .field-label {
      font-weight: 700;
      margin-right: 8px;
      color: #181818;
    }
    
    .field-value {
      color: #333;
    }
    
    .message-box {
      background-color: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #38AE34;
      margin-top: 8px;
      white-space: pre-line;
    }
    
    .highlight {
      background-color: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #38AE34;
      margin-bottom: 12px;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      color: #8898A4;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Hett Automotive</div>
    </div>
    
    <div class="title">Новое сообщение с формы обратной связи #${requestNumber}</div>
    <div class="date">${new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</div>
    
    ${formFieldsHtml}
    
    <div class="footer">
      &copy; ${new Date().getFullYear()} Hett Automotive. Все права защищены.
    </div>
  </div>
</body>
</html>
`;

  return { text: textContent, html: html };
}

/**
 * Send VIN request to Telegram and email
 */
export async function sendVinRequest(data: VinRequestData): Promise<{ telegram: boolean; email: boolean }> {
  try {
    // Get current count before sending
    const currentCount = await getCurrentCount('vin_request');
    const newCount = currentCount + 1;

    // Format messages with request number
    const telegramMessage = formatVinRequestForTelegram(data, newCount);
    const { text, html } = formatVinRequestForEmail(data, newCount);

    // Send notifications
    const telegramResult = await sendTelegramMessage(telegramMessage);
    const emailResult = await sendEmail(
      `[hettautomotive.ru] Запрос по VIN #${newCount} от ${data.name}`,
      text,
      html
    );

    // If either notification was sent successfully, increment the counter
    if (telegramResult || emailResult) {
      await incrementEmailCount('vin_request');
    }

    return {
      telegram: telegramResult,
      email: emailResult,
    };
  } catch (error) {
    console.error('Error sending VIN request:', error);
    return {
      telegram: false,
      email: false,
    };
  }
}

/**
 * Send Contact form submission to Telegram and email
 */
export async function sendContactForm(data: ContactFormData): Promise<{ telegram: boolean; email: boolean }> {
  try {
    // Get current count before sending
    const currentCount = await getCurrentCount('contact_form');
    const newCount = currentCount + 1;

    // Format messages with request number
    const telegramMessage = formatContactFormForTelegram(data, newCount);
    const { text, html } = formatContactFormForEmail(data, newCount);

    // Send notifications
    const telegramResult = await sendTelegramMessage(telegramMessage);
    const emailResult = await sendEmail(
      `[hettautomotive.ru] Сообщение с формы обратной связи #${newCount} от ${data.name || 'посетителя'}`,
      text,
      html
    );

    // If either notification was sent successfully, increment the counter
    if (telegramResult || emailResult) {
      await incrementEmailCount('contact_form');
    }

    return {
      telegram: telegramResult,
      email: emailResult,
    };
  } catch (error) {
    console.error('Error sending contact form:', error);
    return {
      telegram: false,
      email: false,
    };
  }
} 