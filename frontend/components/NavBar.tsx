import type { MenuProps } from "antd";
import { Layout, Button } from "antd";
import React from "react";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/outline";
import Link from "next/link";

const { Header } = Layout;

interface BaseLayourProps {
  currentUser: any;
}

const NavBar: React.FC<BaseLayourProps> = (props) => {
  const { currentUser } = props;

  return (
    <nav className="sticky top-0 z-50 bg-white border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link href="/">
        <a  className="flex items-center">
          <Image
            src="/static/logo.png"
            alt="eGator Logo"
            width={30}
            height={30}
          />
          <span className="ml-2 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            gator
          </span>
        </a>
        </Link>
        <div className="flex items-center md:order-2">
          {currentUser ? (
            <div className="flex flex-col text-center">
              <Link href={"/dashboard"}>
                <div>
                  <span className="sr-only"></span>
                  <UserCircleIcon className="ml-3 w-8 h-8 text-gray-400" />
                </div>
              </Link>
              <Link href="/sign-out">
                <a className="">Sign out</a>
              </Link>
            </div>
          ) : (
            <div>
              <span className="sr-only">Sign in</span>
              <Link href="/sign-in">
                <a className="">Sign in</a>
              </Link>
            </div>
          )}
        </div>
        <div
          className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
          id="mobile-menu-2"
        >
          <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="#"
                className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
