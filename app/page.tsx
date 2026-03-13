"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import PageWrapper from "./components/PageWrapper";

interface Property {
  id: string;
  title: string;
  location: string;
  images?: string[];
  rent_amount: number;
  agent_fee: number;
  total_package: number;
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [locationSearch, setLocationSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("");

  // ✅ PUT THE FUNCTION HERE
  const fetchProperties = async () => {
    let query = supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (locationSearch) {
      query = query.ilike("location", `%${locationSearch}%`);
    }

    if (typeSearch) {
      query = query.eq("property_type", typeSearch);
    }

    if (minPrice) {
      query = query.gte("rent_amount", Number(minPrice));
    }

    if (maxPrice) {
      query = query.lte("rent_amount", Number(maxPrice));
    }

    if (bedroomFilter) {
      query = query.eq("bedrooms", Number(bedroomFilter));
    }

    const { data, error } = await query;

    if (!error && data) {
      setProperties(data);
    }
  };

  // load properties initially
  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <PageWrapper>
      <main>
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center text-white">

  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="/hero-house.jpg"
      alt="Rental homes"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="relative z-10 text-center max-w-3xl px-6">
    <h1 className="text-4xl md:text-5xl font-bold mb-6">
      Find rentals you’ll love
    </h1>

    <p className="text-lg opacity-90 mb-8">
      Apartments • Shops • Hostels — all in one place
    </p>

    {/* Search Bar */}
    <div className="mt-8 bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-4 max-w-5xl mx-auto">

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">

    {/* Location */}
    <input
      type="text"
      placeholder="Location"
      value={locationSearch}
      onChange={(e) => setLocationSearch(e.target.value)}
      className="px-4 py-3 text-black rounded-lg border focus:outline-none"
    />

    {/* Property Type */}
    <select
      value={typeSearch}
      onChange={(e) => setTypeSearch(e.target.value)}
      className="px-4 py-3 text-black rounded-lg border"
    >
      <option value="">Type</option>
      <option value="apartment">Apartment</option>
      <option value="duplex">Duplex</option>
      <option value="bungalow">Bungalow</option>
      <option value="self_contain">Self Contain</option>
      <option value="shop">Shop</option>
      <option value="office">Office</option>
    </select>

    {/* Min Price */}
    <input
      type="number"
      placeholder="Min Price"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
      className="px-4 py-3 text-black rounded-lg border"
    />

    {/* Max Price */}
    <input
      type="number"
      placeholder="Max Price"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
      className="px-4 py-3 text-black rounded-lg border"
    />

    {/* Bedrooms */}
    <select
      value={bedroomFilter}
      onChange={(e) => setBedroomFilter(e.target.value)}
      className="px-4 py-3 text-black rounded-lg border"
    >
      <option value="">Bedrooms</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4+</option>
    </select>

    {/* Search Button */}
    <button
      onClick={fetchProperties}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      Search
    </button>

  </div>
  </div>
</div>
</section>

        {/* Featured Listings */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-10">Featured Listings</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                {/* Property Images */}
<div className="relative p-2">
  <div className="grid grid-cols-3 gap-2">
    {property.images?.map((img, index) => (
      <img
        key={index}
        src={img}
        className="w-full h-24 object-cover rounded"
      />
    ))}
  </div>

  {/* Rent badge */}
  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow">
    ₦{property.rent_amount?.toLocaleString()}
  </div>
</div>

                {/* Property Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {property.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {property.location}
                  </p>

                  {/* Cost Breakdown */}
                  <p className="text-sm text-gray-500">
                    Agent Fee (10%): ₦
                    {property.agent_fee?.toLocaleString()}
                  </p>

                  <p className="font-semibold text-green-600">
                    Total Package: ₦
                    {property.total_package?.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}