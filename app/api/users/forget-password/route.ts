import PasswordResetTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModel";
import { ForgetPasswordRequest } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDb from "@/app/lib/db";

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPasswordRequest;
    if (!email) {
      return NextResponse.json({ error: "Envalid email!" }, { status: 401 });
    }
    await startDb();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "user not found!" }, { status: 404 });
    }

    // generate the token and send the link
    await PasswordResetTokenModel.findOneAndDelete({ user: user._id });
    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetTokenModel.create({
      user: user._id,
      token,
    });

    // send the link to email
    const resetPassLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "192561666499d0",
        pass: "6cfa5a173259f7",
      },
    });

    await transport.sendMail({
      from: "verification@ecommerce.com",
      to: user.email,
      html: `<h2>Please verify your email by clicking on <a href="${resetPassLink}" >this link</a> to reset your password.</h2>`,
    });

    return NextResponse.json({
      message: "Please check your email!",
    });
  } catch (error) {
    return NextResponse.json({ error: (error as any).message }, { status : 500 });
  }
};
