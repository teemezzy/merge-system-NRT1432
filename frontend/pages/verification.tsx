import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { streamVerifyVideoToAPI } from "../utils/api";
import { CheckCircleIcon } from "@heroicons/react/outline";
import BaseLayout from "../components/Layout";
import Cookies from "cookies";
import Link from "next/link";
import { Button } from "antd";

const Register: NextPage = (props: any) => {
  const { token } = props;
  const videoRef = useRef(null as any);
  const [startFaceVerification, setstartFaceVerification] = useState(false);
  const [verificationIsSuccessful, setverificationIsSuccessful] =
    useState(false);
  const [response, setResponse] = useState(null as any);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 500, height: 600 }, audio: false })
      .then((stream) => {
        if (startFaceVerification) {
          streamVerifyVideoToAPI(
            stream,
            setverificationIsSuccessful,
            setstartFaceVerification,
            setResponse
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
    getVideo();
  }, [startFaceVerification]);

  const streamFaceVideo = () => {
    setstartFaceVerification(true);
  };

  return (
    <BaseLayout pageTitle="eGator Biometric Verification" currentUser={null}>
      <main className="mt-10">
        <h1 className="text-3xl text-center mt-10">
          Authenticate with face ID
        </h1>
        <p className="text-center my-5">
          Center your face in the box below, and click the authenticate button
        </p>

        <div className="flex flex-col justify-center items-center">
          {verificationIsSuccessful ? (
            <div className="">
              <CheckCircleIcon className="h-10 w-10 text-green-500" />
            </div>
          ) : (
            <div className="w-[20rem] h-auto border border-[#000000]">
              <video ref={videoRef} src=""></video>
            </div>
          )}

          {verificationIsSuccessful ? (
            <div className="text-center">
              <div className="mt-5 bg-green-600 p-3 text-white shadow-lg text-center w-72">
                <p>Verification successful!</p>
                <p>
                  Hello{" "}
                  <b>
                    {response?.user.first_name} {response?.user.last_name}
                  </b>
                </p>
              </div>
              <Button
                onClick={streamFaceVideo}
                className="p-3 mt-4"
                loading={startFaceVerification}
                size="large"
              >
                <Link href="/dashboard">
                  <a> Back to dashboard</a>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              {response && response.hasError && response.message === "FAILED" && (
                <div className="mt-5 p-3">
                  <p className="text-red-400 text-lg">
                    Verification failed! if you&apos;re a new user, then ensure
                    you register your face ID first in your
                    <Link href="/dashboard">
                      <a className="text-blue-500"> dashboard</a>
                    </Link>
                  </p>
                </div>
              )}
              <div className="text-center">
                <Button
                  onClick={streamFaceVideo}
                  className="p-3 mt-4"
                  loading={startFaceVerification}
                  size="large"
                >
                  {startFaceVerification ? "Authenticating..." : "Authenticate"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
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
