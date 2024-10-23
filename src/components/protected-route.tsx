import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children, // children is anything inside of component // Home or Profile
}: {
  children: React.ReactNode;
}) {
    const user = auth.currentUser;
    if(user === null){
        return <Navigate to="/login"/>
    }
  return children;
}
