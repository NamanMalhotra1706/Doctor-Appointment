import React from "react";
import ConvertTime from "../../utils/ConvertTime";
import { BASE_URL, token } from "./../../config";
import { toast } from "react-toastify";
import axios from "axios";

//console.log(doctorId);
const SidePanel = ({ name, doctorId, ticketPrice, timeSlots }) => {
  const intialState = {
    user:
      localStorage.getItem("user") !== undefined
        ? JSON.parse(localStorage.getItem("user"))
        : null,
  };
  console.log(intialState.user.email);
  const bookingHandler = async () => {
    window.alert("clicked on doctor Appointment");
    const timeSlot = timeSlots; // Replace with the actual time slot
    const userName = name; // Replace with the actual user name
    const email = intialState.user.email;
    axios
      .post("http://localhost:5000/send-mail", { timeSlot, userName, email })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    try {
      const res = await fetch(
        `${BASE_URL}/bookings/checkout-session/${doctorId}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(res);
      const data = await res.json();
      // console.log(data);
      if (!res.ok) {
        throw new Error(data.message + "Please try again");
      }
      console.log(data.booking.session);
      if (data.booking.session) {
        window.location.href = data.booking.session;
      }
      // if (data.booking.session) {
      //   window.open(data.booking.session, "_blank");
      // }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };
  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Ticket Price</p>
        <span
          className="text-[16px] leading-7 lg:text-[22px] lg:leading-8
            text-headingColor font-semibold"
        >
          {/* {ticketPrice} RUPEES */}
          1000 RUPEES
        </span>
      </div>
      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">
          Available Time Slots:
        </p>

        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <div key={index}>
              <li className="flex items-center justify-between mb-2">
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                </p>
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {ConvertTime(item.startingTime)}-
                  {ConvertTime(item.endingTime)}
                </p>
              </li>
            </div>
          ))}
        </ul>
      </div>
      <button onClick={bookingHandler} className="btn px-2 w-full rounded-md">
        Book Appointment
      </button>
    </div>
  );
};

export default SidePanel;
