import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateUser = async (req, res) => {
  const { user1 } = useContext(authContext);
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    //console.log(updatedUser);
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to update" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to delete" });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      message: "user found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "no user found" });
  }
};

export const getAllUser = async (req, res) => {
  const id = req.params.id;

  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "users found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "not found" });
  }
};
export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { password, ...rest } = user._doc;
    res
      .status(200)
      .json({ success: true, message: "Profile ", data: { ...rest } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something wrong " });
  }
};
export const getMyAppointments = async (req, res) => {
  try {
    // Import Booking model if not already imported

    const bookings = await Booking.find({ user: req.userId }); // Fixed typo here

    const doctorIds = bookings.map((el) => el.doctor.id);

    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    ); // Fixed select placement

    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// export const getMyAppointments = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.userId });
//     const doctorIds = bookings.map((el) => el.doctor.id);
//     const doctors = await Doctor.find(
//       { _id: { $in: doctorIds } }.select("-password")
//     );
//     res.status(200).json({
//       success: true,
//       message: "Appoitments are getting",
//       data: doctors,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Something wrong " });
//   }
// };
