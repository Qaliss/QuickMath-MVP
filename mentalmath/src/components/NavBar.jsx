import { Link } from "react-router-dom";
import "../css/NavBar.css"
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function NavBar() {

    const handleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error)
        }
    }

    return <nav className = 'navbar'>
        <div className='navbar-brand'>
            <Link to='/'>MentalMath</Link>
        </div>
        <div className='navbar-links'>
            <Link to="/" className='nav-link'>Home</Link>
            <Link to="/play" className='nav-link'>Play</Link>
            <Link to="/learn" className='nav-link'>Learn</Link>
            <Link to="/stats" className='nav-link'>Stats</Link>
            <button onClick={handleSignOut}>Log Out</button> 
        </div>
    </nav>
}

export default NavBar