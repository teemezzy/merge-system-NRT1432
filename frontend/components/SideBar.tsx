import React from "react";
import Link from "next/link";

interface SideBarProps {
  currentUser: any;
}

const SideBar: React.FC<SideBarProps> = (props) => {
  const { currentUser } = props;

  return (
    currentUser && (
      <aside className="fixed">
        <div className="flex flex-col border-r w-44 mt-5 ml-2 space-y-4">
          {/* <Link href="/">
            <a className="">Home</a>
          </Link>
          <Link href="/sign-out">
            <a className="">Signout</a>
          </Link> */}
        </div>
      </aside>
    )
  );
};

export default SideBar;
