import Link from "next/link";

export default function PropertyCard({ property }: any) {
  return (
    <Link href={`/property/${property.id}`}>
      <div className="border border-slate-700 rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer bg-slate-800">

        {/* Image */}
        <div className="h-48 bg-slate-700">
          {property.image_url ? (
            <img
              src={property.image_url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No Image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h2 className="font-semibold text-lg text-slate-100">
            {property.title}
          </h2>

          <p className="text-slate-400">
            📍 {property.location}
          </p>

          <p className="font-bold text-green-400">
            ₦{property.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

