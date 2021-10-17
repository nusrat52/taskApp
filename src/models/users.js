const validator = require("validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jsonWebToken = require("jsonwebtoken");
const Tasks=require("../models/tasks")
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: {
    type: Number,
    validate: (value) => {
      if (value < 0) {
        throw new Error("sifirdan assage yedin dassaxgi");
      }
    },
    default: 0,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,

    validate: (value) => {
      if (value === "password") {
        throw new Error("pasworda password qoymaq olmaz");
      }
    },
    minLength: [6, "too low"],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  avatar: {
    type:Buffer
  }
},{
  timestamps:true
});
userSchema.virtual("tasks", {
  ref: "tasks",
  localField: "_id",
  foreignField:"userId"
  
})
userSchema.methods.makePublic = function () {
  const newUser = this.toObject();
  delete newUser.password;
  delete newUser.tokens;
  return newUser;


};

userSchema.methods.tokenGenerate = async function () {
  const token = await jsonWebToken.sign({ id: this.id }, process.env.JSONSECRETKEY);

  this.tokens.push({ token });
  this.save();
  return token;
};

userSchema.statics.loginFunct = async (email, password) => {
  const use = await user.findOne({ email });

  if (!use) {
    throw new Error("user not found");
  }

  const isTruePassword = await bcrypt.compare(password, use.password);
  if (isTruePassword) {
    return use;
  }
  throw new Error("user not found");
};
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.pre("findOneAndDelete", async (next) => {
console.log(this);
    const res=await Tasks.deleteMany({ userId: this._id })
 
  next()
})

const user = mongoose.model("user", userSchema);

module.exports = user;
