import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import WritingPrompt from '@/app/lib/models/WritingPrompt';
import { getUser } from '@/app/lib/supabase';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const isPublic = url.searchParams.get('isPublic') === 'true';
    
    await dbConnect();
    
    let query: any = {};
    
    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by public status if specified
    if (isPublic !== null) {
      query.isPublic = isPublic;
    }
    
    // Get user-specific prompts if requested
    const creatorId = url.searchParams.get('creatorId');
    if (creatorId) {
      query.creator = creatorId;
    }
    
    const prompts = await WritingPrompt.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({ success: true, prompts });
  } catch (error: any) {
    console.error('Error fetching writing prompts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch writing prompts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { title, content, category, isPublic = true } = await request.json();
    
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Create new writing prompt
    const prompt = await WritingPrompt.create({
      title,
      content,
      category,
      isPublic,
      creator: user.id, // Assuming user.id is the MongoDB ObjectId reference to the user
      uses: 0,
    });
    
    return NextResponse.json({ success: true, prompt }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating writing prompt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create writing prompt' },
      { status: 500 }
    );
  }
} 