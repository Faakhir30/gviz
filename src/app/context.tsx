// import { createContext } from 'react';

// interface AppContextProps {
//   poolInfo: {
//     host: string;
//     database: string;
//     user: string;
//     password: string;
//   };
//   setPoolInfo: any;
// }

// export const AppContext = createContext<AppContextProps | undefined>(undefined);

// export const setGlobalPoolInfo = (context: AppContextProps | undefined, poolInfo: AppContextProps['poolInfo']) => {
//   if (context) {
//     context.setPoolInfo(poolInfo);
//   }
// };

// export const getGlobalPoolInfo = (context: AppContextProps | undefined) => {
//   return context ? context.poolInfo : null;
// };
