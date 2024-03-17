import UserModel from "@models/userModel";
import startDb from "@lib/db";
import { NextResponse } from "next/server";
import { NewUserRequest } from "@/app/types";
import nodemailer from 'nodemailer';
import EmailVerificationToken from "@models/emailVerificationToken";
import crypto from 'crypto';

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


  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "192561666499d0",
      pass: "6cfa5a173259f7"
    }
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await transport.sendMail({
    from : 'verification@ecommerce.com',
    to : newUser.email,
    html: `<h2>Please verify your email by clicking on <a href="${verificationUrl}" >this link</a></h2>`
  })

  console.log(await newUser.comparePassword("1234234"));
  return NextResponse.json(newUser);
};
