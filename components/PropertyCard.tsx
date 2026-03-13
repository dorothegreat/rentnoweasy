import Link from "next/link";

export default function PropertyCard({ property }: any) {
  return (
    <Link href={`/property/${property.id}`}>
      <div className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer bg-white">

        {/* Image */}
        <div className="h-48 bg-gray-200">
          {property.image_url ? (
            <img
              src={property.image_url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h2 className="font-semibold text-lg">
            {property.title}
          </h2>

          <p className="text-gray-600">
            📍 {property.location}
          </p>

          <p className="font-bold text-blue-600">
            ₦{property.price}
          </p>
        </div>
      </div>
    </Link>
  );
}
