import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Home = ()=>{
    const {isAuthenticated} = useAuth0();
    
    return (
        <div>
            <button onClick={()=>console.log("Is Authenticated:", isAuthenticated)}>Hola</button>
        </div>
    )
}
export default Home