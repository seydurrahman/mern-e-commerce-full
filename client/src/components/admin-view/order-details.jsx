import React, { useState, useEffect } from "react";
import { DialogContent, DialogClose } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {Button} from "../ui/button";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";

const initialFormData = { status: "" };

function AdminOrderDetailsView({ orderDetails, addressInfo, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  const address = orderDetails?.addressInfo || addressInfo || {};
  const { user } = useSelector((state) => state.auth);

  // Update local formData when orderDetails changes
  useEffect(() => {
    setFormData({ status: orderDetails?.orderStatus || "" });
  }, [orderDetails]);

  const handleUpdateStatus = (event) => {
    event.preventDefault();
    const { status } = formData;

    if (!status) return toast.error("Select a status first");

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        toast.success("Order updated successfully");
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        {/* Header Info */}
        <div className="grid gap-2">
          <div className="flex justify-between items-center mt-6">
            <p className="font-medium">Order Id</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-medium">Price</p>
            <Label>${Number(orderDetails?.totalAmount || 0).toFixed(2)}</Label>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator />

        {/* Cart Items */}
        <div className="grid gap-2">
          <div className="font-medium">Order Details</div>
          <ul className="grid gap-3">
            {orderDetails?.cartItems?.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between items-center"
              >
                <span>Name: {item.title}</span>
                <span>Qty: {item.quantity}</span>
                <span>Price: ${item.price}</span>
                <span>Total: ${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Shipping Info */}
        <div className="grid gap-2">
          <div className="font-medium">Shipping Info</div>
          <div className="grid gap-0.5 text-muted-foreground">
            <span>{orderDetails?.user?.userName || user?.userName || "Customer"}</span>
            <span>{address?.address || "—"}</span>
            <span>{address?.city || "—"}</span>
            <span>{address?.pincode || "—"}</span>
            <span>{address?.phone || "—"}</span>
            {address?.notes && <span>{address.notes}</span>}
          </div>
        </div>

        <Separator />

        {/* Update Form & Close Button */}
        <div className="flex justify-between items-center gap-2 mt-4">
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText="Update Status"
            onSubmit={handleUpdateStatus}
          />
          <DialogClose>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
