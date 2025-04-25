import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getUserByHandle } from "../api/DevTreeAPI";

export default function HandleView() {
    const params = useParams();
    const handle = params.handle!;

    const { data, error, isLoading } = useQuery({
        queryKey: ["handle", handle],
        queryFn: () => getUserByHandle(handle),
        retry: 1,
    });

    if (isLoading) return <p className="text-center text-white">Cargando...</p>;
    if (error) return <Navigate to={"/404"} />;
    return <div>HandleView</div>;
}
