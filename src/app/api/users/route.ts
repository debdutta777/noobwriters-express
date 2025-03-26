import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/lib/models/User';

export async function POST(req: Request) {
  try {
    const { email, name, supabaseId } = await req.json();

    if (!email || !name || !supabaseId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      email,
      name,
      supabaseId,
      image: '', // Default empty image
      bio: '',   // Default empty bio
      favorites: [],
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const supabaseId = url.searchParams.get('supabaseId');
    const email = url.searchParams.get('email');

    await dbConnect();

    let query = {};
    if (supabaseId) {
      query = { supabaseId };
    } else if (email) {
      query = { email };
    } else {
      return NextResponse.json(
        { error: 'Missing search parameter' },
        { status: 400 }
      );
    }

    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 