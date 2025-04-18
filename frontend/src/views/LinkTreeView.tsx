import { toast } from "sonner";
import { social } from "../data/social";
import { useEffect, useState } from "react";
import { isValidUrl } from "../utils";
import { updateProfile } from "../api/DevTreeAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import DevTreeInput from "../components/DevTreeInput";
import { SocialNetwork, User } from "../types";

export default function LinkTreeView() {
    const [devTreeLinks, setDevTreeLinks] = useState(social); //^ Lo colocamos en el state para mantenerlo sincronizado entre varias funciones

    const queryClient = useQueryClient(); //^ Obtenemos el cliente de la cache
    const user: User = queryClient.getQueryData(["user"])!;
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Perfil actualizado correctamente");
        },
    }); //^Extraemos mutate por que solo hay una mutación

    useEffect(() => {
        const updatedData = devTreeLinks.map((item) => {
            const userLink = JSON.parse(user.links).find(
                (link: SocialNetwork) => link.name === item.name
            );
            if (userLink) {
                return {
                    ...item,
                    url: userLink.url,
                    enabled: userLink.enabled,
                };
            }
            return item;
        });
        setDevTreeLinks(updatedData);
    }, []);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map((link) =>
            link.name === e.target.name
                ? { ...link, url: e.target.value }
                : link
        );
        setDevTreeLinks(updatedLinks);

        queryClient.setQueryData(["user"], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedLinks),
            };
        });
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
        setDevTreeLinks(updatedLinks);

        queryClient.setQueryData(["user"], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedLinks), //^ Guardamos los links en el usuario
            };
        });
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
                <button
                    className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold"
                    onClick={() => mutate(user)}
                >
                    Guardar Cambios
                </button>
            </div>
        </>
    );
}
