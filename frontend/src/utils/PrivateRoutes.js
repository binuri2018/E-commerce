import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requireAdmin = false }) => {
    const { user } = useAuth();

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" />;
    }

    if (requireAdmin && !user.isAdmin) {
        // Redirect to customer home if not admin
        return <Navigate to="/customer-home" />;
    }

    if (!requireAdmin && user.isAdmin) {
        // Redirect to admin dashboard if admin trying to access customer routes
        return <Navigate to="/admin" />;
    }

    return children;
};

export default PrivateRoute;
