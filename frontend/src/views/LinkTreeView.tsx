import { toast } from "sonner";
import { social } from "../data/social";
import { useState } from "react";
import { isValidUrl } from "../utils";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeAPI";

import DevTreeInput from "../components/DevTreeInput";

export default function LinkTreeView() {
    const [devTreeLinks, setDevTreeLinks] = useState(social); //^ Lo colocamos en el state para mantenerlo sincronizado entre varias funciones

    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Perfil actualizado correctamente");
        },
    }); //^Extraemos mutate por que solo hay una mutación

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map((link) =>
            link.name === e.target.name
                ? { ...link, url: e.target.value }
                : link
        );
        setDevTreeLinks(updatedLinks);
    };

    const handleEnableLink = (socialNetwork: string) => {
        const updatedLinks = devTreeLinks.map((link) => {
            if (link.name === socialNetwork) {
                if (isValidUrl(link.url)) {
                    return { ...link, enabled: !link.enabled };
                } else {
                    toast.error("URL no válida");
                }
            }
            return link;
        });
        console.log(updatedLinks);
        setDevTreeLinks(updatedLinks);
    };

    return (
        <>
            <div className=" space-y-5">
                {devTreeLinks.map((item) => (
                    <DevTreeInput
                        key={item.name}
                        item={item}
                        handleUrlChange={handleUrlChange}
                        handleEnableLink={handleEnableLink}
                    />
                ))}
                <button className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold">
                    Guardar Cambios
                </button>
            </div>
        </>
    );
}
