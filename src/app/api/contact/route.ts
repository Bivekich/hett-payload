import { NextResponse } from 'next/server';
import { sendContactForm } from '@/services/notifications';
import { ContactFormData } from '@/services/notifications';

export async function POST(request: Request) {
  try {
    const formData: ContactFormData = await request.json();
    
    // Validate required fields
    if (!formData.email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Send the data to Telegram and email
    const result = await sendContactForm(formData);
    
    if (result.telegram || result.email) {
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully',
        details: result
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send notifications' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in contact API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 