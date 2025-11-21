// app/api/tools/blog-generator/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateWithAI } from '@/lib/generateWithAi';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1️⃣ Get your internal user record using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    const { topic, tone, length } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // 2️⃣ Generate content
    const generatedContent = await generateWithAI(topic, tone, length);

    // 3️⃣ Save using internal user.id (Int)
    const blogPost = await prisma.blogPost.create({
      data: {
        title: `Blog: ${topic}`,
        content: generatedContent,
        topic,
        tone,
        length,
        userId: dbUser.id, // internal numeric ID ✔
      },
    });

    return NextResponse.json({
      content: generatedContent,
      id: blogPost.id,
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// Mock AI generator

