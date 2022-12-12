import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Cookies from "cookies";
import { getUserInfo } from "../utils/api";
import { getUserDetails } from "../utils/helpers";
import BaseLayout from "../components/Layout";
import LoadingDashboardSkeleton from "../components/LoadingSkeleton";
import Link from "next/link";

const Dashboard: NextPage = (props: any) => {
  const { token } = props;
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/sign-in");
      return;
    }
    getUserInfo(token).then((response) => {
      setCurrentUser(getUserDetails({ response, token }));
    });
  }, [token]);

  return (
    <BaseLayout
      currentUser={currentUser}
      pageTitle="eGator Biometric Verification"
    >
      {currentUser ? (
        <div>
          <main className="text-center mt-28 ">
            <h1 className="text-xl">
              Welcome to this authentication demo.
            </h1>
            {currentUser?.has_face_encodings ? (
              <div className="shadow-lg rounded-lg p-4">
                <p>You have already registered your face</p>
                <Link href="/verification">
                  <a className="">Test Face Authentication</a>
                </Link>
              </div>
            ) : (
              <div className="shadow-lg rounded-lg p-4">
                <p>You have not registered your face authentication. Click the link below to add face ID</p>
                <Link href="/face-id-registration">
                  <a className="">Register Face Authentication</a>
                </Link>
              </div>
            )}
          </main>
        </div>
      ) : (
        <LoadingDashboardSkeleton />
      )}
    </BaseLayout>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token") || null;
  return {
    props: { token },
  };
};
