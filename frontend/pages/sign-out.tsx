import { GetServerSideProps } from "next";
import Cookies from "cookies";

export default function SignOut() {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = new Cookies(context.req, context.res);
  cookies.set("token", null);

  return {
    redirect: {
      destination: "/sign-in",
    },
    props: {},
  };
};
