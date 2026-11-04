import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import pic from "../../../assets/image.png";
export const Game = () => {
  const { unityProvider } = useUnityContext({
    loaderUrl: "/unity/Build/CAR.loader.js",
    dataUrl: "/unity/Build/CAR.data.unityweb",
    frameworkUrl: "/unity/Build/CAR.framework.js.unityweb",
    codeUrl: "/unity/Build/CAR.wasm.unityweb",
  });

  const [isLandscape, setIsLandscape] = useState(false);
  const [showRotateMessage, setShowRotateMessage] = useState(false);

  useEffect(() => {
    const canvas = document.querySelector(
      "#unity-canvas"
    ) as HTMLCanvasElement | null;
    if (canvas) {
      const setCanvasSize = () => {
        const aspectRatio = 16 / 9;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (windowWidth / windowHeight > aspectRatio) {
          canvas.style.width = `${windowHeight * aspectRatio}px`;
          canvas.style.height = "100%";
        } else {
          canvas.style.width = "100%";
          canvas.style.height = `${windowWidth / aspectRatio}px`;
        }

        canvas.style.position = "absolute";
        canvas.style.left = "50%";
        canvas.style.top = "50%";
        canvas.style.transform = "translate(-50%, -50%)";
      };

      setCanvasSize();
      window.addEventListener("resize", setCanvasSize);
      return () => window.removeEventListener("resize", setCanvasSize);
    }
  }, [unityProvider]);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isPortrait = window.innerWidth < window.innerHeight;
      const isCurrentlyLandscape = window.innerWidth >= window.innerHeight;

      setIsLandscape(isCurrentlyLandscape);
      setShowRotateMessage(isMobile && isPortrait);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {showRotateMessage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <img src={pic} width="264px" alt="" />
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          visibility: isLandscape ? "visible" : "hidden",
        }}
      />
    </div>
  );
};
