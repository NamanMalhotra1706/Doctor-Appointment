import { useEffect, useRef, useContext } from "react";
import logo from "../../assests/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";
const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/doctors",
    display: "Find a doctor",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];
const Header = () => {
  const { user1 } = useContext(authContext);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, role, token } = useContext(authContext);
  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.remove("sticky_header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener("scroll", handleStickyHeader);
  });

  const toggleMenu = () => menuRef.current.classList.toggle("show_menu");

  console.log(role);
  console.log(user1);
  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between ">
          <div>
            <img src={logo} alt=" " />
          </div>
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            {/*===================nav left ==================== */}
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* ======================nav right ================ */}
          <div className="flex items-center gap-4">
            {(token && user) || user1 ? (
              <Link
                to={`${
                  role == "doctor" ? "/doctors/profile/me" : "/users/profile/me"
                }`}
                className="flex items-center gap-2" // Add flex container with gap
              >
                <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                  <img
                    src={user?.photo || user1?.photoURL}
                    className="w-full h-full rounded-full" // Ensure full height and width
                    alt=""
                  />
                </figure>
                <h2 className="text-lg font-semibold">
                  {user?.name || user1?.displayName}
                </h2>{" "}
              </Link>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-semibold h-[44px] flex items-center justify-center rounded-full">
                  Login
                </button>
              </Link>
            )}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
