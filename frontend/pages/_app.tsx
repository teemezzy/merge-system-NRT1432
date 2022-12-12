import "../styles/globals.css";
import "antd/dist/antd.css";

function MyApp(props: any) {
  const { Component, pageProps } = props;
  return <Component {...pageProps} />;
}

export default MyApp;
