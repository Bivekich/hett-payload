# Hett Automotive Notification Service

This document provides instructions for setting up and using the Telegram and email notification services for the Hett Automotive website.

## Features

- Send form submissions to Telegram chat
- Send form submissions via email
- Handle both VIN requests and contact form submissions
- Display user-friendly success and error messages
- Prevent multiple submissions with loading states

## Setup

### 1. Telegram Bot Setup

1. Create a new Telegram bot by messaging [@BotFather](https://t.me/botfather) on Telegram
2. Follow the instructions to create a new bot
3. Save the bot token provided by BotFather
4. Create a new group chat and add your bot to it
5. Send a message to the group
6. Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` in your browser
7. Find the `chat` object in the response and copy the `id` value (it will be a negative number for group chats)

### 2. Email Setup

1. Obtain SMTP credentials from your email provider
2. Note down the SMTP host, port, username, and password

### 3. Environment Variables

1. Copy the `.env.local.example` file to `.env.local`
2. Update the following variables with your values:

```
# Telegram notifications configuration
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
NEXT_PUBLIC_TELEGRAM_CHAT_ID=your_telegram_chat_id

# Email notifications configuration
NEXT_PUBLIC_EMAIL_HOST=smtp.example.com
NEXT_PUBLIC_EMAIL_PORT=587
NEXT_PUBLIC_EMAIL_USER=your_email_username
NEXT_PUBLIC_EMAIL_PASS=your_email_password
NEXT_PUBLIC_EMAIL_FROM=Hett Automotive <noreply@hettauto.com>
NEXT_PUBLIC_EMAIL_TO=info@hettauto.com
```

## Usage

The notification service is automatically integrated with:

1. **VIN Request Modal** - Appears when users click the "Request by VIN" button
2. **Contact Form** - Available on the /contact page

### Forms Data Structure

#### VIN Request Form

```typescript
interface VinRequestData {
  name: string;
  phone: string;
  email: string;
  vin: string;
  model: string;
  parts: string;
}
```

#### Contact Form

```typescript
interface ContactFormData {
  [key: string]: string; // Dynamic fields based on CMS configuration
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}
```

## API Endpoints

The service exposes two API endpoints:

1. `/api/vin-request` - Handles VIN request form submissions
2. `/api/contact` - Handles contact form submissions

These endpoints are already integrated with the respective components and don't need to be called manually.

## Customization

### Message Templates

You can customize the notification message templates by modifying the following functions in `src/services/notifications.ts`:

- `formatVinRequestForTelegram`
- `formatVinRequestForEmail`
- `formatContactFormForTelegram`
- `formatContactFormForEmail`

### Success/Error Messages

Success and error messages can be customized in the respective components:

- VIN Request Modal: `src/components/uiKit/VinRequestModal.tsx`
- Contact Form: `src/app/contact/components/ContactForm.tsx`

## Troubleshooting

### Telegram Bot Not Sending Messages

1. Ensure the bot has been added to the chat
2. Verify the bot token and chat ID are correct
3. Check that the bot has permission to send messages in the group

### Email Not Being Sent

1. Verify SMTP credentials
2. Check if the email provider requires special settings (like app passwords for Gmail)
3. Ensure the server allows outgoing SMTP connections

## Security Considerations

- The current implementation exposes environment variables with the `NEXT_PUBLIC_` prefix, which means they are available in the client-side code. In a production environment, consider moving the email and Telegram logic to a secure backend service.
- For production, implement rate limiting to prevent abuse of the form submission endpoints. 