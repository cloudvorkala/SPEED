import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/config/api';

// Handle GET requests to fetch admin configuration
export async function GET(req: NextRequest) {
  try {
    // Extract the JWT token from the Authorization header (e.g., "Bearer <token>")
    const token = req.headers.get('authorization')?.split(' ')[1];

    // Send request to the backend API to fetch admin configuration
    const response = await fetch(`${API_ENDPOINTS.ADMIN}/config`, {
      headers: {
        'Authorization': `Bearer ${token}` // Send token in Authorization header
      }
    });

    // If the request fails, throw an error to trigger the catch block
    if (!response.ok) {
      throw new Error('Failed to fetch configuration');
    }

    // Parse and return the JSON data
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log error and return a 500 status with a custom error message
    console.error('Config fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

// Handle PUT requests to update admin configuration
export async function PUT(req: NextRequest) {
  try {
    // Parse the JSON body of the request
    const body = await req.json();

    // Extract the JWT token from the Authorization header
    const token = req.headers.get('authorization')?.split(' ')[1];

    // Send PUT request to backend API to update the configuration
    const response = await fetch(`${API_ENDPOINTS.ADMIN}/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send token in header
      },
      body: JSON.stringify(body) // Include updated config in body
    });

    // If the request fails, throw an error
    if (!response.ok) {
      throw new Error('Failed to update configuration');
    }

    // Parse and return the response JSON
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Log and respond with a 500 status on error
    console.error('Config update error:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}
