import React from "react";
import { Outlet } from "react-router-dom";
import NavigationListener from "@/components/NavigationListener.tsx";

export default function RootLayout() {
  return (
    <>
      <NavigationListener />
      <Outlet />
    </>
  );
}