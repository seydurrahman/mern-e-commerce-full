import Address from "@/components/shopping-view/address";
import Imag from "../../assets/account_img.jpg";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder || {});
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // default COD

  const dispatch = useDispatch();

  const totalCartAmount =
    cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              item?.quantity,
          0
        )
      : 0;

  // ✅ Create order payload
  const getOrderData = () => ({
    userId: user?.id,
    cartId: cartItems?._id,
    cartItems: cartItems.items.map((item) => ({
      productId: item?.productId,
      title: item?.title,
      image: item?.image,
      price: item?.salePrice > 0 ? item?.salePrice : item?.price,
      quantity: item?.quantity,
    })),
    addressInfo: {
      addressId: currentSelectedAddress?._id,
      address: currentSelectedAddress?.address,
      city: currentSelectedAddress?.city,
      pincode: currentSelectedAddress?.pincode,
      phone: currentSelectedAddress?.phone,
      notes: currentSelectedAddress?.notes,
    },
    orderStatus: "confirmed",
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "pending" : "initiated",
    totalAmount: totalCartAmount,
    orderDate: new Date(),
    orderUpdateDate: new Date(),
    paymentId: "",
    payerId: "",
  });

  const handleCashOnDelivery = () => {
    if (!validateBeforeOrder()) return;

    const orderData = {
      ...getOrderData(),
      orderStatus: "confirmed", // directly confirmed
      paymentMethod: "COD",
      paymentStatus: "pending",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        toast.success("Your order is confirmed with Cash on Delivery 🎉");
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    });
  };

  // ✅ Paypal Flow
  const handleInitiatePaypalPayment = () => {
    if (!validateBeforeOrder()) return;
    dispatch(createNewOrder(getOrderData())).then((data) => {
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  };

  // ✅ Validation (cart + address check)
  const validateBeforeOrder = () => {
    if (cartItems?.items?.length === 0) {
      toast.error("Please add at least one item to proceed");
      return false;
    }
    if (!currentSelectedAddress) {
      toast.error("Please select one address to proceed");
      return false;
    }
    return true;
  };

  // ✅ Redirect if Paypal URL comes
  useEffect(() => {
    if (paymentMethod === "paypal" && approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL, paymentMethod]);

  return (
    <div className="flex flex-col w-full">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={Imag}
          alt="checkout-banner"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />

        <div className="flex flex-col gap-4">
          {cartItems?.items?.length > 0 &&
            cartItems.items.map((item) => (
              <UserCartItemContent key={item.productId} cartItem={item} />
            ))}

          {/* Total Amount */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>

          {/* Payment Options */}
          <div className="mt-6 flex gap-3">
            <Button
              variant={paymentMethod === "COD" ? "default" : "outline"}
              onClick={() => setPaymentMethod("COD")}
              className="flex-1 border-2 border-green-600"
            >
              Cash on Delivery
            </Button>
            <Button
              variant={paymentMethod === "paypal" ? "default" : "outline"}
              onClick={() => setPaymentMethod("paypal")}
              className="flex-1 border-2 border-green-600"
            >
              Online Payment
            </Button>
          </div>

          {/* Payment Action */}
          <div className="mt-4 w-full">
            {paymentMethod === "COD" ? (
              <Button onClick={handleCashOnDelivery} className="w-full">
                Confirm Order
              </Button>
            ) : (
              <Button
                onClick={handleInitiatePaypalPayment}
                className="w-full"
                disabled={isPaymentStart}
              >
                {isPaymentStart
                  ? "Redirecting to PayPal..."
                  : "Pay with PayPal"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
