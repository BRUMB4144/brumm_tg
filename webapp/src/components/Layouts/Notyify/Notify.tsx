import { useState, useEffect } from "react";
import { Button } from "../../ui/Button/Button";
import cross from "../../../assets/16/cross.svg";
import { useNotifications } from "../../../lib/notifications";

export const Notify = () => {
  const [toast, setToast] = useState<boolean>(true);
  const { data, remove } = useNotifications();
  const deleteNotify = (_id: string) => remove.mutate(_id, { onSuccess: () => setToast(false) });
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setToast(true);
    }, 2000);
    const hideTimer = setTimeout(() => {
      setToast(false);
    }, 5000);

    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);
  return (
    <div className="relative">
      {remove.isError && <p role="alert">Не удалось скрыть уведомление. Повторите попытку.</p>}
      {toast &&
        data?.map((item) => (
          <div key={item._id}
            className={`
          bg-[#4B46A4] px-5 py-4 flex flex-col gap-3 text-white
          absolute z-50 rounded-2xl w-full
          animate-toast
        `}
          >
            <div className="flex w-full justify-between ">
              <h2>{item.title}</h2>
              <img src={cross} onClick={() => deleteNotify(item._id)} alt="" />
            </div>
            <p>{item.description}</p>
            {item.link && (
              <Button className="border-[0.5px] border-white">
                Перейти к уроку
              </Button>
            )}
          </div>
        ))}
      <style>{`
        @keyframes toastAnimation {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20% {
            transform: translateY(20px);
            opacity: 1;
          }
          80% {
            transform: translateY(20px);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .animate-toast {
          animation: toastAnimation 3s ease-in-out forwards;
          top: 0;
        }
      `}</style>
    </div>
  );
};
