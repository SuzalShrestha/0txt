import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt } from '@/lib/encryption';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: Promise<{ noteId: string }> }) {
  try {
    const noteId = await (await context.params).noteId;

    const note = await prisma.secureText.findUnique({
      where: { urlPath: noteId },
    });

    // If no password is provided, just check if the note exists
    if (!request.headers.get('X-Note-Password')) {
      return NextResponse.json({ exists: !!note }, { status: note ? 401 : 200 });
    }

    if (!note) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const password = request.headers.get('X-Note-Password');
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 401 });
    }

    try {
      const decryptedText = decrypt(note.encryptedText, password, note.salt, note.iv, note.authTag);

      // Log access
      await prisma.accessLog.create({
        data: {
          textId: note.id,
          ipAddress:
            request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });

      // Update access count
      await prisma.secureText.update({
        where: { id: note.id },
        data: { accessCount: { increment: 1 } },
      });

      return NextResponse.json({ text: decryptedText, exists: true }, { status: 200 });
    } catch {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ noteId: string }> }) {
  try {
    const noteId = await (await context.params).noteId;
    const { text } = await request.json();
    const password = request.headers.get('X-Note-Password');

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 401 });
    }

    // For existing notes, verify the password first
    const existingNote = await prisma.secureText.findUnique({
      where: { urlPath: noteId },
    });

    if (existingNote) {
      try {
        // Try to decrypt with the provided password to verify it
        decrypt(
          existingNote.encryptedText,
          password,
          existingNote.salt,
          existingNote.iv,
          existingNote.authTag,
        );
      } catch {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    }

    const { encryptedText, salt, iv, authTag } = encrypt(text, password);

    const note = await prisma.secureText.upsert({
      where: { urlPath: noteId },
      update: {
        encryptedText,
        salt,
        iv,
        authTag,
        accessCount: { increment: 1 },
      },
      create: {
        urlPath: noteId,
        encryptedText,
        salt,
        iv,
        authTag,
        accessCount: 1,
      },
    });

    // Log access
    await prisma.accessLog.create({
      data: {
        textId: note.id,
        ipAddress:
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
