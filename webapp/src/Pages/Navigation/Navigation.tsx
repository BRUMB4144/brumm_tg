import { reportRequestError } from '../../lib/requestError';
import Container from "../../components/Layouts/Container/Container";
import {
  NavigationCard,
  NavigationCardPro,
} from "../../components/Layouts/NavigationCard/NavigationCard";
import {
  freeBlocks,
  proBlocksF,
  proBlocksS,
  proBlocksT,
  proBlocksFourth,
} from "../../constants/navigation.constance";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../../services/user.service";
import { IProfile } from "../../types/types";
import { NavigationService } from "../../services/navigation.service";

interface NavLink {
  _id: string;
  name: string;
  linkUrl: string;
  __v: number;
}

export const Navigation = () => {
  const [user, setUser] = useState<IProfile>();
  const [subscription, setSubscription] = useState<boolean>(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);
        setSubscription(data?.subscription.type === "free" ? false : true);
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
      }
    };
    const getNavlinks = async () => {
      try {
        const response = await NavigationService.getNavLinks();
        setNavLinks(response);
      } catch (error) { reportRequestError(error); }
    };
    fetchProfile();
    getNavlinks();
  }, []);

  const getLinkUrl = (name: string): string => {
    const navLink = navLinks.find((link) => link.name === name);
    return navLink ? navLink.linkUrl : "";
  };

  return (
    <Container>
      <div className="flex flex-col mt-[100px] gap-6 h-full">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-2xl text-[#172942]">Разделы</h1>
          <div className="flex gap-3">
            {freeBlocks.map((item) => (
              <NavigationCard
                name={item.name}
                image={item.image}
                key={item.id}
                id={item.id}
                link={item.link}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="text-lg text-[#172942]">Только с PRO</p>
          <div className="flex gap-2 flex-col">
            <div className="flex gap-3">
              {proBlocksF.map((item) => (
                <NavigationCardPro
                  name={item.name}
                  image={item.image}
                  key={item.id}
                  id={item.id}
                  subscription={subscription}
                  link={item.link}
                />
              ))}
            </div>
          </div>
        </div>
        {!subscription && (
          <button
            onClick={() => navigate("/landing")}
            className="bg-[var(--blueAccent)] py-3 text-white rounded-lg active:opacity-75"
          >
            Купить PRO
          </button>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};
