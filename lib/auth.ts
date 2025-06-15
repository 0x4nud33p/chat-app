import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/prisma/index";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
    socialProviders: {
        google: { 
            clientId: process.env.NEXT_GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
})