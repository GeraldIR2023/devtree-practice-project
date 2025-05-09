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
    };

    const links: SocialNetwork[] = JSON.parse(user.links);

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

        let updatedItems: SocialNetwork[] = [];
        const selectedSocialNetwork = updatedLinks.find(
            (link) => link.name === socialNetwork
        );
        if (selectedSocialNetwork?.enabled) {
            const id = links.filter((link) => link.id).length + 1;
            if (links.some((link) => link.name === socialNetwork)) {
                updatedItems = links.map((link) => {
                    if (link.name === socialNetwork) {
                        return {
                            ...link,
                            enabled: true,
                            id,
                        };
                    } else {
                        return link;
                    }
                });
            } else {
                const newItem = {
                    ...selectedSocialNetwork,
                    id,
                };
                updatedItems = [...links, newItem];
            }
        } else {
            const indexToUpdate = links.findIndex(
                (link) => link.name === socialNetwork
            ); //^ Identificamos el elemento que queremos desh
            updatedItems = links.map((link) => {
                if (link.name === socialNetwork) {
                    return { ...link, id: 0, enabled: false };
                } else if (
                    indexToUpdate !== 0 &&
                    link.id === 1 &&
                    link.id > indexToUpdate
                ) {
                    return {
                        ...link,
                        id: link.id - 1,
                    };
                } else {
                    return link;
                }
            });
            console.log(indexToUpdate);
        }

        console.log(updatedItems);

        //*Almacenar en la base de datos
        queryClient.setQueryData(["user"], (prevData: User) => {
            return {
                ...prevData,
                links: JSON.stringify(updatedItems), //^ Guardamos los links en el usuario
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
                    onClick={() => mutate(queryClient.getQueryData(["user"])!)} //^ Ejecutamos la mutación y le pasamos el usuario actualizado
                >
                    Guardar Cambios
                </button>
            </div>
        </>
    );
}
