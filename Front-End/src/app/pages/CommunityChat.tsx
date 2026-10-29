import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  MessageSquare, Send, Users, Sparkles, Key, 
  RefreshCw, AlertCircle, CheckCircle2, Hash, ArrowLeft, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { 
  NCEngine, 
  OpenChannel, 
  SendTextMessageParams, 
  MessageHandler, 
  ConnectionStatus 
} from "@nexconn/chat";

interface ChatMessage {
  id: string;
  senderUserId: string;
  senderName?: string;
  text: string;
  sentTime: number;
  isMe: boolean;
}

export function CommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");
  const [statusDetail, setStatusDetail] = useState("");
  const [channel, setChannel] = useState<OpenChannel | null>(null);

  // Read environment variables (Safe client-side config only, no secrets)
  const envAppKey = import.meta.env.VITE_NEXCONN_APP_KEY || "";
  const envUserToken = import.meta.env.VITE_NEXCONN_USER_TOKEN || "";

  // Dynamic session overrides if not in .env
  const [appKey, setAppKey] = useState(envAppKey);
  const [userToken, setUserToken] = useState(envUserToken);
  const [showConfigModal, setShowConfigModal] = useState(!envAppKey || !envUserToken);

  // Cached user info from ConsistPay authentication
  const cachedUser = (() => {
    try {
      const raw = localStorage.getItem("consistpay_user_data");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const currentUserId = cachedUser?._id || cachedUser?.username || "anonymous-coder";
  const currentUserName = cachedUser?.name || cachedUser?.username || "Developer";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to Nexconn Engine
  const connectNexconn = async (key: string, token: string) => {
    if (!key || !token) {
      setStatus("disconnected");
      setStatusDetail("Nexconn App Key and User Token are required.");
      setShowConfigModal(true);
      return;
    }

    try {
      setStatus("connecting");
      setStatusDetail("Initializing Nexconn Engine...");

      // 1. Initialize Engine (idempotent guard)
      if (!isInitializedRef.current) {
        NCEngine.initialize({
          appKey: key.trim(),
        });
        isInitializedRef.current = true;
      }

      // 2. Connect with User Token
      setStatusDetail("Authenticating session with Nexconn server...");
      const connectResult = await NCEngine.connect({ token: token.trim() });

      if (!connectResult.isOk) {
        const errMsg = connectResult.error?.message || "Failed to authenticate session token.";
        setStatus("error");
        setStatusDetail(`Connection error (Code: ${connectResult.code}): ${errMsg}`);
        toast.error("Nexconn authentication failed");
        return;
      }

      const connectedUserId = connectResult.data?.userId || currentUserId;

      // 3. Enter Community Open Channel
      setStatusDetail("Entering #general-dsa community channel...");
      const communityChannel = new OpenChannel("consistpay-community");
      const enterResult = await communityChannel.enterChannel({ messageCount: 30 });

      if (!enterResult.isOk) {
        setStatus("error");
        setStatusDetail(`Failed to enter community channel (Code: ${enterResult.code})`);
        return;
      }

      setChannel(communityChannel);
      setStatus("connected");
      setStatusDetail("Connected to live community chat");
      setShowConfigModal(false);
      toast.success("Joined ConsistPay Coding Community!");

      // 4. Fetch initial recent message history
      try {
        const query = OpenChannel.createOpenChannelMessagesQuery({
          channelId: "consistpay-community",
          pageSize: 30,
        });
        const queryResult = await query.loadNextPage();
        if (queryResult.isOk && queryResult.data?.data) {
          const history = queryResult.data.data.map((m: any) => ({
            id: m.messageId || `${m.sentTime}-${Math.random()}`,
            senderUserId: m.senderUserId || "unknown",
            senderName: m.content?.extra?.senderName || m.senderUserId || "Developer",
            text: m.content?.text || (typeof m.content === "string" ? m.content : "[Non-text message]"),
            sentTime: m.sentTime || Date.now(),
            isMe: m.senderUserId === connectedUserId,
          }));
          setMessages(history);
        }
      } catch (historyErr) {
        console.warn("[Nexconn] Could not load message history:", historyErr);
      }

      // 5. Register Real-Time Message Handler
      const handlerId = "consistpay-community-handler";
      NCEngine.removeMessageHandler(handlerId);

      const messageHandler = new MessageHandler({
        onMessageReceived(event) {
          if (event.messages && event.messages.length > 0) {
            const incoming: ChatMessage[] = event.messages
              .filter((m: any) => m.content && (m.content.text || typeof m.content === "string"))
              .map((m: any) => ({
                id: m.messageId || `${Date.now()}-${Math.random()}`,
                senderUserId: m.senderUserId || "peer",
                senderName: m.content?.extra?.senderName || m.senderUserId || "Developer",
                text: m.content?.text || m.content,
                sentTime: m.sentTime || Date.now(),
                isMe: m.senderUserId === connectedUserId,
              }));

            setMessages(prev => [...prev, ...incoming]);
          }
        },
      });

      NCEngine.addMessageHandler(handlerId, messageHandler);

    } catch (err: any) {
      console.error("[Nexconn Connection Exception]:", err);
      setStatus("error");
      setStatusDetail(err?.message || "Unexpected exception during Nexconn initialization.");
      toast.error(err?.message || "Nexconn connection failed");
    }
  };

  useEffect(() => {
    document.title = "Coding Community | ConsistPay";
    if (appKey && userToken) {
      connectNexconn(appKey, userToken);
    } else {
      setStatus("disconnected");
      setStatusDetail("Nexconn App Key or User Token is missing.");
    }

    return () => {
      try {
        NCEngine.removeMessageHandler("consistpay-community-handler");
        if (channel) {
          channel.exitChannel().catch(() => {});
        }
      } catch {
        // Safe cleanup
      }
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !channel || status !== "connected") return;

    setIsSending(true);
    try {
      const sendParams = new SendTextMessageParams({
        text,
        extra: JSON.stringify({ senderName: currentUserName }),
      });

      const res = await channel.sendMessage(sendParams);

      if (res.isOk) {
        const sentMessage = res.data;
        setMessages(prev => [
          ...prev,
          {
            id: sentMessage?.messageId || `${Date.now()}-${Math.random()}`,
            senderUserId: currentUserId,
            senderName: currentUserName,
            text,
            sentTime: Date.now(),
            isMe: true,
          },
        ]);
        setInputText("");
      } else {
        toast.error(`Message failed to send (Code: ${res.code})`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-zinc-50 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <div className="border-b border-zinc-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#0F0F13]/80 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 -ml-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors md:hidden"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
                general-dsa
              </h1>
              <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                Community
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <span>Real-time peer discussions powered by Nexconn Chat</span>
            </p>
          </div>
        </div>

        {/* Status & Config Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "connected"
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  : status === "connecting"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span className="text-zinc-600 dark:text-zinc-300 font-medium capitalize hidden sm:inline">
              {status}
            </span>
          </div>

          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] hover:border-violet-500/50 bg-white dark:bg-white/[0.02] hover:bg-violet-50 dark:hover:bg-violet-500/[0.06] text-xs text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            title="Nexconn Setup"
          >
            <Key className="w-3.5 h-3.5 text-violet-500" />
            <span className="hidden sm:inline">Nexconn Keys</span>
          </button>
        </div>
      </div>

      {/* Main Chat Flow */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          {/* Welcome Banner */}
          <div className="max-w-xl mx-auto my-4 p-4 rounded-2xl bg-gradient-to-b from-violet-500/5 to-transparent border border-violet-500/10 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Welcome to the ConsistPay Coding Community
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              Discuss daily DSA problem approaches, share streak wins, and coordinate peer battles in real time.
            </p>
          </div>

          {/* Configuration Alert if disconnected */}
          {status !== "connected" && (
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="font-semibold text-amber-800 dark:text-amber-100">
                  {status === "connecting" ? "Connecting to Nexconn Server" : "Nexconn Chat Configuration"}
                </div>
                <p className="text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
                  {statusDetail}
                </p>
                {status !== "connecting" && (
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300 underline cursor-pointer pt-1"
                  >
                    Open Setup Dialog &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Render Messages */}
          {messages.map((m) => {
            const timeStr = new Date(m.sentTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div
                key={m.id}
                className={`flex flex-col ${m.isMe ? "items-end" : "items-start"} max-w-2xl ${
                  m.isMe ? "ml-auto" : "mr-auto"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 px-1 mb-1">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {m.isMe ? "You" : m.senderName}
                  </span>
                  <span>•</span>
                  <span>{timeStr}</span>
                </div>

                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85vw] sm:max-w-md break-words ${
                    m.isMe
                      ? "bg-violet-600 text-white rounded-br-xs shadow-sm shadow-violet-500/20"
                      : "bg-white dark:bg-[#16161F] text-zinc-800 dark:text-zinc-150 border border-zinc-200/80 dark:border-white/[0.06] rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-zinc-200/80 dark:border-white/[0.06] bg-white/70 dark:bg-[#0F0F13]/80 backdrop-blur-md p-3 sm:p-4">
          <form
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                status === "connected"
                  ? "Type your message in #general-dsa..."
                  : "Connect to Nexconn to send messages..."
              }
              disabled={status !== "connected" || isSending}
              className="flex-1 bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/80 dark:focus:border-violet-500/80 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status !== "connected" || !inputText.trim() || isSending}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-violet-500/20"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Nexconn Setup / Key Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#121217] border border-zinc-200 dark:border-white/[0.08] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Nexconn Chat Configuration
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Client configuration for live community chat
                </p>
              </div>
            </div>

            <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-3 bg-zinc-50 dark:bg-white/[0.02] p-3.5 rounded-xl border border-zinc-200/60 dark:border-white/[0.04]">
              <p>
                To enable live WebSocket messaging, configure your client credentials below or declare them in <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 text-violet-600 dark:text-violet-400 font-mono">Front-End/.env</code>:
              </p>
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-white dark:bg-black/30 p-2.5 rounded-lg border border-zinc-200/60 dark:border-white/[0.04]">
                <div>VITE_NEXCONN_APP_KEY=your_app_key</div>
                <div>VITE_NEXCONN_USER_TOKEN=your_user_token</div>
              </div>
              <p className="text-[11px] text-zinc-400 italic">
                * Note: In production, user tokens are generated on your backend using the App Secret via the Nexconn Server API, keeping secrets safe.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                  Nexconn App Key
                </label>
                <input
                  type="text"
                  value={appKey}
                  onChange={(e) => setAppKey(e.target.value)}
                  placeholder="e.g. nexconn_app_key_..."
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                  User Connection Token
                </label>
                <input
                  type="password"
                  value={userToken}
                  onChange={(e) => setUserToken(e.target.value)}
                  placeholder="e.g. user_session_token_..."
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => connectNexconn(appKey, userToken)}
                disabled={!appKey || !userToken || status === "connecting"}
                className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {status === "connecting" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Connect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
