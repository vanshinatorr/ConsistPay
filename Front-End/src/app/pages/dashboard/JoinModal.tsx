import React from "react";
import { Link } from "react-router-dom";

interface JoinModalProps {
  showJoinModal: boolean;
  setShowJoinModal: (show: boolean) => void;
  joinCode: string;
  setJoinCode: (code: string) => void;
}

export function JoinModal({ showJoinModal, setShowJoinModal, joinCode, setJoinCode }: JoinModalProps) {
  if (!showJoinModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowJoinModal(false)} />
      <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-bold mb-2">Join a Challenge</h2>
        <p className="text-zinc-400 text-sm mb-6">Enter the invite code shared by your friend</p>
        <div className="mb-4">
          <label className="block text-sm text-zinc-400 mb-2">Invite Code</label>
          <input
            type="text"
            placeholder="e.g. CP-X7K2M"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 font-mono tracking-widest text-center text-lg uppercase"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowJoinModal(false)} className="flex-1 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm">Cancel</button>
          <Link to={`/join-challenge/${joinCode}`} className={`flex-1 py-3 rounded-xl font-semibold transition-all text-sm text-center ${joinCode.length >= 5 ? "bg-gradient-to-r from-violet-500 to-purple-600" : "bg-white/5 text-zinc-600 pointer-events-none"}`}>
            Join Challenge
          </Link>
        </div>
      </div>
    </div>
  );
}
