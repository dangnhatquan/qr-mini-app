import React from "react";
import { Page } from "zmp-ui";
import Lottie from "lottie-react";
import animationData from "@/static/qr-mini-app-animation.json";

const HomePage: React.FC = () => {
  return (
    <Page className="page bg-gray-50 flex flex-col items-center justify-center">
      <Lottie animationData={animationData} loop={true} />
    </Page>
  );
};

export default HomePage;
