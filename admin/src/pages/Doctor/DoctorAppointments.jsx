import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  // Define the handlers
  const cancelAppointmentHandler = async (id) => {
    console.log("Cancel button clicked for:", id);
    try {
      await cancelAppointment(id);
      getAppointments(); // Refresh appointments after canceling
    } catch (error) {
      console.error("Cancel Appointment Error:", error);
    }
  };

  const completeAppointmentHandler = async (id) => {
    console.log("Complete button clicked for:", id);
    try {
      await completeAppointment(id);
      getAppointments(); // Refresh appointments after completing
    } catch (error) {
      console.error("Complete Appointment Error:", error);
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border border-gray-300 rounded-lg text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll p-4 shadow-md">

        {/* Header Row */}
        <div className="max-sm:hidden grid grid-cols-7 py-3 px-6 text-center border-b border-gray-300 font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointments List */}
        {
        (Array.isArray(appointments) ? [...appointments].reverse() : []).map((item, index) => (

          <div
            key={index}
            className="grid grid-cols-7 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 max-sm:flex max-sm:flex-wrap max-sm:gap-5 max-sm:text-base"
          >
            <p className="text-center">{index + 1}</p>

            <div className="flex items-center justify-center gap-2">
              <img className="w-8 h-8 rounded-full object-cover" src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>

            <p className="text-center">
              <span className="text-xs border border-primary px-2 py-1 rounded-full">
                {item.payment ? "Online" : "Cash"}
              </span>
            </p>

            <p className="text-center">{calculateAge(item.userData.dob)}</p>
            <p className="text-center">{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p className="text-center">{currency}{item.amount}</p>
            {
              item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className="flex justify-center gap-2">
                    <img onClick={() => cancelAppointmentHandler(item._id)} className="w-10 cursor-pointer" src={assets.cancel_icon} alt="Cancel" />
                    <img onClick={() => completeAppointmentHandler(item._id)} className="w-10 cursor-pointer" src={assets.tick_icon} alt="Complete" />
                  </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointments;