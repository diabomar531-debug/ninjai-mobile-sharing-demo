import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  BookOpenText,
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Download,
  FileDown,
  FileText,
  Mail,
  MessageCircle,
  NotebookText,
  PanelsTopLeft,
  PenLine,
  Save,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap
} from "lucide-react";
import "./styles.css";

const mock = {
  balanceBefore: 42.5,
  promptCost: 0.12,
  balanceAfter: 42.38,
  originalEstimatedCost: 0.18,
  optimizedCost: 0.12,
  savings: 0.06,
  computeReduction: 18,
  selectedProvider: "Claude",
  routingMode: "Smart Routing",
  routingReason: "Best quality for strategic analysis",
  shareTitle: "AI Wallet Launch Opportunity",
  shareChannel: "WhatsApp",
  shareType: "Share Card"
};

const responseText =
  "Launching an AI wallet for university students presents a strong opportunity because students are frequent AI users, highly cost-sensitive, and responsive to products that reduce subscription waste. The primary opportunity is to replace multiple recurring AI subscriptions with a flexible prepaid AI balance. Ninjai can make AI spending feel transparent, provider-neutral, and easier to share across study groups, clubs, and early professional networks.";

const screens = [
  "Home",
  "New Prompt",
  "Streaming Response",
  "Completed Response",
  "Share Preview",
  "Share Card",
  "Share Destination",
  "Receiver View",
  "Share Success"
];

function currency(value) {
  return `$${value.toFixed(2)}`;
}

function App() {
  const [screen, setScreen] = useState("Home");
  const [streamDone, setStreamDone] = useState(false);

  const go = (next) => {
    setScreen(next);
    if (next === "Streaming Response") {
      setStreamDone(false);
    }
  };

  const screenProps = { go, streamDone, setStreamDone };

  return (
    <main className="app-bg">
      <MobileShell screen={screen} go={go}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="screen"
          >
            {screen === "Home" && <WalletHome {...screenProps} />}
            {screen === "New Prompt" && <PromptComposer {...screenProps} />}
            {screen === "Streaming Response" && <ResponseScreen {...screenProps} />}
            {screen === "Completed Response" && <CompletedResponse {...screenProps} />}
            {screen === "Share Preview" && <ShareSummaryPreview {...screenProps} />}
            {screen === "Share Card" && <ShareCardScreen {...screenProps} />}
            {screen === "Share Destination" && <ShareDestinationScreen {...screenProps} />}
            {screen === "Receiver View" && <ReceiverPreview {...screenProps} />}
            {screen === "Share Success" && <ShareSuccessScreen {...screenProps} />}
          </motion.div>
        </AnimatePresence>
      </MobileShell>
    </main>
  );
}

function MobileShell({ children, screen, go }) {
  const canBack = screen !== "Home";
  const progress = Math.max(0.08, (screens.indexOf(screen) + 1) / screens.length);

  return (
    <section className="phone-frame" aria-label="Ninjai mobile demo">
      <div className="phone-status">
        <span>9:41</span>
        <span className="status-dots">● ● ●</span>
      </div>
      <div className="topbar">
        <button
          className="icon-button"
          onClick={() => go(previousScreen(screen))}
          disabled={!canBack}
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="app-kicker">Ninjai Wallet</p>
          <h1>{screen === "Home" ? "Ninjai Wallet" : screen}</h1>
        </div>
        <button className="icon-button" aria-label="Settings">
          <Settings size={18} />
        </button>
      </div>
      <div className="progress-track">
        <motion.div className="progress-fill" animate={{ width: `${progress * 100}%` }} />
      </div>
      {children}
    </section>
  );
}

function previousScreen(screen) {
  const index = screens.indexOf(screen);
  return screens[Math.max(0, index - 1)];
}

function WalletHome({ go }) {
  return (
    <>
      <WalletBalanceCard />
      <ProviderAccessCard />
      <button className="primary-cta" onClick={() => go("New Prompt")}>
        <PenLine size={18} />
        New Prompt
      </button>
      <div className="quick-grid">
        <QuickAction icon={MessageCircle} label="Recent Conversations" />
        <QuickAction icon={FileText} label="Documents" />
        <QuickAction icon={BarChart3} label="Analytics" />
        <QuickAction icon={Settings} label="Settings" />
      </div>
    </>
  );
}

function WalletBalanceCard() {
  return (
    <section className="hero-card">
      <div className="card-row">
        <div>
          <p className="muted">AI Balance</p>
          <strong className="balance">$42.50</strong>
        </div>
        <span className="brand-mark">
          <Wallet size={24} />
        </span>
      </div>
      <div className="usage-row">
        <span>Monthly usage</span>
        <span>$8.20 used</span>
      </div>
      <div className="meter">
        <div />
      </div>
    </section>
  );
}

function ProviderAccessCard() {
  const providers = ["OpenAI", "Claude", "Gemini", "Ninjai Explore"];
  return (
    <section className="panel">
      <div className="section-title">
        <h2>Available AI Providers</h2>
        <Sparkles size={18} />
      </div>
      <div className="provider-list">
        {providers.map((provider) => (
          <div className="provider-pill" key={provider}>
            <Check size={14} />
            {provider}
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickAction({ icon: Icon, label }) {
  return (
    <button className="quick-action">
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function PromptComposer({ go }) {
  return (
    <>
      <section className="panel composer">
        <textarea
          aria-label="Prompt"
          defaultValue="Summarize the key risks and opportunities for launching an AI wallet for university students."
          placeholder="Ask anything..."
        />
        <div className="routing-row">
          <span>
            <Zap size={15} />
            Smart Routing enabled
          </span>
          <strong>Claude likely</strong>
        </div>
      </section>
      <ModeSelector />
      <footer className="sticky-footer">
        <p>Estimated cost before optimization: <strong>$0.18</strong></p>
        <button className="primary-cta" onClick={() => go("Streaming Response")}>
          <Send size={18} />
          Send Prompt
        </button>
      </footer>
    </>
  );
}

function ModeSelector() {
  const [mode, setMode] = useState("Research");
  return (
    <section className="panel compact">
      <h2>Mode</h2>
      <div className="chip-row">
        {["Research", "Summarize", "Study", "Write", "Analyze"].map((item) => (
          <button
            key={item}
            className={mode === item ? "chip selected" : "chip"}
            onClick={() => setMode(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

function ResponseScreen({ go, setStreamDone }) {
  return (
    <>
      <StreamingResponse onComplete={() => setStreamDone(true)} />
      <button className="primary-cta" onClick={() => go("Completed Response")}>
        View Optimization
        <ChevronRight size={18} />
      </button>
    </>
  );
}

function StreamingResponse({ onComplete, completed = false }) {
  const [visible, setVisible] = useState(completed ? responseText : "");

  useEffect(() => {
    if (completed) return;
    setVisible("");
    let index = 0;
    const interval = window.setInterval(() => {
      index = Math.min(responseText.length, index + 18);
      setVisible(responseText.slice(0, index));
      if (index >= responseText.length) {
        window.clearInterval(interval);
        onComplete?.();
      }
    }, 85);
    return () => window.clearInterval(interval);
  }, [completed, onComplete]);

  const done = visible.length >= responseText.length;

  return (
    <section className="panel response-panel">
      <div className="section-title">
        <div>
          <h2>Ninjai Response</h2>
          <p>{mock.routingMode} · {mock.selectedProvider} selected</p>
        </div>
        <span className="provider-badge">{mock.selectedProvider}</span>
      </div>
      <p className="response-copy">{visible}<span className={done ? "cursor done" : "cursor"} /></p>
      <div className="live-row">
        <span className={done ? "done-label" : "generating"}>
          {done ? "Complete" : "Generating..."}
        </span>
        <span>Live estimated cost: <strong>$0.11</strong></span>
      </div>
      <div className="cost-meter">
        <motion.div animate={{ width: done ? "67%" : ["24%", "58%", "42%", "67%"] }} transition={{ duration: done ? 0.3 : 2, repeat: done ? 0 : Infinity }} />
      </div>
    </section>
  );
}

function CompletedResponse({ go }) {
  return (
    <>
      <StreamingResponse completed />
      <div className="action-row">
        <IconAction icon={Copy} label="Copy" />
        <IconAction icon={Save} label="Save" />
        <IconAction icon={FileDown} label="Export" />
      </div>
      <CostSummaryCard />
      <OptimizationCard />
      <WalletImpactCard />
      <ShareIntelligenceButton onClick={() => go("Share Preview")} />
    </>
  );
}

function IconAction({ icon: Icon, label }) {
  return (
    <button className="mini-action" aria-label={label}>
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function CostSummaryCard() {
  return (
    <section className="panel stats-card">
      <h2>Cost Summary</h2>
      <DataRow label="Original estimated cost" value={currency(mock.originalEstimatedCost)} />
      <DataRow label="Final optimized cost" value={currency(mock.optimizedCost)} positive />
      <DataRow label="You saved" value={currency(mock.savings)} positive />
      <DataRow label="Provider" value={mock.selectedProvider} />
      <DataRow label="Routing reason" value={mock.routingReason} />
    </section>
  );
}

function OptimizationCard() {
  return (
    <section className="panel">
      <div className="section-title">
        <h2>Optimization</h2>
        <ShieldCheck size={18} />
      </div>
      <CheckLine>Context reused</CheckLine>
      <CheckLine>Prompt compressed</CheckLine>
      <CheckLine>Cost optimized</CheckLine>
      <div className="compute-badge">Estimated compute reduced: {mock.computeReduction}%</div>
    </section>
  );
}

function WalletImpactCard() {
  return (
    <section className="panel stats-card">
      <h2>Wallet Impact</h2>
      <DataRow label="Balance before" value={currency(mock.balanceBefore)} />
      <DataRow label="This prompt" value={`-${currency(mock.promptCost)}`} />
      <DataRow label="Remaining balance" value={currency(mock.balanceAfter)} positive />
    </section>
  );
}

function ShareIntelligenceButton({ onClick }) {
  return (
    <button className="primary-cta glow" onClick={onClick}>
      <Share2 size={18} />
      Share Intelligence
    </button>
  );
}

function ShareSummaryPreview({ go }) {
  const [generating, setGenerating] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setGenerating(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <ShareIntelligenceSheet generating={generating} />
      {!generating && (
        <motion.section className="panel share-summary" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-title">
            <h2>{mock.shareTitle}</h2>
            <span className="provider-badge">Summary</span>
          </div>
          <p>
            University students are a strong initial market for Ninjai because they use AI frequently, are price-sensitive, and experience subscription fatigue. A prepaid AI wallet can reduce unused subscription waste while giving students access to multiple AI providers through one balance.
          </p>
          <h3>Key Takeaways</h3>
          <ol className="takeaways">
            <li>Students are high-frequency AI users.</li>
            <li>PAYG AI access reduces subscription waste.</li>
            <li>Smart routing improves provider flexibility.</li>
            <li>Optimization creates visible savings.</li>
            <li>Sharing and referrals can drive organic growth.</li>
          </ol>
          <div className="attribution">
            <strong>Generated with Ninjai</strong>
            <span>One Wallet. Any AI. Anywhere.</span>
          </div>
          <div className="action-row">
            <IconAction icon={Clipboard} label="Share as Text" />
            <button className="mini-action active" onClick={() => go("Share Card")}>
              <PanelsTopLeft size={16} />
              <span>Share Card</span>
            </button>
            <IconAction icon={Copy} label="Copy Link" />
          </div>
        </motion.section>
      )}
    </>
  );
}

function ShareIntelligenceSheet({ generating }) {
  return (
    <section className="bottom-sheet">
      <div className="sheet-handle" />
      <h2>Share Intelligence</h2>
      <p>Ninjai can turn this response into a polished shareable summary.</p>
      <Selector label="Share format" items={["Summary", "Key Takeaways", "Executive Brief", "Share Card"]} selected="Share Card" />
      <Selector label="Tone" items={["Professional", "Student-friendly", "Concise", "Detailed"]} selected="Professional" />
      {generating ? (
        <div className="loading-block">
          <span className="spinner" />
          <strong>Optimizing for sharing...</strong>
          {["Summarizing response", "Extracting key insights", "Formatting share card", "Adding Ninjai attribution"].map((step) => (
            <CheckLine key={step}>{step}</CheckLine>
          ))}
        </div>
      ) : (
        <div className="done-label">Shareable summary generated</div>
      )}
    </section>
  );
}

function Selector({ label, items, selected }) {
  return (
    <div className="selector">
      <span>{label}</span>
      <div className="chip-row">
        {items.map((item) => (
          <button className={item === selected ? "chip selected" : "chip"} key={item}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ShareCardScreen({ go }) {
  return (
    <>
      <ShareCardPreview />
      <button className="primary-cta" onClick={() => go("Share Destination")}>
        <Share2 size={18} />
        Share Card
      </button>
    </>
  );
}

function ShareCardPreview() {
  return (
    <section className="share-card">
      <div className="share-card-top">
        <span>Ninjai Intelligence</span>
        <Sparkles size={18} />
      </div>
      <h2>{mock.shareTitle}</h2>
      <p>
        Students are an ideal first market for prepaid AI consumption because they combine high AI usage, price sensitivity, and strong referral behaviour.
      </p>
      <div className="share-points">
        <CheckLine>Reduces subscription waste</CheckLine>
        <CheckLine>Supports multiple AI providers</CheckLine>
        <CheckLine>Optimizes cost per prompt</CheckLine>
        <CheckLine>Enables wallet-based AI budgeting</CheckLine>
      </div>
      <div className="optimization-stamp">
        <strong>Optimized by Ninjai</strong>
        <span>Estimated compute reduced {mock.computeReduction}%</span>
      </div>
      <footer>
        <strong>Generated with Ninjai</strong>
        <span>One Wallet. Any AI. Anywhere.</span>
      </footer>
    </section>
  );
}

function ShareDestinationScreen({ go }) {
  return (
    <>
      <ShareDestinationGrid onShare={() => go("Receiver View")} />
      <div className="utility-actions">
        <IconAction icon={Copy} label="Copy Link" />
        <IconAction icon={Download} label="Download Card" />
        <IconAction icon={FileDown} label="Export PDF" />
      </div>
    </>
  );
}

function ShareDestinationGrid({ onShare }) {
  const destinations = [
    ["Messages", MessageCircle],
    ["WhatsApp", Send],
    ["Email", Mail],
    ["Slack", Zap],
    ["Teams", PanelsTopLeft],
    ["Notes", NotebookText]
  ];
  return (
    <section className="panel">
      <h2>Share Destination</h2>
      <div className="destination-grid">
        {destinations.map(([label, Icon]) => (
          <button key={label} onClick={label === "Messages" || label === "WhatsApp" ? onShare : undefined}>
            <span>
              <Icon size={21} />
            </span>
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

function ReceiverPreview({ go }) {
  return (
    <section className="receiver-page">
      <div className="receiver-header">Shared Ninjai Intelligence</div>
      <article className="receiver-card">
        <h2>{mock.shareTitle}</h2>
        <p>
          University students are a strong early market for prepaid AI consumption because they use AI frequently, are cost-sensitive, and benefit from avoiding unused AI subscriptions.
        </p>
        <div className="share-points">
          <CheckLine>AI spending should be flexible</CheckLine>
          <CheckLine>Wallet balances reduce subscription waste</CheckLine>
          <CheckLine>Provider-neutral access improves choice</CheckLine>
          <CheckLine>Optimization reduces cost</CheckLine>
          <CheckLine>Ninjai makes AI consumption shareable</CheckLine>
        </div>
        <footer>Shared from Ninjai</footer>
      </article>
      <button className="primary-cta" onClick={() => go("Share Success")}>
        <Sparkles size={18} />
        Explore Ninjai
      </button>
      <button className="ghost-cta" onClick={() => go("Share Card")}>View original share card</button>
      <p className="small-center">Generated with Ninjai Intelligence</p>
    </section>
  );
}

function ShareSuccessScreen({ go }) {
  return (
    <section className="success-screen">
      <div className="success-icon">
        <Check size={34} />
      </div>
      <h2>Shared successfully</h2>
      <p>This insight has been shared via {mock.shareChannel}.</p>
      <div className="panel stats-card">
        <DataRow label="Trackable share link" value="Created" positive />
        <DataRow label="Potential referral source" value="Ninjai Explore" />
        <DataRow label="Share type" value={mock.shareType} />
      </div>
      <button className="primary-cta" onClick={() => go("Completed Response")}>
        Back to conversation
      </button>
    </section>
  );
}

function DataRow({ label, value, positive }) {
  return (
    <div className="data-row">
      <span>{label}</span>
      <strong className={positive ? "positive" : ""}>{value}</strong>
    </div>
  );
}

function CheckLine({ children }) {
  return (
    <div className="check-line">
      <Check size={15} />
      <span>{children}</span>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
