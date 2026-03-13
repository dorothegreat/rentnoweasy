"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
  const { propertyId } = useParams();

  const [user, setUser] = useState<any>(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitial = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      setUser(userData.user);

      const { data: property } = await supabase
        .from("properties")
        .select("email")
        .eq("id", propertyId)
        .single();

      if (property?.email) {
        setReceiverEmail(property.email);
      }

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: true });

      setMessages(data || []);

      await supabase
        .from("messages")
        .update({ read: true })
        .eq("property_id", propertyId)
        .eq("receiver_id", userData.user.id);

      setLoading(false);
    };

    loadInitial();
  }, [propertyId]);

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `property_id=eq.${propertyId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId]);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;

    const { error } = await supabase.from("messages").insert({
      property_id: propertyId,
      sender_id: user.id,
      receiver_id: null,
      content: text,
    });

    if (!error && receiverEmail) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: receiverEmail,
          message: text,
        }),
      });
    }

    setText("");
  };

  if (loading) {
    return <p className="p-10">Loading chat...</p>;
  }

  return (
    <main className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Chat</h1>

      <div className="border p-4 h-[400px] overflow-y-auto space-y-2 rounded">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender_id === user.id
                ? "bg-blue-100 text-right"
                : "bg-gray-100"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="border p-2 flex-1 rounded"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </main>
  );
}
