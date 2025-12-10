import { createContext } from "react";

export const AppContext = createContext() 
const AppContextProvider= (props) => {

    const currency = '₹'

    const calculateAge = (dob) => {
        if (!dob) return "N/A"; // Handle missing data
    
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return "Invalid Date"; // Handle invalid dates
    
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
    
        // Adjust if birthday hasn't occurred yet this year
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 

    // Slot Date Formatting
    const slotDateFormat = (slotDate) => {
      const dateArray = slotDate.split('_')
      return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }
    

    const value = {
        calculateAge,
        slotDateFormat,
        currency
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
           
    )
}

export default AppContextProvider