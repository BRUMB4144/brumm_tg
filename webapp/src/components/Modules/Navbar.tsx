import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { NAVBAR } from "../../constants/routes.constant";
import polygon from "../../assets/navbar.svg";
export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      <div className="fixed bottom-0 w-full mb-0 py-0">
        <div
          className="bg-white h-2 relative top-4 mb-2"
          style={{ borderRadius: "0 0 10px 10px" }}
        ></div>
        <div className="flex w-full justify-between px-7 bg-[var(--blueAccent)] py-4">
          {NAVBAR.map((item) => {
            const isActive = location.pathname === item.link;
            return (
              <div
                className="flex flex-col items-center gap-2 cursor-pointer text-white pt-4"
                key={item.id}
                onClick={() => navigate(item.link)}
              >
                {isActive && (
                  <div className="bg-blue-200 blur-xl opacity-20 absolute h-20 w-30 z-0 top-5 rounded-full"></div>
                )}
                {isActive && (
                  <img
                    src={polygon}
                    alt=""
                    width={30}
                    className="absolute top-5 opacity-100 rounded-full"
                  />
                )}
                <img src={item.img} alt="" width={26} height={26} />
                <p className="navbarText">{item.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
