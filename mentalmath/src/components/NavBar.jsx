import { Link } from "react-router-dom";
import "../css/NavBar.css"
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import profilePic from '../assets/vector-flat-illustration-grayscale-avatar-600nw-2281862025.webp';

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
            <div className="nav-profile">
                <Link to="/stats" className="nav-link">
                <img className='profile-pic' src={profilePic} alt="Profile" />
                </Link>
                <button onClick={handleSignOut} className="nav-button">Log Out</button>
            </div>
        </div>
    </nav>
}

export default NavBar