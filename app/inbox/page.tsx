"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function InboxPage() {
  const [conversations, setConversations] =
    useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  const loadInbox = async () => {
    setLoading(true);

    const { data: userData } =
      await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `sender_id.eq.${userId},receiver_id.eq.${userId}`
      )
      .order("created_at", {
        ascending: false,
      });

    if (error || !data) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Group conversations + count unread
    const grouped = new Map();
    const unread = new Map();

    for (let msg of data) {
      if (!grouped.has(msg.property_id)) {
        grouped.set(msg.property_id, msg);
      }

      if (
        msg.receiver_id === userId &&
        msg.read === false
      ) {
        unread.set(
          msg.property_id,
          (unread.get(msg.property_id) || 0) + 1
        );
      }
    }

    const propertyIds = Array.from(
      grouped.keys()
    );

    if (propertyIds.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const { data: properties } =
      await supabase
        .from("properties")
        .select("*")
        .in("id", propertyIds);

    const result = propertyIds.map((id) => ({
      property: properties?.find(
        (p) => p.id === id
      ),
      lastMessage: grouped.get(id),
      unread: unread.get(id) || 0,
    }));

    setConversations(result);
    setLoading(false);
  };

  useEffect(() => {
    loadInbox();
  }, []);

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">
        Inbox 📬
      </h1>

      {conversations.length === 0 && (
        <p>No conversations yet.</p>
      )}

      <div className="space-y-4">
        {conversations.map((c, i) =>
          c.property ? (
            <Link
              key={i}
              href={`/chat/${c.property.id}`}
              className="border p-4 rounded block hover:bg-gray-100"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  {c.property.title}

                  {c.unread > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                      {c.unread}
                    </span>
                  )}
                </h2>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {c.lastMessage.message}
              </p>
            </Link>
          ) : null
        )}
      </div>
    </main>
  );
}
