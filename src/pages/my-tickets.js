import React, { useContext, useEffect, useState } from "react";
import { AirlineContext } from "../../constants/AirlineContext";
import Ticket from "../components/Ticket";

function MyTickets() {
  const [loading, setLoading] = useState(false);
  const { fetchNFTs } = useContext(AirlineContext);

    useEffect(() => {
    
        fetchNFTs(setLoading).then( (res)=>{
            console.log(res)
        })
    

    }, [])
    
  return (
    <div className="bg-blue w-full md:h-full h-screen px-20 py-20">
      <Ticket />
    </div>
  );
}

export default MyTickets;
