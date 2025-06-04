"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ReservationForm = () => {
  const router = useRouter();
  const [addCard, setAddCard] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const form = useForm<ReservationSchemaType>({
    resolver: zodResolver(ReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      checkInDate: "",
      checkOutDate: "",
      occupants: 1,
      creditCardNumber: "",
      creditCardExpiry: "",
      creditCardCVV: "",
    },
  });

  const onSubmit = (values: ReservationSchemaType) => {
    toast.success("Reservation submitted successfully!");
    // You can handle API submission here
    // router.push('/confirmation');
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
                    <Input placeholder="Your Name" {...field} />
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
                    <Input placeholder="you@email.com" {...field} />
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
                  <FormControl>
                    <Input type="number" min={1} max={20} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2 pt-2">
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
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Notice</AlertDialogTitle>
                  <AlertDialogDescription>
                    If user didn't enter credit card details by 7 pm, the
                    reservation will cancel.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={() => setShowAlert(false)}
                    autoFocus
                  >
                    OK
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {addCard && (
              <div className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="creditCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          maxLength={16}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditCardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry (MM/YY)</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" maxLength={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditCardCVV"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="CVV" maxLength={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" className="w-full">
              Reserve
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default ReservationForm;
