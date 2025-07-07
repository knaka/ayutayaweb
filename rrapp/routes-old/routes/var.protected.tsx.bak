import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import React from "react";

export const loader: LoaderFunction = async (args) => {
  console.log('Authentication logic here');
  return null;
};

export default (() => {
  return (
    <div>
      <h1>Protected</h1>
      <Outlet />
    </div>
  );
}) as React.FC;
