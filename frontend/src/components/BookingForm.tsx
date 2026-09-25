"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingEnquirySchema, BookingEnquiryInput } from "@/lib/validation";
import { vehicles as fallbackVehicles } from "@/data/vehicles";
import type { Vehicle } from "@/types/vehicle";
import { trackEvent } from "@/lib/analytics";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface BookingFormProps {
  defaultVehicle?: string;
  defaultMessage?: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function BookingForm({
  defaultVehicle,
  defaultMessage,
}: BookingFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>(fallbackVehicles);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/vehicles")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.vehicles?.length) {
          setVehicles(data.vehicles);
        }
      })
      .catch(() => {
        // Keep the fallback list — the form still works, it just may be
        // slightly out of date until the network request succeeds.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingEnquiryInput>({
    resolver: zodResolver(bookingEnquirySchema),
    defaultValues: {
      vehicleType: defaultVehicle || "",
      message: defaultMessage || "",
    },
  });

  const onSubmit = async (data: BookingEnquiryInput) => {
    setState("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/booking-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      trackEvent("booking_form_submit", { vehicle: data.vehicleType });
      setState("success");
      reset();
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "We couldn't send your enquiry. Please try again or contact us on WhatsApp."
      );
    }
  };

  if (state === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-xl2 bg-palm-50 p-8 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-palm-600" aria-hidden="true" />
        <h3 className="text-xl font-bold text-ink-900">Enquiry sent successfully</h3>
        <p className="max-w-md text-sm text-ink-700">
          Thank you for contacting Methmi Enterprises. Our team will get back to
          you as soon as possible. For a faster response, you can also message
          us directly on WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-2 rounded-full border-2 border-ocean-600 px-5 py-2.5 text-sm font-semibold text-ocean-700 hover:bg-ocean-50"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-xl2 bg-white p-6 shadow-soft sm:p-8"
    >
      {state === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Full Name"
          htmlFor="fullName"
          error={errors.fullName?.message}
          required
        >
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className={inputClass(!!errors.fullName)}
            {...register("fullName")}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email?.message} required>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
        </Field>

        <Field
          label="WhatsApp Number"
          htmlFor="whatsappNumber"
          error={errors.whatsappNumber?.message}
          required
        >
          <input
            id="whatsappNumber"
            type="tel"
            placeholder="e.g. +94 77 123 4567"
            autoComplete="tel"
            className={inputClass(!!errors.whatsappNumber)}
            {...register("whatsappNumber")}
          />
        </Field>

        <Field label="Country" htmlFor="country" error={errors.country?.message} required>
          <input
            id="country"
            type="text"
            autoComplete="country-name"
            className={inputClass(!!errors.country)}
            {...register("country")}
          />
        </Field>

        <Field
          label="Flight Number"
          htmlFor="flightNumber"
          error={errors.flightNumber?.message}
        >
          <input
            id="flightNumber"
            type="text"
            placeholder="e.g. UL 504"
            className={inputClass(!!errors.flightNumber)}
            {...register("flightNumber")}
          />
        </Field>

        <Field
          label="Vehicle Type"
          htmlFor="vehicleType"
          error={errors.vehicleType?.message}
          required
        >
          <select
            id="vehicleType"
            className={inputClass(!!errors.vehicleType)}
            {...register("vehicleType")}
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((v) => (
              <option key={v.slug} value={v.name}>
                {v.name}
              </option>
            ))}
            <option value="Not sure / Please advise">Not sure / Please advise</option>
          </select>
        </Field>

        <Field
          label="Arrival Date"
          htmlFor="arrivalDate"
          error={errors.arrivalDate?.message}
          required
        >
          <input
            id="arrivalDate"
            type="date"
            className={inputClass(!!errors.arrivalDate)}
            {...register("arrivalDate")}
          />
        </Field>

        <Field
          label="Arrival Time"
          htmlFor="arrivalTime"
          error={errors.arrivalTime?.message}
          required
        >
          <input
            id="arrivalTime"
            type="time"
            className={inputClass(!!errors.arrivalTime)}
            {...register("arrivalTime")}
          />
        </Field>

        <Field
          label="Pickup Location"
          htmlFor="pickupLocation"
          error={errors.pickupLocation?.message}
          required
        >
          <input
            id="pickupLocation"
            type="text"
            placeholder="e.g. Bandaranaike International Airport"
            className={inputClass(!!errors.pickupLocation)}
            {...register("pickupLocation")}
          />
        </Field>

        <Field
          label="Drop Location"
          htmlFor="dropLocation"
          error={errors.dropLocation?.message}
          required
        >
          <input
            id="dropLocation"
            type="text"
            placeholder="e.g. Hotel name, Galle"
            className={inputClass(!!errors.dropLocation)}
            {...register("dropLocation")}
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <textarea
          id="message"
          rows={4}
          placeholder="Tell us anything else we should know (number of passengers, luggage, special requests)"
          className={inputClass(!!errors.message)}
          {...register("message")}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting || state === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ocean-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-ocean-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {(isSubmitting || state === "loading") && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {isSubmitting || state === "loading" ? "Sending enquiry..." : "Send Booking Enquiry"}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 shadow-sm transition-colors",
    "focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-200",
    hasError ? "border-red-400" : "border-ink-700/15",
  ].join(" ");
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, required, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink-800">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
