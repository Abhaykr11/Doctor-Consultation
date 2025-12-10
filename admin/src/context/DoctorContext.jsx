import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()
const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData ] = useState(false)
    const [profileData, setProfileData] = useState(false)

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } });
            if (data.success) {
                setAppointments(data.appointments); // ✅ FIXED: No function call
                console.log("Fetched Appointments:", data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Get Appointments Error:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch appointments!");
        }
    };
    
    

    const completeAppointment = async (appointmentId) => {
        console.log("Calling Complete API for:", appointmentId); // Debugging log
        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/complete-appointment',
                { appointmentId },
                { headers: { dToken } }
            );
            console.log("Complete API Response:", data); // Debugging log

            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Complete API Error:", error);
            toast.error("Something went wrong!");
        }
    };

    const cancelAppointment = async (appointmentId) => {
        console.log("Calling Cancel API for:", appointmentId); // Debugging log
        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/cancel-appointment',
                { appointmentId },
                { headers: { dToken } }
            );
            console.log("Cancel API Response:", data); // Debugging log

            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Cancel API Error:", error);
            toast.error("Something went wrong!");
        }
    };

        const getDashData = async () => {
                try {
                    const {data} = await axios.get(backendUrl+ '/api/doctor/dashboard', {headers:{dToken}})
                    if (data.success) {
                        setDashData(data.dashData)
                        console.log(data.dashData)
                    } else {
                        toast.error(data.message)
                    }
                } catch (error) {
                    console.log("Cancel API Error:", error);
                    toast.error("Something went wrong!");
                }
    }

    const getProfileData = async () => {
        try {
            
            const {data} = await axios.get(backendUrl+ '/api/doctor/profile',{headers:{dToken}})
            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            }

        } catch (error) {
            console.log("Cancel API Error:", error);
                    toast.error("Something went wrong!");
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,setDashData,getDashData,
        profileData,setProfileData,getProfileData

    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>

    )
}

export default DoctorContextProvider