import axios from "axios"
import { API_URL } from "../../dbURL";
import { useAuth } from "../../AuthContext";

export const LogUserOut = async (uid) => {
    // const { logout } = useAuth();

    const body = {
        UID: uid,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/account/logout', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // logout();
        // console.log(data);

        return await data;
    } catch(error) {
        // console.error(`Network error: \n`, error);
        throw new Error(`Failed to Logout: ${error.message}`);
    }
};

export default {
    LogUserOut
}