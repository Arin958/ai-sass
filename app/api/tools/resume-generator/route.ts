// app/api/tools/resume-generator/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateResumeWithAI } from '@/lib/generateWithAi';


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

    const { 
      jobTitle, 
      experience, 
      skills 
    } = await request.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' }, 
        { status: 400 }
      );
    }

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience level is required' }, 
        { status: 400 }
      );
    }

    // 2️⃣ Generate resume content using AI
    const generatedOutput = await generateResumeWithAI(jobTitle, experience, skills);

    // 3️⃣ Save using internal user.id (Int)
    const resume = await prisma.resume.create({
      data: {
        jobTitle,
        experience,
        skills: skills || [],
        output: generatedOutput,
        userId: dbUser.id, // internal numeric ID ✔
      },
    });

    return NextResponse.json({
      output: generatedOutput,
      id: resume.id,
    });

  } catch (error) {
    console.error('Resume generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}