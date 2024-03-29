import { Document, ObjectId, Schema, model, models } from "mongoose";
import bcrypt, { compare, genSalt, hash } from "bcrypt";
import { Model } from "mongoose";

interface PasswordResetTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const PasswordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
  {},
  Methods
>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24, // Token will automatically expire after 24 hours
  },
});

PasswordResetTokenSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("token")) {
      return next();
    }

    //Generate salt and hash the token
    const salt = await genSalt(10);

    this.token = await hash(this.token, salt);
    next();
  } catch (error) {
    throw error;
  }
});

//Compare method to compare the token with the provided value
PasswordResetTokenSchema.methods.compareToken = async function (
  tokenToCompare
) {
  try {
    return await compare(tokenToCompare, this.token);
  } catch (error) {
    throw error;
  }
};

const PasswordResetTokenModel =
  models.PasswordResetToken ||
  model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetTokenModel as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>;
