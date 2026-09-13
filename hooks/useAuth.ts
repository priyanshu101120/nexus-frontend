// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { SafeUser, LoginInput } from "./type";
// import { authApi } from "@/lib/api";

// const useAuth = () => {
//   const [user, setUser] = useState<SafeUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     let isMounted = true;

//     const fetchUser = async () => {
//       try {
//         const  data  = await authApi.getMe();
//         if (isMounted) setUser(data.user);
//         setLoading(false);
//       } catch (error) {
//         if (isMounted) setUser(null);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };
//     fetchUser();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const login = async (email: string, password: string): Promise<void> => {
//     // Implementation for login
//     try {
//       const data  = await authApi.login({ email, password });
//       setUser(data.user);
//     } catch (error) {
//       const message = error instanceof Error ? error.message : "Login failed";
//       throw new Error(message);
//     }
//   };

//   const register = async (
//     name: string,
//     email: string,
//     password: string,
//   ): Promise<void> => {
//     try {
//       const  data  = await authApi.register({ name, email, password });
//       setUser(data.user);
//     } catch (error) {
//       const message =
//         error instanceof Error ? error.message : "Registration failed";
//       throw new Error(message);
//     }
//   };
//   const logOut = async (): Promise<void> => {
//     try {
//       await authApi.logout();
//       setUser(null);
//       router.push("/login");
//     } catch (error) {
//       const message = error instanceof Error ? error.message : "Logout failed";
//       throw new Error(message);
//     }
//   };

//   return {
//     user,
//     loading,
//     login,
//     register,
//     logOut,
//   };
// };

// export default useAuth;
