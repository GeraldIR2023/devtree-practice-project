import { useQueryClient } from "@tanstack/react-query";

export default function AdminNavigation() {
    const queryClient = useQueryClient();

    const logout = () => {
        localStorage.removeItem("AUTH_TOKEN"); //^ Limpiar el token del local storage
        queryClient.invalidateQueries({ queryKey: ["user"] }); //^ Invalidar la cache de la query de usuario
    };

    return (
        <button
            className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
            onClick={logout}
        >
            Cerrar Sesión
        </button>
    );
}
