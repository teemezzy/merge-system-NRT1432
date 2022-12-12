import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { getUserInfo, streamRegistrationVideoToAPI } from "../utils/api";
import { CheckCircleIcon } from "@heroicons/react/outline";
import BaseLayout from "../components/Layout";
import { useRouter } from "next/router";
import { getUserDetails } from "../utils/helpers";
import Cookies from "cookies";
import LoadingDashboardSkeleton from "../components/LoadingSkeleton";

const Register: NextPage = (props: any) => {
  const { token } = props;
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const videoRef = useRef(null as any);
  const [startFaceRegistration, setstartFaceRegistration] = useState(false);
  const [registrationIsSuccessful, setRegistrationIsSuccessful] =
    useState(false);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 500, height: 600 }, audio: false })
      .then((stream) => {
        if (startFaceRegistration) {
          streamRegistrationVideoToAPI(
            stream,
            setRegistrationIsSuccessful,
            setstartFaceRegistration,
            token
          );
        }

        let video = videoRef.current;
        video.srcObject = stream;
        return video.play();
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  useEffect(() => {
    if (!token) {
      router.push("/sign-in");
      return;
    }

    getUserInfo(token).then((response) => {
      setCurrentUser(getUserDetails({ response, token }));
    });

    getVideo();
  }, [startFaceRegistration, token]);

  const streamFaceVideo = () => {
    setstartFaceRegistration(true);
  };

  return (
    <BaseLayout
      pageTitle="eGator Biometric Registration"
      currentUser={currentUser}
    >
      {currentUser ? (
        <main className="mt-10">
          <h1 className="text-3xl text-center mt-10">Register your face ID</h1>
          <p className="text-center my-5">
            Place your face into the box below to begin. Click the ready button
            to start face ID registration.
          </p>

          <div className="flex flex-col justify-center items-center">
            {registrationIsSuccessful ? (
              <div className="">
                <CheckCircleIcon className="h-10 w-10 text-green-500" />
              </div>
            ) : (
              <div className="w-[20rem] h-auto border border-[#000000]">
                <video ref={videoRef} src=""></video>
              </div>
            )}

            {registrationIsSuccessful ? (
              <Link href={"/dashboard"}>
                <div className="mt-5 bg-green-600 p-3 cursor-pointer">
                  <p className="text-white">
                    Registration successful, Go to your dashboard to test it!
                  </p>
                </div>
              </Link>
            ) : (
              <button
                onClick={streamFaceVideo}
                className="border bg-red-500 text-white font-bold p-3 mt-2"
              >
                {startFaceRegistration
                  ? "Registration in progress..."
                  : "Ready"}
              </button>
            )}
          </div>
        </main>
      ) : (
        <LoadingDashboardSkeleton />
      )}
    </BaseLayout>
  );
};

export default Register;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token") || null;
  return {
    props: { token },
  };
};
