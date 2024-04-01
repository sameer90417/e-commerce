import UserModel from "@models/userModel";
import startDb from "@lib/db";
import { NextResponse } from "next/server";
import { NewUserRequest } from "@/app/types";
import nodemailer from 'nodemailer';
import EmailVerificationToken from "@models/emailVerificationToken";
import crypto from 'crypto';
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;

  await startDb();

  const newUser = await UserModel.create({
    ...body
  });

  const token = crypto.randomBytes(36).toString('hex');

  EmailVerificationToken.create({
    user : newUser._id,
    token : token
  })



  const verificationUrl = `${process.env.VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;

  await sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    subject: "verification",
    linkUrl: verificationUrl,
  });

  console.log(await newUser.comparePassword("1234234"));
  return NextResponse.json(newUser);
};
