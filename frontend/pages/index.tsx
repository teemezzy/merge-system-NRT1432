import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import BaseLayout from "../components/Layout";
import { Button, Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { getUserInfo } from "../utils/api";
import Cookies from "cookies";

const Home: NextPage = (props: any) => {
  const { token } = props;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUserInfo(token).then((res) => {
      const userData = res?.data;
      if (userData) {
        const extendedUser = {
          ...userData,
          token,
          full_name: `${userData.first_name} ${userData.last_name}`,
        };
        setCurrentUser(extendedUser);
      }
    });
  }, [token]);

  return (
    <BaseLayout
      pageTitle="eGator Biometric Verification"
      currentUser={currentUser}
    >
      <div className="h-screen flex justify-center items-center text-center">
        <div className="shadow-lg rounded-lg p-4">
          <p>
            Test your biometric authentication. Click the button below to get
            started.
          </p>
          <Button
            type="primary"
            className="mt-4"
            block
            size="large"
          >
            <Link href="/verification">Test Biometric Authentication</Link>
          </Button>
        </div>
        {currentUser ? (
          <div className="shadow-lg rounded-lg p-4">
            <p>
              Hello <b>{currentUser.full_name}</b>, you are logged in. Click the
              button below to see your dashboard.
            </p>
            <Button type="primary" className="mt-4" block size="large">
              <Link href="/dashboard">
                <a className="">Go to dashboard</a>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="shadow-lg rounded-lg p-4">
            <p>
              If you are a new user, click the button below to sign up for an
              account.
            </p>
            <Button type="primary" className="mt-4" block size="large">
              <Link href="/sign-in">
                <a className="">Login</a>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token") || null;
  return {
    props: { token },
  };
};
