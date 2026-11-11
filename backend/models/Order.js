import mongoose from 'mongoose';

const lineSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, max: 10 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true, lowercase: true, index: true },
    lines: { type: [lineSchema], validate: (v) => v.length > 0 },
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true, match: /^[1-9]\d{5}$/ },
    },
    payment: { type: String, enum: ['upi', 'card', 'cod'], required: true },
    couponCode: String,
    subtotal: Number,
    discount: Number,
    prepaidDiscount: Number,
    shipping: Number,
    codFee: Number,
    total: Number,
    status: {
      type: String,
      enum: ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'],
      default: 'Confirmed',
    },
  },
  { timestamps: true },
);

orderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Order = mongoose.model('Order', orderSchema);
