"use client";

import { UserProvider } from "@/models/providers/userProvider";
import { User } from "@/models/user";


// export const getApiConfig = () => {
//     const userProvider = new UserProvider();
//     if (!userProvider.user.token) {
//         const user:User = userProvider.fromLocal();
//         if(user.token){
//             return {
//                 headers: {
//                     'Authorization': `Bearer ${user.token}`,
//                     'Access-Control-Allow-Origin': '*',
//                 }
//             };
//         }
//         return {};
//     }
//     return {
//         headers: {
//             'Authorization': `Bearer ${userProvider.user.token}`,
//             'Access-Control-Allow-Origin': '*',
//         }
//     };
// }