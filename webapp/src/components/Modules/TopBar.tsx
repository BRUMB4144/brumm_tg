import { FC, useState } from "react";
import Profile from "../../assets/24/profile.svg";
import NotificationImg from "../../assets/24/notification.svg";
import { Outlet, useNavigate } from "react-router-dom";
import { Badge } from "@geist-ui/react";
import { Notification } from "../Layouts/Notification/Notification";
import cross from "../../assets/16/x.svg";
import { useNotifications } from "../../lib/notifications";
import arrowBack from "../../assets/24/arrback.svg";
interface TopBarProps {
  variant: "profile" | "standard";
  onClick?: () => void;
}

const NotificationButton: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { data: notify } = useNotifications();
  return (
    <>
      <div
        className="px-2 py-1 bg-gray-100 rounded-full flex items-center gap-1"
        onClick={onClose}
      >
        <Badge
          scale={1}
          type="success"
          style={{
            borderRadius: "16px",
            padding: "3px 7px",
            height: "fit-content",
          }}
        >
          {notify ? notify.length : 0}
        </Badge>
        <img src={NotificationImg} alt="" width={24} />
      </div>
      <Notification isOpen={open} onClose={onClose} />
    </>
  );
};

// export const FullTopBarExit = () => {
//   const [open, setOpen] = useState(false);
//   const handleModal = () => {
//     setOpen(!open);
//   };
//   const navigate = useNavigate();

//   return (
//     <div className="w-full flex justify-between items-center mt-[76px] px-[14px] mb-[20px]">
//       <div></div>
//       <div className="flex gap-2">
//         <NotificationButton open={open} onClose={handleModal} />
//         <img
//           src={Profile}
//           className="px-2 py-1 bg-gray-100 rounded-full"
//           width={42}
//           onClick={() => navigate("/profile")}
//         />
//       </div>
//     </div>
//   );
// };
// export const FullTopBarClose = () => {
//   const [open, setOpen] = useState(false);
//   const handleModal = () => {
//     setOpen(!open);
//   };
//   const navigate = useNavigate();

//   return (
//     <div className="w-full flex justify-between items-center mt-[100px] px-[14px] mb-[20px]">
//       <div
//         className="flex items-center gap-2 bg-[#E0EEFF] px-3 py-1 rounded-full"
//         onClick={() => navigate("/tickets")}
//       >
//         <img src={cross} alt="" />
//         <button className="text-[#3942CF]">Завершить</button>
//       </div>
//       <div className="flex gap-2">
//         <NotificationButton open={open} onClose={handleModal} />
//         <img
//           src={Profile}
//           className="px-2 py-1 bg-gray-100 rounded-full"
//           width={42}
//           onClick={() => navigate("/profile")}
//         />
//       </div>
//     </div>
//   );
// };
// export const FullTopBarBack = () => {
//   const [open, setOpen] = useState(false);
//   const handleModal = () => {
//     setOpen(!open);
//   };
//   const navigate = useNavigate();

//   return (
//     <div className="w-full flex justify-between items-center mt-[76px] px-[14px] mb-[20px]">
//       <div
//         className="flex items-center gap-2 bg-[#E0EEFF] px-3 py-1 rounded-full"
//         onClick={() => navigate(-1)}
//       >
//         <img src={arrowBack} alt="" />
//         <button className="text-[#3942CF]">Назад</button>
//       </div>
//       <div className="flex gap-2">
//         <NotificationButton open={open} onClose={handleModal} />
//         <img
//           src={Profile}
//           className="px-2 py-1 bg-gray-100 rounded-full"
//           width={42}
//           onClick={() => navigate("/profile")}
//         />
//       </div>
//     </div>
//   );
// };
export const Standard = () => {
  const [open, setOpen] = useState(false);
  const handleModal = () => {
    setOpen(!open);
  };
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-center mt-[100px] px-[14px] mb-[20px]">
      <div></div>
      <div className="flex gap-2">
        <NotificationButton open={open} onClose={handleModal} />
        <img
          src={Profile}
          className="px-2 py-1 bg-gray-100 rounded-full"
          width={42}
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
};
export const ProfileTopBar = () => {
  const [open, setOpen] = useState(false);
  const handleModal = () => {
    setOpen(!open);
  };
  return (
    <div className="w-full flex justify-between items-center mt-[100px] px-[14px] mb-[20px]">
      <div></div>
      <div className="flex gap-2">
        <NotificationButton open={open} onClose={handleModal} />
      </div>
    </div>
  );
};

export const TopBar: FC<TopBarProps> = ({ variant }) => {
  return (
    <div>
      {variant === "standard" && <Standard />}
      {variant === "profile" && <ProfileTopBar />}
      <Outlet />
    </div>
  );
};
