import { Button } from "@/components/ui/button";
import { SheetTrigger, Sheet, SheetContent } from "@/components/ui/sheet";
import { shoppingViewHeaderMenuItems } from "@/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HousePlus,
  LogOut,
  Menu,
  ShoppingCart,
  UserRoundPen,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems({ closeMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }

    // ✅ Close drawer after navigation
    if (closeMenu) closeMenu();
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}


function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    // dispatch(logoutUser());
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative rounded-full hover:bg-accent transition"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className=" absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-blue-800 text-orange-500 font-extrabold">
              {(() => {
                if (!user || !user.userName) return "G"; // Default letter or use "Guest"
                const userName = user.userName.toString().trim();
                return userName.length > 0 ? userName[0].toUpperCase() : "G";
              })()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName} </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserRoundPen className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [openCartSheet, setOpenCartSheet] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-1">
          <HousePlus className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>
        <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden rounded-full p-2 hover:bg-accent"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>

          {/* Mobile Menu */}
          <SheetContent
            side="left"
            className="w-full max-w-xs sm:max-w-sm p-6 space-y-6 bg-background h-full overflow-y-auto"
          >
            {/* Brand */}
            <Link to="/shop/home" className="flex items-center gap-2">
              <HousePlus className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Ecommerce</span>
            </Link>

            {/* Navigation Items */}
            <MenuItems closeMenu={()=>setOpenCartSheet(false)} />

            {/* User + Cart */}
            <div className="pt-6 border-t space-y-4">
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className=" hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
