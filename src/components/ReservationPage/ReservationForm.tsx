"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ReservationSchema,
  ReservationSchemaType,
} from "@/zod-schema/reservation.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { MoveUp } from "lucide-react";
import CreditCardForm, {
  CreditCardFormHandle,
} from "@/components/ReservationPage/CreditCardForm";
import ReservationAlert from "../modals/ReservationAlert";

const ReservationForm = () => {
  const router = useRouter();
  const [addCard, setAddCard] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const session = useSession();
  const creditCardFormRef = useRef<CreditCardFormHandle>(null);

  const form = useForm<ReservationSchemaType>({
    resolver: (data, context, options) =>
      zodResolver(ReservationSchema)(data, { ...context, addCard }, options),
    defaultValues: {
      name: session.data?.user.name || "",
      email: session.data?.user.email || "",
      phone: "",
      checkInDate: "",
      checkOutDate: "",
      occupants: 1,
    },
  });

  const onSubmit = (values: ReservationSchemaType) => {
    toast.success("Reservation submitted successfully!");
    console.log("Reservation Details:", values);
  };

  const handleReservationSubmit = async () => {
    const reservationValid = await form.trigger();
    if (!reservationValid) return;
    const reservationData = form.getValues();
    if (addCard) {
      if (creditCardFormRef.current) {
        const creditCardData = await creditCardFormRef.current.submit();
        if (!creditCardData) return; // Credit card form invalid
        console.log("reserved with credit card", {
          ...reservationData,
          ...creditCardData,
        });
      }
    } else {
      console.log("reserved without credit card", {
        ...reservationData,
        creditCardNumber: "",
        creditCardExpiry: "",
        creditCardCVV: "",
      });
    }
  };

  return (
    <Card className="max-w-md w-full mt-8">
      <CardHeader>
        <CardTitle>Hotel Reservation</CardTitle>
        <CardDescription>
          Fill in your details to reserve a room.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@email.com" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-in Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkOutDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check-out Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                      variant={"outline"}
                      size={"icon"}
                      onClick={() =>
                        field.onChange(Math.max(1, (field.value || 1) - 1))
                      }
                      aria-label="Decrease guests"
                    >
                      <MoveUp className="rotate-180" />
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        className="no-spinner text-center w-16"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      size={"icon"}
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                      onClick={() =>
                        field.onChange(Math.min(20, (field.value || 1) + 1))
                      }
                      aria-label="Increase guests"
                    >
                      <MoveUp className="" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </form>
      </Form>
      <div className="flex items-center gap-2 px-5 pt-2">
        <Checkbox
          id="addCard"
          checked={addCard}
          onCheckedChange={(val) => {
            if (val === false) setShowAlert(true);
            setAddCard(val === true);
          }}
        />
        <label
          htmlFor="addCard"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Add credit card details
        </label>
      </div>
      {addCard && (
        <div className="px-5 pb-5">
          <CreditCardForm ref={creditCardFormRef} />
        </div>
      )}

      <div className="px-5">
        <Button className="w-full" onClick={handleReservationSubmit}>
          Reserve
        </Button>
      </div>

      <ReservationAlert showAlert={showAlert} setShowAlert={setShowAlert} />
    </Card>
  );
};

export default ReservationForm;
