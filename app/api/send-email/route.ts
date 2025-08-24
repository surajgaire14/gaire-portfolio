import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { to, subject, html } = await req.json();

        if (!to || !subject || !html) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.zeptomail.com",
            port: 587,
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!,
            },
        });

        const mailOptions = {
            from: '"Example Team" <noreply@cloudlaya.net>',
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    }
}
