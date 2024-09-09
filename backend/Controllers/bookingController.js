import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    // get currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);
    // console.log(doctor);
    //console.log(req.user);

    const user = await User.findById(req.userId);
    // console.log(user);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    //console.log(stripe);
    // console.log(doctor.ticketPrice);
    //create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: 1000 * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    //create new booking
    //console.log("session", session);
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      // ticketPrice: doctor.ticketPrice,
      session: session.url,
    });

    await booking.save();
    console.log("booking", booking);
    // console.log("session", session.url);
    // console.log("aayush");

    res
      .status(200)
      .json({ success: true, message: "Successfully paid", booking });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: true, message: "Error creating checkout session" });
  }
};
