// "use client"; // Ensure this is at the top of the file

// import { useState, useEffect } from "react";
// import { useCurrencyContext } from "@/lib/context/currencyContext";
// import useCart from "@/lib/hooks/useCart";
// import { useSession } from "next-auth/react";
// import { MinusCircle, PlusCircle, Trash } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import Loader from "@/components/Loader";

// // Define types
// type UserSession = {
//   id: string | null;
//   email: string | null;
//   name: string | null;
// };

// const Cart = () => {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const cart = useCart();
//   const { selectedCurrency, convertPrice } = useCurrencyContext();
//   const [loading, setLoading] = useState(false);
//   const [customer, setCustomer] = useState<UserSession>({
//     id: null,
//     email: null,
//     name: null,
//   });

//   useEffect(() => {
//     if (session && session.user) {
//       setCustomer({
//         id: session.user.id ?? null,
//         email: session.user.email ?? null,
//         name: session.user.name ?? null,
//       });
//     }
//   }, [session]);

//   const parsePrice = (price: any): number => {
//     try {
//       const parsed = JSON.parse(price);
//       return parseFloat(parsed["$numberDecimal"]);
//     } catch {
//       return parseFloat(price);
//     }
//   };

//   // State to store the converted price
//   const [convertedPrice, setConvertedPrice] = useState<number | null>(null);

//   // Fetch the converted price when selectedCurrency or parsedPrice changes
//   useEffect(() => {
//     if (parsedPrice && selectedCurrency) {
//       conparsePrice = convertPrice(parsePrice, "EUR", selectedCurrency);
//       setConvertedPrice(newPrice);
//     }
//   }, [selectedCurrency, parsePrice, convertPrice]);

//   const total = cart.cartItems.reduce(
//     (acc, cartItem) =>
//       acc +
//       convertPrice(cartItem.item.parsePrice, "EUR", selectedCurrency) *
//         cartItem.quantity,
//     0
//   );
//   const totalRounded = parseFloat(total.toFixed(2));

//   // const delivery = "self";

//   const handleCheckout = async (paymentMethod: string) => {
//     try {
//       if (!customer.id) {
//         router.push("/sign-in");
//       } else {
//         setLoading(true);

