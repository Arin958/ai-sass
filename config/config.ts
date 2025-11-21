import dotenv from "dotenv"

dotenv.config()

console.log(process.env.GROQ_API_KEY)

export const config = {
   groqapi: process.env.GROQ_API_KEY!
}