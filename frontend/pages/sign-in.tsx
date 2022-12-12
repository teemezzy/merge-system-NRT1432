import { Button, Form, Input } from "antd";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { interceptedAxios } from "../utils/helpers";
import cookieCutter from "cookie-cutter";
import { XCircleIcon } from "@heroicons/react/solid";
import BaseLayout from "../components/Layout";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SignIn: React.FC = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [errorBannerText, setBannerText] = useState(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const result = await interceptedAxios.post(
        `${apiUrl}/api/v1/login/access-token`,
        new URLSearchParams({ ...values }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      cookieCutter.set("token", result.data.access_token);
      window.location.pathname = "/dashboard";
      setLoading(false);
    } catch (error: any) {
      if (error?.response?.data?.detail) {
        setBannerText(error.response.data.detail);
        setLoading(false);
        return;
      }
    }
  };

  return (
    <BaseLayout
      pageTitle="eGator Biometric Verification - Sign In"
      currentUser={null}
    >
      <div className="flex flex-col justify-center items-center h-screen">
        {errorBannerText && (
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Attention required
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{errorBannerText}</p>
              </div>
            </div>
          </div>
        )}

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password disabled={loading} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Sign in
            </Button>
          </Form.Item>
          <div className="text-center">
            <Link href="/sign-up">
              <span>
                {" "}
                New user?<a> register now!</a>
              </span>
            </Link>
          </div>
        </Form>
      </div>
    </BaseLayout>
  );
};

export default SignIn;

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
