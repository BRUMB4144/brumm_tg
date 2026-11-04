import { Badge } from "@geist-ui/react";
import X from "../../../assets/modalClose.svg";
import { FC } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import { useNotifications } from "../../../lib/notifications";

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Notification: FC<NotificationProps> = ({ isOpen, onClose }) => {
  const { data: notify, isLoading, isError, refetch, remove } = useNotifications(isOpen);
  const handleDelete = (id: string) => remove.mutate(id);
  return (
    <>
      {isOpen && (
        <div className="absolute z-50 top-0 left-0 bg-[#0F1D2D] w-full h-full opacity-100 text-white duration-300 transition-all ">
          <div className="py-10 px-[24px] flex flex-col mt-[76px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <h1>Уведомления</h1>
                <Badge
                  scale={1}
                  type="default"
                  style={{
                    borderRadius: "16px",

                    color: "black",
                    background: "#fff",
                  }}
                >
                  {notify ? notify.length : 0}
                </Badge>
              </div>
              <img src={X} alt="" width={24} onClick={onClose} />
            </div>
            {isLoading && <p>Загрузка уведомлений…</p>}
            {(isError || remove.isError) && <p role="alert">Не удалось загрузить или изменить уведомления. <button onClick={() => void refetch()}>Повторить</button></p>}
            <br />
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-4">
                {notify && notify.length > 0
                  ? notify.map((item) => (
                      <NotificationCard
                        key={item._id}
                        createdAt={item.createdAt}
                        title={item.title}
                        description={item.description}
                        onDelete={() => handleDelete(item._id)}
                      />
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
