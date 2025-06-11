import React, { forwardRef, useImperativeHandle } from "react";
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
import {
  CreditCardSchema,
  CreditCardSchemaType,
} from "@/zod-schema/credit-card.schema";
import { Input } from "../ui/input";

export type CreditCardFormHandle = {
  submit: () => Promise<CreditCardSchemaType | null>;
  getValues: () => CreditCardSchemaType;
};

const CreditCardForm = forwardRef<
  CreditCardFormHandle,
  { onCreditCardDetailsSubmit?: (data: CreditCardSchemaType) => void }
>(({ onCreditCardDetailsSubmit }, ref) => {
  const form = useForm<CreditCardSchemaType>({
    resolver: zodResolver(CreditCardSchema),
    defaultValues: {
      creditCardNumber: "",
      creditCardExpiry: "",
      creditCardCVV: "",
    },
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const result = await form.trigger();
      if (result) {
        return form.getValues();
      }
      return null;
    },
    getValues: () => form.getValues(),
  }));

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={
          onCreditCardDetailsSubmit
            ? form.handleSubmit(onCreditCardDetailsSubmit)
            : undefined
        }
      >
        <FormField
          control={form.control}
          name="creditCardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit Card Number</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="3782 8224 6310 005"
                  {...field}
                  className="input"
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
              <FormLabel>Expiry Date (MM/YY)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  {...field}
                  className="input"
                />
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
                <Input
                  type="text"
                  placeholder="123"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
});
CreditCardForm.displayName = "CreditCardForm";

export default CreditCardForm;
