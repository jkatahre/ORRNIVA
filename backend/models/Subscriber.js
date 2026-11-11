import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true } },
  { timestamps: true },
);

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    subject: { type: String, required: true, maxlength: 140 },
    message: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true },
);

export const ContactMessage = mongoose.model('ContactMessage', messageSchema);
