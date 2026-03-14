"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  propertySchema,
  PropertyFormValues,
} from "@/lib/schemas/propertySchema"
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const steps = [
  "Basic Info",
  "Pricing",
  "Property Details",
  "Media & Description",
  "Landlord Info",
]
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PropertyForm() {
  const [currentStep, setCurrentStep] = useState(0)

  const router = useRouter();
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    mode: "onTouched",
  })
  const watchAll = watch();

const liveAgentFee = (watchAll.rentAmount || 0) * 0.1;
const liveTotal =
  watchAll.rentAmount +
  (watchAll.serviceCharge || 0) +
  (watchAll.cautionFee || 0) +
  (watchAll.legalFee || 0) +
  liveAgentFee;

  const nextStep = async () => {
  let fieldsToValidate: (keyof PropertyFormValues)[] = []

  if (currentStep === 0) {
    fieldsToValidate = ["title", "propertyType", "address"]
  }

  if (currentStep === 1) {
    fieldsToValidate = ["rentAmount", "rentDuration"]
  }

  if (currentStep === 2) {
    fieldsToValidate = ["bedrooms", "bathrooms", "description"]
  }

  if (currentStep === 3) {
    fieldsToValidate = []
  }

  if (currentStep === 4) {
    fieldsToValidate = ["fullName", "email", "phone"]
  }

  const valid = await trigger(fieldsToValidate)

  if (!valid) return

  setCurrentStep((prev) => prev + 1)
}

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const onSubmit = async (data: PropertyFormValues) => {
  try {
const agentFee = data.rentAmount * 0.1;

const totalPackage =
  data.rentAmount +
  (data.serviceCharge || 0) +
  (data.cautionFee || 0) +
  (data.legalFee || 0) +
  agentFee;

    let imageUrl = null;

    // ✅ Upload images first
    const formPayload = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key !== "images") {   // ✅ changed from "image"
      formPayload.append(key, value as any);
    }
  });

  // ✅ handle multiple images
  if (data.images && data.images.length > 0) {
    Array.from(data.images).forEach((file: any) => {
  formPayload.append("images", file);
});
  }

    // ✅ Send data to backend WITH images
    const res = await fetch("/api/properties", {
  method: "POST",
  body: formPayload,
});

router.push("/");

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Failed to save property");
    }

    alert("Property submitted successfully!");
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div className="space-y-6">

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full transition-all"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      <p className="text-sm text-gray-500">
        Step {currentStep + 1} of {steps.length} — {steps[currentStep]}
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* ---------------- STEP 1 ---------------- */}
        {currentStep === 0 && (
          <div className="space-y-4">

            <div>
              <label>Property Title</label>
              <input
                {...register("title")}
                className="border p-2 w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label>Property Type</label>
              <select {...register("propertyType")} className="border p-2 w-full">
                <option value="">Select</option>
                <option value="apartment">Apartment</option>
                <option value="duplex">Duplex</option>
                <option value="bungalow">Bungalow</option>
                <option value="self_contain">Self Contain</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
              </select>
            </div>

            <div>
              <label>Address</label>
              <input
                {...register("address")}
                className="border p-2 w-full"
              />
            </div>

          </div>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {currentStep === 1 && (
          <div className="space-y-4">

            <div>
              <label>Rent Amount (₦)</label>
              <input
                type="number"
                {...register("rentAmount", { valueAsNumber: true })}
                className="border p-2 w-full"
              />
              {errors.rentAmount && (
                <p className="text-red-500 text-sm">
                  {errors.rentAmount.message}
                </p>
              )}
            </div>

            <div>
  <label>Service Charge (Optional)</label>
  <input
    type="number"
    {...register("serviceCharge", { valueAsNumber: true })}
    className="border p-2 w-full"
  />
</div>

<div>
  <label>Caution Fee (Optional)</label>
  <input
    type="number"
    {...register("cautionFee", { valueAsNumber: true })}
    className="border p-2 w-full"
  />
</div>

<div>
  <label>Legal Fee (Optional)</label>
  <input
    type="number"
    {...register("legalFee", { valueAsNumber: true })}
    className="border p-2 w-full"
  />
</div>

<div className="mt-3 p-3 bg-gray-50 rounded">
  <p className="text-sm text-gray-600">Agent Fee (10%)</p>
  <p className="font-semibold text-gray-900">
    ₦{liveAgentFee.toLocaleString()}
  </p>
  <p className="text-xs text-gray-400">
    This is automatically calculated and cannot be edited.
  </p>
</div>

            <div>
              <label>Rent Duration</label>
              <select {...register("rentDuration")} className="border p-2 w-full">
                <option value="">Select</option>
                <option value="1_year">1 Year</option>
                <option value="6_months">6 Months</option>
                <option value="shortlet">Shortlet</option>
              </select>
            </div>

          </div>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {currentStep === 2 && (
          <div className="space-y-4">

            <div>
              <label>Bedrooms</label>
              <input
                type="number"
                {...register("bedrooms", { valueAsNumber: true })}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Bathrooms</label>
              <input
                type="number"
                {...register("bathrooms", { valueAsNumber: true })}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                {...register("description")}
                className="border p-2 w-full"
              />
            </div>

          </div>
        )}

        {/* ---------------- STEP 4 ---------------- */}
        {currentStep === 3 && (
          <div className="space-y-4">

            <div>
              <label>Image URLs (comma separated for now)</label>
              <input
  type="file"
  accept="image/*"
  multiple
  {...register("images")}
  className="border p-2 w-full"
/>
            </div>

            <div>
              <label>Video URL (optional)</label>
              <input
                {...register("videoUrl")}
                className="border p-2 w-full"
              />
            </div>

          </div>
        )}

        {/* ---------------- STEP 5 ---------------- */}
        {currentStep === 4 && (
          <div className="space-y-4">

            <div>
              <label>Full Name</label>
              <input
                {...register("fullName")}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                {...register("email")}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                {...register("phone")}
                className="border p-2 w-full"
              />
            </div>

          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border rounded"
            >
              Back
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Submit Property
            </button>
          )}
        </div>

      </form>
    </div>
  )
}