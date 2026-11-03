import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button/Button";
import ArrowBack from "../../assets/16/arrowBack.svg";

export const NavbarDriving = () => {
  const navigate = useNavigate();
  return (
    <div
      className="w-full bg-[var(--darkBlue)] text-white flex justify-between items-center h-30 mb-10 px-4 absolute"
      style={{ borderRadius: "30px 30px 0 0" }}
    >
      <Button
        className="bg-gray-600 rounded-full py-2 px-3"
        onClick={() => navigate("/driving")}
        variant={"Icon"}
      >
        <img src={ArrowBack} alt="" width={10} height={12} />
      </Button>
      <p className="text-lg text-center">
        Экзаменационные <br /> маршруты
      </p>
      <div></div>
    </div>
  );
};
