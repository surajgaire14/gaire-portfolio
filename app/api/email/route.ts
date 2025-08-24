import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body } = await request.json()

    console.log(request.json())

    const host = process.env.SMTP_HOST || "smtp.ethereal.email"
    const port = Number.parseInt(process.env.SMTP_PORT || "587")
    const user = process.env.SMTP_USER || ""
    const pass = process.env.SMTP_PASS || ""
    const fromEmail = process.env.SMTP_FROM_EMAIL || "test@example.com"
    const fromName = process.env.SMTP_FROM_NAME || "Test Sender"


    // Configure transport
    const transporter = nodemailer.createTransport({
      host : host,
      port:  port,
      secure: true,
      auth: {
        user:  user,
        pass:  pass,
      },
    })

    // Send mail
    const info = await transporter.sendMail({
      from: `noreply@cloudlaya.net`,
      to : "nabin@cloudlaya.com",
      subject : "Hello",
      text: "Hello World",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">'Hello World'</h2>
        <div style="margin: 20px 0; line-height: 1.5;">
        </div>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            This is a test email sent from your Next.js application.
          </p>
        </div>
      </div>`,
    })


    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${to}`,
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Failed to send test email:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

