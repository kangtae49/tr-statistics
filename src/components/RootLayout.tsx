import React from "react";
import { Outlet } from "react-router-dom";
import NavigationListener from "@/listeners/NavigationListener.tsx";
import TaskNotifyListener from "@/listeners/TaskNotifyListener.tsx";

export default function RootLayout() {
  return (
    <>
      <NavigationListener />
      <TaskNotifyListener />
      <Outlet />
    </>
  );
}