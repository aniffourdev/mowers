// "use client"; // Mark this as a Client Component

// import { useEffect } from "react";
// import { usePathname, useSearchParams } from "next/navigation";
// import NProgress from "nprogress";
// import "nprogress/nprogress.css";

// export default function ProgressBar() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     NProgress.start(); // Start the progress bar when the route changes

//     const timeout = setTimeout(() => {
//       NProgress.done(); // Stop the progress bar after a short delay
//     }, 300);

//     return () => {
//       clearTimeout(timeout);
//       NProgress.done(); // Ensure the progress bar stops if the component unmounts
//     };
//   }, [pathname, searchParams]);

//   return null; // This component doesn't render anything
// }
