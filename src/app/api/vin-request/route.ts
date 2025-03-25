import { NextResponse } from 'next/server';
import { sendVinRequest } from '@/services/notifications';
import { VinRequestData } from '@/services/notifications';

export async function POST(request: Request) {
  try {
    const formData: VinRequestData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'vin'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof VinRequestData]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Send the data to Telegram and email
    const result = await sendVinRequest(formData);
    
    if (result.telegram || result.email) {
      return NextResponse.json({
        success: true,
        message: 'VIN request submitted successfully',
        details: result
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send notifications' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in VIN request API route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 