import { NextResponse } from 'next/server';
import prisma from '@/prisma/index';

export async function GET() {
  try {
    await prisma.$connect();
    const users = await prisma.user.findMany();
    console.log(users);
    return NextResponse.json({ connected: true, users: users });
  } catch (error) {
    return NextResponse.json({ connected: false, error });
  }
}
