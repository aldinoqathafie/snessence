import React from "react";
import MobileLogin from "./MobileLogin";
import PCLogin from "./PCLogin";

export default function Login() {
  const isMobile = window.innerWidth < 768;
  return isMobile ? <MobileLogin /> : <PCLogin />;
}