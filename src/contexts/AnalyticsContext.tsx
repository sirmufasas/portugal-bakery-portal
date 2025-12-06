// // src/contexts/AnalyticsContext.tsx
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface PageVisit {
//   id: string;
//   page: string;
//   timestamp: number;
//   duration: number;
//   actions: string[];
// }

// interface Visitor {
//   id: string;
//   firstVisit: number;
//   lastVisit: number;
//   totalVisits: number;
//   pages: string[];
//   hasOrdered: boolean;
//   email?: string;
//   phone?: string;
//   totalSpent: number;
// }

// interface AnalyticsContextType {
//   visitors: Visitor[];
//   currentVisitors: number;
//   totalVisits: number;
//   trackPageVisit: (page: string) => void;
//   trackAction: (action: string) => void;
//   trackOrder: (email: string, phone: string, amount: number) => void;
//   getVisitorStats: () => any;
// }

// const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// export function AnalyticsProvider({ children }: { children: ReactNode }) {
//   const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
//   const [visitors, setVisitors] = useState<Visitor[]>(() => {
//     const saved = localStorage.getItem('analytics-visitors');
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [currentPage, setCurrentPage] = useState('');
//   const [pageStartTime, setPageStartTime] = useState(Date.now());
//   const [currentActions, setCurrentActions] = useState<string[]>([]);

//   // Persist visitors
//   useEffect(() => {
//     localStorage.setItem('analytics-visitors', JSON.stringify(visitors));
//   }, [visitors]);

//   // Track current session
//   useEffect(() => {
//     const existingVisitor = visitors.find(v => v.id === sessionId);
//     if (!existingVisitor) {
//       const newVisitor: Visitor = {
//         id: sessionId,
//         firstVisit: Date.now(),
//         lastVisit: Date.now(),
//         totalVisits: 1,
//         pages: [],
//         hasOrdered: false,
//         totalSpent: 0,
//       };
//       setVisitors(prev => [...prev, newVisitor]);
//     }
//   }, []);

//   const trackPageVisit = (page: string) => {
//     setCurrentPage(page);
//     setPageStartTime(Date.now());
//     setCurrentActions([]);

//     setVisitors(prev => prev.map(v => 
//       v.id === sessionId 
//         ? { ...v, pages: [...new Set([...v.pages, page])], lastVisit: Date.now() }
//         : v
//     ));
//   };

//   const trackAction = (action: string) => {
//     setCurrentActions(prev => [...prev, action]);
//   };

//   const trackOrder = (email: string, phone: string, amount: number) => {
//     setVisitors(prev => prev.map(v => 
//       v.id === sessionId 
//         ? { 
//             ...v, 
//             hasOrdered: true, 
//             email, 
//             phone, 
//             totalSpent: v.totalSpent + amount,
//             lastVisit: Date.now()
//           }
//         : v
//     ));
//     trackAction(`Placed order: R${amount}`);
//   };

//   const getVisitorStats = () => {
//     const now = Date.now();
//     const last24h = now - 24 * 60 * 60 * 1000;
//     const last7d = now - 7 * 24 * 60 * 60 * 1000;

//     return {
//       totalVisitors: visitors.length,
//       visitorsLast24h: visitors.filter(v => v.lastVisit > last24h).length,
//       visitorsLast7d: visitors.filter(v => v.lastVisit > last7d).length,
//       totalOrders: visitors.filter(v => v.hasOrdered).length,
//       totalRevenue: visitors.reduce((sum, v) => sum + v.totalSpent, 0),
//       avgOrderValue: visitors.filter(v => v.hasOrdered).length > 0
//         ? visitors.reduce((sum, v) => sum + v.totalSpent, 0) / visitors.filter(v => v.hasOrdered).length
//         : 0,
//       conversionRate: visitors.length > 0 
//         ? (visitors.filter(v => v.hasOrdered).length / visitors.length) * 100
//         : 0,
//     };
//   };

//   const currentVisitors = visitors.filter(v => 
//     Date.now() - v.lastVisit < 5 * 60 * 1000 // Active in last 5 minutes
//   ).length;

//   return (
//     <AnalyticsContext.Provider value={{
//       visitors,
//       currentVisitors,
//       totalVisits: visitors.reduce((sum, v) => sum + v.totalVisits, 0),
//       trackPageVisit,
//       trackAction,
//       trackOrder,
//       getVisitorStats,
//     }}>
//       {children}
//     </AnalyticsContext.Provider>
//   );
// }

// export function useAnalytics() {
//   const context = useContext(AnalyticsContext);
//   if (!context) {
//     throw new Error("useAnalytics must be used within an AnalyticsProvider");
//   }
//   return context;
// }