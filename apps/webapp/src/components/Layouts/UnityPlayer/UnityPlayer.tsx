// "use client";

// import { useEffect } from "react";

// declare global {
//   interface Window {
//     createUnityInstance: (
//       canvas: HTMLElement | null,
//       config: UnityConfig
//     ) => Promise<void>;
//   }
// }

// interface UnityConfig {
//   dataUrl: string;
//   frameworkUrl: string;
//   codeUrl: string;
//   streamingAssetsUrl: string;
//   companyName: string;
//   productName: string;
//   productVersion: string;
// }

// const UnityPlayer = () => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "/unity/Build/carweb.loader.js";
//     script.onload = () => {
//       if (window.createUnityInstance) {
//         window.createUnityInstance(document.getElementById("unityCanvas"), {
//           dataUrl: "/unity/Build/carweb.data.unityweb",
//           frameworkUrl: "/unity/Build/carweb.framework.js.unityweb",
//           codeUrl: "/unity/Build/carweb.wasm.unityweb",
//           streamingAssetsUrl: "/unity/TemplateData",
//           companyName: "YourCompany",
//           productName: "YourGame",
//           productVersion: "1.0",
//         });
//       } else {
//         console.error("createUnityInstance is not defined");
//       }
//     };
//     document.body.appendChild(script);
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "100vh", textAlign: "center" }}>
//       <canvas id="unityCanvas" width="960" height="600"></canvas>
//     </div>
//   );
// };

// export default UnityPlayer;
