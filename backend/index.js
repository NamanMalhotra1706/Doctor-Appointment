import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";
import transporter from "./nodemailer.config.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is working");
});

app.post("/send-mail", (req, res) => {
  const { userName, timeSlot, email } = req.body;
  // console.log(userName, timeSlot[0].startingTime, email);

  const mailOptions = {
    from: {
      name: "Doctor Appointment",
      address: process.env.FROM_EMAIL,
    },
    to: [`${email}`],
    subject: "Your Payment and Appointment Confirmation",
    text: `Hello,

Thank you for booking an appointment with Doctor Appointment. We have received your payment, and your appointment is confirmed.

Appointment Details:
Doctor: ${userName}
Specialization: Cardiology
Date: ${timeSlot[0].startingTime}-${timeSlot[0].endingTime}
Time: 10:00 AM
Location: Acme Hospital, 123 Main Street, City

Please arrive 15 minutes before your scheduled appointment time. We look forward to providing you with excellent healthcare services. If you have any questions or need to reschedule your appointment, please contact us.

Thank you for choosing Doctor Appointment!

Best regards,
Doctor Appointment Team`,
    html: `
      <h1>Hello,</h1>
      <p>Thank you for booking an appointment with Doctor Appointment. We have received your payment, and your appointment is confirmed.</p>
      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Doctor:</strong> Dr. ${userName}</li>
        <li><strong>Specialization:</strong> Cardiology</li>
        <li><strong>Date:</strong>${timeSlot[0].startingTime}-${timeSlot[0].endingTime}</li>
        <li><strong>Time:</strong> 10:00 AM</li>
        <li><strong>Location:</strong> Acme Hospital, 123 Main Street, City</li>
      </ul>
      <p>Please arrive 15 minutes before your scheduled appointment time.</p>
      <p>We look forward to providing you with excellent healthcare services. If you have any questions or need to reschedule your appointment, please contact us.</p>
      <p>Thank you for choosing Doctor Appointment!</p>
      <p>Best regards,<br>Doctor Appointment Team</p>
    `,
  };

  transporter
    .sendMail(mailOptions)
    .then(() => res.status(200).send("Email sent successfully"))
    .catch((error) => {
      console.error(error); // Log the error for debugging
      let errorMessage = "Error sending email";

      // Provide more specific error messages based on error type
      if (error.responseCode && error.responseCode === 401) {
        errorMessage =
          "Authentication error. Please check your email credentials.";
      } else if (error.code && error.code === "ENOTFOUND") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      res.status(500).send(errorMessage);
    });
});

// Database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB database is connected");
  } catch (err) {
    console.log("MongoDB database connection failed");
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

app.listen(port, () => {
  connectDB();
  console.log("Server is running on port " + port);
});
