import { Link } from "react-router-dom";

export default function HomeNavigation() {
    return (
        <>
            <Link
                to="/auth/login"
                className=" text-white p-2 uppercase font-black text-xs cursor-pointer"
            ></Link>
        </>
    );
}
