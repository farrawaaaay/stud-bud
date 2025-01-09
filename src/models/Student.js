import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  profilePicture: { 
    type: String, 
    default: 'src="https://res.cloudinary.com/dvorbtw7b/image/upload/v1735892282/StudBud/default_profile.svg' 
  }, // Default profile picture URL
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});



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
