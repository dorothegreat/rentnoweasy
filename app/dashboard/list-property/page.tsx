// app/dashboard/list-property/page.tsx

import PropertyForm from "@/components/forms/PropertyForm"

export default function ListPropertyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        List Your Property
      </h1>

      <PropertyForm />
    </div>
  )
}