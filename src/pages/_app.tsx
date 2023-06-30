import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const MyApp: AppType = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default MyApp;
