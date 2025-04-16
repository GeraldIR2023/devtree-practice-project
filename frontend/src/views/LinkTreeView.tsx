import { useState } from "react";
import { social } from "../data/social";

export default function LinkTreeView() {
    const [devTreeLinks, setDevTreeLinks] = useState(social); //^ Lo colocamos en el state para mantenerlo sincronizado entre varias funciones
    return <div>LinkTreeView</div>;
}