//         const paymentEndpoint = {
//           stripe: "checkout",
//           paystack: "paystack",
//           paypal: "paypal",
//         }[paymentMethod];

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/${paymentEndpoint}`,
//           {
//             method: "POST",
//             body: JSON.stringify({
//               cartItems: cart.cartItems,
//               customer,
//             }),
//           }
//         );

//         if (!res.ok) {
//           throw new Error("Failed to initiate checkout");
//         }
//         const data = await res.json();
//         window.location.href = data.url;
//         console.log(data);
//       }
//     } catch (err) {
//       console.log("[checkout_POST]", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
//       <div className="w-2/3 max-lg:w-full">
//         <p className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-600 text-white py-4 px-8 rounded-lg shadow-lg  after:transform after:-translate-x-1/2">
//           Shopping Cart
//         </p>
//         <hr className="my-6" />

//         {cart.cartItems.length === 0 ? (
//           <p className="text-body-bold">No item in cart</p>
//         ) : (
//           <div>
//             {cart.cartItems.map((cartItem) => (
//               <div
//                 className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
//                 key={cartItem.item.id}
//               >
//                 <div className="flex items-center">
//                   <Image
//                     src={cartItem.item.media[0]}
//                     width={300}
//                     height={300}
//                     className="rounded-lg w-32 h-32 object-cover"
//                     alt="product"
//                   />
//                   <div className="flex flex-col gap-3 ml-4">
//                     <p className="text-body-bold">{cartItem.item.title}</p>
//                     {cartItem.color && (
//                       <p className="text-small-medium">{cartItem.color}</p>
//                     )}
//                     {cartItem.size && (
//                       <p className="text-small-medium">{cartItem.size}</p>
//                     )}
//                     <p className="text-small-medium">
//                       {selectedCurrency === "USD" && "$"}
//                       {selectedCurrency === "EUR" && "€"}
//                       {selectedCurrency === "CAD" && "CA$"}
//                       {selectedCurrency === "NGN" && "₦"}
//                       {selectedCurrency === "GBP" && "£"}{" "}
//                       {convertedPrice !== null
//                         ? convertedPrice.toFixed(2)
//                         : parsedPrice.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 items-center">
//                   <MinusCircle
//                     className="hover:text-red-1 cursor-pointer"
//                     onClick={() => cart.decreaseQuantity(cartItem.item.id)}
//                   />
//                   <p className="text-body-bold">{cartItem.quantity}</p>
//                   <PlusCircle
//                     className="hover:text-red-900 cursor-pointer"
//                     onClick={() => cart.increaseQuantity(cartItem.item.id)}
//                   />
//                 </div>

//                 <Trash
//                   className="hover:text-red-1 cursor-pointer"
//                   onClick={() => cart.removeItem(cartItem.item.id)}
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
//         <p className="text-heading4-bold pb-4">
//           Summary{" "}
//           <span>{`(${cart.cartItems.length} ${
//             cart.cartItems.length > 1 ? "items" : "item"
//           })`}</span>
//         </p>
//         <div className="flex justify-between text-body-semibold">
//           <span>Total Amount</span>
//           <span>
//             {selectedCurrency === "USD" && "$"}
//             {selectedCurrency === "EUR" && "€"}
//             {selectedCurrency === "CAD" && "CA$"}
//             {selectedCurrency === "NGN" && "₦"}
//             {selectedCurrency === "GBP" && "£"}
//             {totalRounded.toFixed(2)}
//           </span>
//         </div>
//         <p>Checkout with</p>
//         <button
//           className="border rounded-lg text-body-bold bg-amber-900 py-3 w-full hover:bg-amber-700 hover:text-green-500"
//           onClick={() => handleCheckout("stripe")}
//         >
//           Stripe(€)
//         </button>
//         <button
//           className="border rounded-lg text-body-bold bg-amber-900 py-3 w-full hover:bg-amber-700 hover:text-blue-500"
//           onClick={() => handleCheckout("paystack")}
//         >
//           Paystack(₦)
//         </button>
//         <button
//           className="border rounded-lg text-body-bold  bg-amber-900 py-3 w-full hover:bg-amber-700 hover:text-blue-900"
//           // onClick={() => handleCheckout("paypal")}
//         >
//           PayPal(€) Soon...
//         </button>
//       </div>
//     </div>
//   );
// };

// export const dynamic = "force-dynamic";

// export default Cart;

"use client"; // Ensure this is at the top of the file

import { useState, useEffect } from "react";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import useCart from "@/lib/hooks/useCart";
import { useSession } from "next-auth/react";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

// Define types
type UserSession = {
  id: string | null;
  email: string | null;
  name: string | null;
};

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string;
  size?: string;
}

const Cart = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useCart();
  const { selectedCurrency, convertPrice } = useCurrencyContext();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<UserSession>({
    id: null,
    email: null,
    name: null,
  });

  // Set customer info based on session
  useEffect(() => {
    if (session && session.user) {
      setCustomer({
        id: session.user.id ?? null,
        email: session.user.email ?? null,
        name: session.user.name ?? null,
      });
    }
  }, [session]);

  const total = cart.cartItems.reduce(
    (acc, cartItem) =>
      acc +
      convertPrice(cartItem.item.price, "EUR", selectedCurrency) *
        cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const handleCheckout = async (paymentMethod: string) => {
    try {
      if (!customer.id) {
        router.push("/sign-in");
        return;
      }
      setLoading(true);

      const paymentEndpoint = {
        stripe: "checkout",
        paystack: "paystack",
        paypal: "paypal",
      }[paymentMethod];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${paymentEndpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems: cart.cartItems,
            customer,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to initiate checkout");
      }
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("[checkout_POST]", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-600 text-white py-4 px-8 rounded-lg shadow-lg  after:transform after:-translate-x-1/2">
          Shopping Cart
        </p>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No item in cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem) => (
              <div
                className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
                key={cartItem.item.id}
              >
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.media[0]}
                    width={300}
                    height={300}
                    className="rounded-lg w-32 h-32 object-cover"
                    alt="product"
                  />
                  <div className="flex flex-col gap-3 ml-4">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )}
                    <p className="text-small-medium">
                      {selectedCurrency === "USD" && "$"}
                      {selectedCurrency === "EUR" && "€"}
                      {selectedCurrency === "CAD" && "CA$"}
                      {selectedCurrency === "NGN" && "₦"}
                      {selectedCurrency === "GBP" && "£"}{" "}
                      {convertPrice(
                        cartItem.item.price,
                        "USD",
                        selectedCurrency
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <MinusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.decreaseQuantity(cartItem.item.id)}
                  />
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <PlusCircle
                    className="hover:text-red-900 cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item.id)}
                  />
                </div>

                <Trash
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? "items" : "item"
          })`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>
            {selectedCurrency === "USD" && "$"}
            {selectedCurrency === "EUR" && "€"}
            {selectedCurrency === "CAD" && "CA$"}
            {selectedCurrency === "NGN" && "₦"}
            {selectedCurrency === "GBP" && "£"}
            {totalRounded.toFixed(2)}
          </span>
        </div>
        <p>Checkout with</p>
        <button
          className="border rounded-lg text-body-bold bg-amber-900 py-3 w-full hover:bg-amber-700 hover:text-green-500"
          onClick={() => handleCheckout("stripe")}
        >
          Stripe(€)
        </button>
        <button
          className="border rounded-lg text-body-bold bg-amber-900 py-3 w-full hover:bg-amber-700 hover:text-blue-500"
          onClick={() => handleCheckout("paystack")}
        >
          Paystack(₦)
        </button>
        <button
          className="border rounded-lg text-body-bold  bg-amber-900 py-3 w-full hover:bg-amber-700 hover:text-blue-900"
          // onClick={() => handleCheckout("paypal")}
        >
          PayPal(€) Soon...
        </button>
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Cart;
