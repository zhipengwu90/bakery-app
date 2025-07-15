"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Logo from "./Logo";
import {
  IcRoundClose,
  SkillIconsInstagram,
  CibYelp,
  DeviconFacebook,
  MingcutePhoneFill,
} from "./Icons";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change background after scrolling 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  interface CustomLinkProps {
    href: string;
    title: string;
    className?: string;
  }

  interface CustomMobileLinkProps {
    href: string;
    title: string;
    className?: string;
    onToggle: () => void;
  }

  const CustomLink: React.FC<CustomLinkProps> = ({
    href,
    title,
    className,
  }) => {
    const textColor = isHomePage && !isScrolled ? "text-white" : "text-dark";
    const hoverColor =
      isHomePage && !isScrolled ? "hover:text-red-300" : "hover:text-red-500";

    return (
      <Link
        href={href}
        className={`${className} relative group ${textColor} ${hoverColor} transition-colors duration-300`}
      >
        {title}

        <span
          className={`absolute inline-block h-[2px] left-0 -bottom-0.5 group-hover:w-full transition-[width] ease-in-out duration-300 group-hover:bg-red-500 bg-dark
        ${pathname === href ? "w-full" : "w-0"}`}
        >
          &nbsp;
        </span>
      </Link>
    );
  };
  const CustomMobileLink: React.FC<CustomMobileLinkProps> = ({
    href,
    title,
    className,
    onToggle,
  }) => {
    return (
      <Link
        href={href}
        className={`${className} relative group md:text-xl hover:text-red-500 my-4`}
        onClick={() => {
          onToggle();
        }}
      >
        {title}

        <span
          className={`absolute inline-block h-[2px] left-0 -bottom-0.5 group-hover:w-full transition-[width] ease-in-out duration-300 group-hover:bg-red-500 bg-dark
        ${pathname === href ? "w-full" : "w-0"}`}
        >
          &nbsp;
        </span>
      </Link>
    );
  };

  const componentToPortal = (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-w-[60vw] h-[50vh] flex flex-col justify-center items-center z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-light/80 text-dark rounded-lg shadow-lg p-8  backdrop-blur-lg "
    >
      <IcRoundClose
        onClick={() => setIsOpen(false)}
        className="w-7 h-7 text-light
        cursor-pointer
        absolute top-5 right-5"
      />
      {/* Mobile tab*/}
      <nav className="flex flex-col justify-center items-center my-4">
        <CustomMobileLink href="/" title="Home" onToggle={handleToggle} />
        <CustomMobileLink href="/menu" title="Menu" onToggle={handleToggle} />
        <CustomMobileLink href="/about" title="About" onToggle={handleToggle} />
      </nav>

      {/* Mobile social medial icon */}
      <nav className="flex items-center justify-center gap-8">
        <a
          href="https://www.facebook.com/brazenPoppy/"
          target={"_blank"}
          className=" w-9 h-9"
          onClick={() => setIsOpen(false)}
        >
          <DeviconFacebook className="w-full h-full" />
        </a>
        <a
          href="https://www.instagram.com/brazenpoppy/"
          target={"_blank"}
          className=" w-9 h-9"
          onClick={() => setIsOpen(false)}
        >
          <SkillIconsInstagram className="w-full h-full" />
        </a>
      </nav>
    </motion.div>
  );

  // Dynamic styles based on home page and scroll state
  const headerTextColor =
    isHomePage && !isScrolled ? "text-white" : "text-dark";
  const hamburgerColor = isHomePage && !isScrolled ? "bg-white" : "bg-dark";
  const phoneTextColor = isHomePage && !isScrolled ? "text-white" : "text-dark";
  const phoneIconColor = isHomePage && !isScrolled ? "#ffffff" : "#000000";
  return (
    <header
      className={`sticky z-50 top-0 w-full px-32 py-5 xl:px-24 lg:px-16 md:px-12 sm:px-8 xs:px-6 font-semibold text-lg flex items-center justify-between ${headerTextColor} transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-white shadow-lg backdrop-blur-sm opacity-90"
          : "bg-transparent"
      }`}
    >
      <button
        className="flex-col justify-center items-center hidden lg:flex"
        onClick={handleToggle}
      >
        <span
          className={`${hamburgerColor} block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm  ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`${hamburgerColor} block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`${hamburgerColor} block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm  ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      <div className="absolute left-[50%] top-2 lg:top-0 translate-x-[-50%]">
        <Logo />
      </div>
      {/* phone icon on mobile */}
      <nav className=" item-center justify-center gap-5 hidden lg:flex">
        <motion.a
          href="tel:2509051123"
          target={"_blank"}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          className={`w-6 h-6 ${phoneTextColor} transition-colors duration-300`}
          onClick={() => setIsOpen(false)}
        >
          <MingcutePhoneFill fill={phoneIconColor} className="w-full h-full" />
        </motion.a>
      </nav>

      <div className="w-full  flex justify-between items-center lg:hidden">
        <nav>
          <CustomLink href="/" title="Home" className="mr-4" />
          <CustomLink href="/menu" title="Menu" className="mx-4" />
          <CustomLink href="/about" title="About" className="ml-4" />
        </nav>

        <nav className="flex item-center justify-center gap-5">
          <motion.a
            href="https://www.facebook.com/brazenPoppy/"
            target={"_blank"}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            className={`w-6 h-6 ${phoneTextColor} transition-colors duration-300`}
            onClick={() => setIsOpen(false)}
          >
            <DeviconFacebook className="w-full h-full" />
          </motion.a>

          <motion.a
            href="https://www.instagram.com/brazenpoppy/"
            target={"_blank"}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            className={`w-7 h-7 ${phoneTextColor} transition-colors duration-300`}
          >
            <SkillIconsInstagram className="w-full h-full" />
          </motion.a>

          <motion.a
            href="tel:2509051123"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            className={`self-center ${phoneTextColor} transition-colors duration-300`}
          >
            <div> 250-905-1123</div>
          </motion.a>
        </nav>
      </div>
      {isOpen &&
        createPortal(componentToPortal, document.getElementById("modal-root")!)}
    </header>
  );
};

export default NavBar;
