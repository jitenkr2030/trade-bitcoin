import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"
import { z } from "zod"
import { UserRole } from "@prisma/client"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["TRADER", "INVESTOR"]).optional().default("TRADER")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedFields = registerSchema.safeParse(body)
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, role } = validatedFields.data

    try {
      // Register user using the auth utility function
      const user = await registerUser({
        name,
        email,
        password,
        role: role as UserRole
      })

      return NextResponse.json(
        { 
          message: "User created successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        },
        { status: 201 }
      )
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}