"use client";

import React, { useState } from "react";
import CustomModal from "@/app/utils/CustomModal";
import { toast } from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type InviteResponse = {
  success?: boolean;
  message?: string;
};

const ReferFriendModal: React.FC<Props> = ({ open, setOpen }) => {
  const [email, setEmail] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onClose = () => {
    if (loading) return;
    setOpen(false);
    setEmail("");
    setNote("");
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your friend's email");
      return;
    }

    try {
      setLoading(true);
      const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${base}/user/refer-friend`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, note }),
      });

      const data: InviteResponse = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send invite");

      toast.success("Invitation sent! 🎉");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send invite";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal open={open} setOpen={onClose}>
      <h3 id="modal-title" className="text-xl font-semibold mb-3">
        🤝 Refer a Friend
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Invite your friend to join Pi-Academy. We’ll email them your message and a
        joining link.
      </p>

      <form onSubmit={handleSend} className="space-y-3">
        <input
          type="email"
          placeholder="Friend's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <textarea
          placeholder="Add a short note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Sending..." : "Send Invitation"}
        </button>
      </form>
    </CustomModal>
  );
};

export default ReferFriendModal;
