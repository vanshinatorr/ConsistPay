import { useState, useEffect } from "react";
import { X, RefreshCw, Check } from "lucide-react";

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSave: (avatarUrl: string) => void;
}

const DICEBEAR_STYLES = [
  "adventurer",
  "bottts",
  "micah",
  "notionists",
  "pixel-art",
  "lorelei",
  "fun-emoji"
];

export function AvatarSelectorModal({ isOpen, onClose, currentAvatar, onSave }: AvatarSelectorModalProps) {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>(currentAvatar);
  const [loading, setLoading] = useState(false);

  const generateAvatars = () => {
    const newAvatars = [];
    for (let i = 0; i < 6; i++) {
      const style = DICEBEAR_STYLES[Math.floor(Math.random() * DICEBEAR_STYLES.length)];
      const seed = Math.random().toString(36).substring(2, 8);
      // Generate a clean URL without extra background params for a transparent look
      newAvatars.push(`https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=transparent`);
    }
    setAvatars(newAvatars);
  };

  useEffect(() => {
    if (isOpen && avatars.length === 0) {
      generateAvatars();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (selected === currentAvatar) {
      onClose();
      return;
    }
    setLoading(true);
    await onSave(selected);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#0A0A0C] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-2">Choose Your Avatar</h2>
        <p className="text-zinc-400 text-sm mb-6">Select a cool GenZ identity for your battles.</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {avatars.map((url, idx) => (
            <div
              key={idx}
              onClick={() => setSelected(url)}
              className={`relative cursor-pointer rounded-2xl aspect-square overflow-hidden border-2 transition-all duration-200 ${
                selected === url ? "border-violet-500 scale-105 shadow-lg shadow-violet-500/20" : "border-white/5 hover:border-white/20 bg-white/5"
              }`}
            >
              <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover p-2" />
              {selected === url && (
                <div className="absolute top-1 right-1 bg-violet-500 rounded-full p-1 shadow-md">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateAvatars}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-300"
          >
            <RefreshCw className="w-4 h-4" />
            Shuffle
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 transition-colors text-white disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Save Avatar"}
          </button>
        </div>
      </div>
    </div>
  );
}
