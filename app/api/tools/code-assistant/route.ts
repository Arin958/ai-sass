import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateCodeAssistant } from '@/lib/generateWithAi';


export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get your internal user record
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    const { code, language, mode } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (!language) {
      return NextResponse.json({ error: 'Language is required' }, { status: 400 });
    }

    if (!mode) {
      return NextResponse.json({ error: 'Mode is required (write/debug/optimize)' }, { status: 400 });
    }

    // ⭐ AI Code Generation
    const explanation = await generateCodeAssistant(code, language, mode);

    // Save to Prisma
    const saved = await prisma.codeExplanation.create({
      data: {
        code,
        language,
        explanation,
        userId: dbUser.id,
      },
    });

    return NextResponse.json({
      explanation,
      id: saved.id,
    });

  } catch (error) {
    console.error('Code Assistant Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
