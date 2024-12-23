import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true, // Ensure emails are stored in lowercase
      trim: true, // Remove any extra spaces around email
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hash password before saving user
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password wasn't modified

  // Hash password
  const salt = await bcrypt.genSalt(10); // Generate salt with a strength of 10
  this.password = await bcrypt.hash(this.password, salt); // Hash the password

  next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // Compare plain password with hashed password
};

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
