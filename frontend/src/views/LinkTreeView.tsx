import { useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput";

export default function LinkTreeView() {
    const [devTreeLinks, setDevTreeLinks] = useState(social); //^ Lo colocamos en el state para mantenerlo sincronizado entre varias funciones
    return (
        <>
            <div className=" space-y-5">
                {devTreeLinks.map((item) => (
                    <DevTreeInput />
                ))}
            </div>
        </>
    );
}
