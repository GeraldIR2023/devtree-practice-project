import Devtree from "../components/Devtree";
import { getUser } from "../api/DevTreeAPI";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

export default function AppLayout() {
    const { data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ["user"],
        retry: 2,
        refetchOnWindowFocus: false,
    });

    if (isLoading) return "Cargando...";
    if (isError) {
        return <Navigate to="/auth/login" />;
    }

    if (data) return <Devtree data={data} />;
}
