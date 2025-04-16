import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    
    if (existingUser) {
      return new NextResponse("User with this email already exists", { status: 409 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.log("[REGISTER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

