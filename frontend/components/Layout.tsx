import React from "react";
import Image from "next/image";
import Head from "next/head";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import LoadingDashboardSkeleton from "./LoadingSkeleton";

interface BaseLayourProps {
  children: React.ReactNode;
  currentUser: any;
  pageTitle: string;
}

const BaseLayout: React.FC<BaseLayourProps> = (props) => {
  const { children, currentUser, pageTitle } = props;

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Created by eGator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar currentUser={currentUser} />
      <div className="flex flex-col">
        <SideBar currentUser={currentUser} />
        <main>{children}</main>
      </div>

      <footer className="fixed bottom-0 left-0 z-20 p-4 w-full bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
        <span className="flex flex-row text-sm text-gray-500 sm:text-center dark:text-gray-400">
          <a
            href="https://egator.co"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2 justify-between"
          >
            <span className="flex justify-center items-center">
              <Image
                src="/static/logo.png"
                alt="eGator Logo"
                width={25}
                height={25}
              />
            </span>
          </a>
          © 2022 . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
          <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Privacy Policy
            </a>
          </li>
          {/* <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">
              Licensing
            </a>
          </li> */}
          <li>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default BaseLayout;
