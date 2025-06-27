import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

const ShoppingLayout = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* ---- Common Header --------*/}
      <ShoppingHeader />
      <main className="flex flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ShoppingLayout;
