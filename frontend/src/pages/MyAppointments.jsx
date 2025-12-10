import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  

  // Slot Date Formatting
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const navigate = useNavigate()

  // Fetch User Appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  // cancel appointments

  const cancelAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const initPay = (order) => {
    console.log("Loaded Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID); // ✅ Check if Razorpay key is loaded
    console.log("Initializing payment with order:", order); // ✅ Check if order is received
  
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not available");
      return;
    }
  
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      handler: async (response) => {
        console.log("Payment response:", response);
  
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay',
            response,
            { headers: { token } }
          );
  
          if (data.success) {
            toast.success("Payment Successful!");
            await getUserAppointments();
            navigate('/');
            setTimeout(() => navigate('/my-appointments'), 100);
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Verification error:", error);
          toast.error(error.message);
        }
      }
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  
  




  const appointmentRazorpay = async (appointmentId) => {
    console.log("Loaded Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID); // Confirm key is loaded
    console.log("Appointment ID:", appointmentId); // Confirm appointment ID
  
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } });
      
      console.log("API response:", data); // ✅ Log the API response to check if order is correct
      
      if (data.success) {
        console.log("Order data:", data.order); // ✅ Ensure that order data is available
        initPay(data.order);
      } else {
        toast.error("Failed to create Razorpay order.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Payment initiation failed");
    }
  };
  

  
  

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name} </p>
              <p>{item.docData.speciality} </p>
              <p className='text-zinc-700 font-medium mt-1'>Address: </p>
              <p className='text-xs'>{item.docData.address.line1} </p>
              <p className='text-xs'>{item.docData.address.line2} </p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime ? item.slotTime : 'Time unavailable'}
              </p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted &&  <button onClick={() => appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300'>            Pay Online           </button>}
              {!item.cancelled && !item.isCompleted &&  <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>                Cancel Appointment              </button>}
              {item.cancelled && !item.isCompleted &&  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
              {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
