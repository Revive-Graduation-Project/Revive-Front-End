import { Navbar } from "../components";
import { Outlet } from "react-router-dom";
function AppLayout() {
    return ( 
        <div className="min-h-screen bg-[url('/main_image.jpg')] bg-center bg-cover">
            <Navbar /> {/* navbar will only be displayed on app pages */}
             <Outlet />
        </div>
     );
}

export default AppLayout;