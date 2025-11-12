import { Navbar } from "../components";

function AppLayout() {
    return ( 
        <div className="min-h-screen bg-[url('/main_image.jpg')] bg-center bg-cover">
            <Navbar /> {/* navbar will only be displayed on app pages */}
        </div>
     );
}

export default AppLayout;