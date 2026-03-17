import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Smartphone,
  CreditCard,
  UserPlus,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  Star,
  Clock,
  Lock,
  Wallet,
  BarChart3,
} from "lucide-react";
import logo from "../../assets/CHEESEBALL 1.png";
import btcIcon from "../../assets/bitcoin_3d.png";
import ethIcon from "../../assets/ethereum_3d.png";
import usdtIcon from "../../assets/usdt_3d.png";
import solIcon from "../../assets/solana_3d.png";
import appleGC from "../../assets/apple_gc_3d.png";
import mobilePay from "../../assets/undraw_mobile-pay_yho9 1.png";
import transferMoney from "../../assets/undraw_transfer-money_h9s3 1.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [counter, setCounter] = useState({ users: 0, volume: 0, trades: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            // Trigger counter animation
            if (entry.target.id === "stats-section") {
              animateCounters();
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const duration = 2000;
    const targets = { users: 50000, volume: 10, trades: 250000 };
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter({
        users: Math.floor(targets.users * eased),
        volume: Math.floor(targets.volume * eased * 10) / 10,
        trades: Math.floor(targets.trades * eased),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  };

  const marketData = [
    { coin: "BTC", price: "$52,430", change: "+2.4%", up: true },
    { coin: "ETH", price: "$2,845", change: "+1.8%", up: true },
    { coin: "USDT", price: "₦1,540", change: "+0.1%", up: true },
    { coin: "SOL", price: "$112.30", change: "+4.2%", up: true },
    { coin: "BNB", price: "$354.20", change: "-0.5%", up: false },
    { coin: "NGN/USD", price: "₦1,542", change: "+0.3%", up: true },
  ];

  const faqs = [
    { q: "How fast are transactions processed?", a: "Most transactions are processed instantly. Crypto sales typically hit your bank account within 2-5 minutes after network confirmation. We use automated smart routing for maximum speed." },
    { q: "What are the trading limits?", a: "We support both small and high-volume trades. Limits start from $10 up to $50,000 daily, depending on your verification level. Contact support for higher limits." },
    { q: "Is my money and personal data safe?", a: "Absolutely. We use bank-grade AES-256 encryption, two-factor authentication, and secure cold storage for digital assets. Your data is never shared with third parties." },
    { q: "Which gift cards do you accept?", a: "We accept Apple/iTunes, Amazon, Steam, Google Play, Sephora, Nordstrom, Razer Gold, and many more. Check our app for the full list and current rates." },
    { q: "How do I contact support?", a: "Our dedicated support team is available 24/7 via live chat in the app, or by emailing support@cheeseball.com. Average response time is under 5 minutes." },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E11] font-sans overflow-x-hidden selection:bg-[#FFB11A]/30 selection:text-white">
      {/* ═══ FLOATING NAV ═══ */}
      <nav className="fixed w-full z-50 bg-[#0B0E11]/80 backdrop-blur-2xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <img src={logo} alt="Cheeseball" className="h-12 sm:h-16 w-auto rounded-full" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-gray-400 hover:text-[#FFB11A] font-bold text-sm transition-colors uppercase tracking-widest">How it Works</a>
            <a href="#features" className="text-gray-400 hover:text-[#FFB11A] font-bold text-sm transition-colors uppercase tracking-widest">Features</a>
            <a href="#assets" className="text-gray-400 hover:text-[#FFB11A] font-bold text-sm transition-colors uppercase tracking-widest">Assets</a>
            <a href="#faq" className="text-gray-400 hover:text-[#FFB11A] font-bold text-sm transition-colors uppercase tracking-widest">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/auth")} className="text-gray-300 font-bold text-sm hover:text-[#FFB11A] transition-colors hidden sm:block uppercase tracking-widest">
              Sign In
            </button>
            <button onClick={() => navigate("/signup")} className="bg-[#FFB11A] hover:bg-[#FFB11A]/90 text-black px-5 sm:px-6 py-2.5 rounded-xl font-black text-sm transition-all hover:shadow-lg hover:shadow-[#FFB11A]/20 active:scale-95 uppercase tracking-tighter">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ LIVE TICKER ═══ */}
      <div className="fixed top-16 sm:top-20 w-full z-40 bg-[#1E2329] border-b border-white/5 overflow-hidden py-2.5">
        <div className="flex animate-marquee whitespace-nowrap gap-10 items-center">
          {[...marketData, ...marketData].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[#EAECEF]">
              <span className="font-bold text-xs opacity-50 uppercase">{item.coin}</span>
              <span className="font-black text-sm">{item.price}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${item.up ? 'text-green-400' : 'text-red-400'}`}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-36 sm:pt-44 pb-16 sm:pb-24 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#FFB11A]/5 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#FFB11A]/10 border border-[#FFB11A]/20 text-[#FFB11A] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in-down">
                <span className="w-2 h-2 bg-[#FFB11A] rounded-full animate-ping"></span>
                Top Crypto Hub in Nigeria
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] animate-fade-in-up">
                Buy, Sell &{" "}
                <span className="text-[#FFB11A] italic">
                  Swap Crypto
                </span>
                <br />
                Instantly.
              </h1>

              <p className="text-lg sm:text-xl text-gray-400 font-medium leading-relaxed max-w-lg animate-fade-in-up animation-delay-200">
                The most reliable platform to trade BTC, USDT and Gift Cards in Nigeria.
                Enjoy premium rates, automated payouts, and bank-grade security.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-[#FFB11A] hover:bg-[#FFB11A]/90 text-black px-8 py-5 rounded-2xl font-black text-lg transition-all hover:shadow-2xl hover:shadow-[#FFB11A]/20 active:scale-95 flex items-center justify-center gap-3 group uppercase tracking-tighter"
                >
                  Start Trading
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 active:scale-95">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  Get the App
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4 animate-fade-in-up animation-delay-600">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E2329] to-[#0B0E11] border-2 border-[#FFB11A]/20 flex items-center justify-center text-[#FFB11A] text-xs font-black">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#FFB11A] fill-[#FFB11A]" />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Trusted by 50,000+ users</p>
                </div>
              </div>
            </div>

            {/* Hero Visual — floating coins */}
            <div className="relative hidden lg:flex items-center justify-center h-[550px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central glow */}
                <div className="w-80 h-80 bg-gradient-to-br from-[#FFB11A]/20 to-[#FFB11A]/5 rounded-full blur-[80px] opacity-50 animate-pulse-slow"></div>
              </div>

              {/* Floating crypto coins */}
              <img src={btcIcon} alt="Bitcoin" className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-28 animate-float drop-shadow-2xl" />
              <img src={ethIcon} alt="Ethereum" className="absolute top-32 right-8 w-24 h-24 animate-float animation-delay-500 drop-shadow-xl" />
              <img src={usdtIcon} alt="USDT" className="absolute bottom-24 left-8 w-20 h-20 animate-float animation-delay-1000 drop-shadow-xl" />
              <img src={solIcon} alt="Solana" className="absolute bottom-8 right-16 w-22 h-22 animate-float animation-delay-1500 drop-shadow-xl" style={{ width: '5.5rem', height: '5.5rem' }} />
              <img src={appleGC} alt="Gift Card" className="absolute top-40 left-4 w-20 h-20 animate-float animation-delay-2000 drop-shadow-xl" />

              {/* Floating stat card */}
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-[#1E2329] rounded-3xl shadow-2xl shadow-black/60 px-8 py-5 flex items-center gap-4 animate-float animation-delay-700 border border-white/5">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Trade Volume</p>
                  <p className="text-lg font-black text-white">$2.4M <span className="text-green-400 text-xs">+12%</span></p>
                </div>
              </div>

              {/* Success notification */}
              <div className="absolute top-24 left-0 bg-[#2B3139] rounded-2xl shadow-xl shadow-black/50 px-5 py-3 flex items-center gap-3 animate-slide-in-left animation-delay-1000 border border-white/5">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tighter">Payment Received!</p>
                  <p className="text-[10px] text-gray-500 font-bold">₦250,000 • 3s ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ANIMATED STATS ═══ */}
      <section id="stats-section" className="py-16 sm:py-20 bg-[#181A20] reveal border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 sm:gap-12 text-center">
            <div className="group">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums">
                {counter.users.toLocaleString()}+
              </p>
              <p className="text-[#FFB11A] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Active Traders</p>
            </div>
            <div className="group">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums">
                ${counter.volume}M+
              </p>
              <p className="text-[#FFB11A] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Volume Traded</p>
            </div>
            <div className="group">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums">
                {counter.trades.toLocaleString()}+
              </p>
              <p className="text-[#FFB11A] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Trades Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" className="py-20 sm:py-28 overflow-hidden bg-[#0B0E11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <div className="inline-flex items-center gap-2 bg-[#FFB11A]/10 text-[#FFB11A] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3" /> Quick Startup
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Start Trading in{" "}
              <span className="text-[#FFB11A] italic">3 Steps</span>
            </h2>
            <p className="text-gray-500 font-medium text-base sm:text-lg uppercase tracking-tight">
              No complicated setup. Just sign up and start trading in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFB11A]/20 to-transparent z-0"></div>

            {[
              { step: "01", title: "Create Account", desc: "Sign up in 30 seconds with your email. No paperwork, no KYC delays.", icon: <UserPlus className="w-7 h-7" />, color: "from-[#1E2329] to-[#0B0E11]" },
              { step: "02", title: "Choose Your Trade", desc: "Pick from crypto, gift cards, or swaps. Set your amount and get instant quotes.", icon: <BarChart3 className="w-7 h-7" />, color: "from-[#2B3139] to-[#1E2329]" },
              { step: "03", title: "Get Paid Instantly", desc: "Receive your payout in seconds. We support all Nigerian banks for instant transfers.", icon: <Wallet className="w-7 h-7" />, color: "from-[#FFB11A] to-[#FF8A00]" },
            ].map((item, i) => (
              <div key={i} className={`relative z-10 text-center group reveal`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${item.color} ${i === 2 ? 'text-black' : 'text-[#FFB11A]'} rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {item.icon}
                </div>
                <div className="text-5xl font-black text-white/5 mb-2">{item.step}</div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-3 uppercase tracking-tighter">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES BENTO GRID ═══ */}
      <section id="features" className="py-20 sm:py-28 bg-[#181A20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Shield className="w-3 h-3" /> Why Cheeseball
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 uppercase">
              The Premium Choice.
            </h2>
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              Engineered for speed, security, and the best rates in Nigeria.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Big Feature Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#1E2329] via-[#0B0E11] to-black rounded-[2rem] p-8 sm:p-12 text-white relative overflow-hidden group border border-white/5 hover:border-[#FFB11A]/30 transition-all reveal">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB11A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 max-w-md">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <Zap className="w-7 h-7 text-[#FFB11A]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tighter uppercase italic">Lightning Execution</h3>
                <p className="text-gray-400 font-medium leading-relaxed text-base sm:text-lg">
                  Every trade is powered by our high-frequency matching engine.
                  Experience instant finality on every transaction.
                </p>
              </div>
              <img src={mobilePay} alt="" className="absolute bottom-0 right-4 w-48 sm:w-64 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700" />
            </div>

            <div className="bg-[#1E2329] rounded-[2rem] p-8 border border-white/5 hover:border-[#FFB11A]/20 transition-all group reveal">
              <div className="w-14 h-14 bg-green-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-400/20 transition-colors">
                <Lock className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">Cold Storage</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Your assets are stored offline in military-grade facilities.
              </p>
            </div>

            <div className="bg-[#1E2329] rounded-[2rem] p-8 border border-white/5 hover:border-[#FFB11A]/20 transition-all group reveal">
              <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-400/20 transition-colors">
                <Globe className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">Global Liquidity</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Access deep liquidity pools for the best rates on every pair.
              </p>
            </div>

            <div className="bg-[#1E2329] rounded-[2rem] p-8 border border-white/5 hover:border-[#FFB11A]/20 transition-all group reveal">
              <div className="w-14 h-14 bg-[#FFB11A]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#FFB11A]/20 transition-colors">
                <Clock className="w-7 h-7 text-[#FFB11A]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">VIP Service</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Dedicated relationship managers for all high-volume traders.
              </p>
            </div>

            {/* Big card 2 */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#FFB11A] to-[#FF8A00] rounded-[2rem] p-8 sm:p-12 text-black relative overflow-hidden group hover:shadow-2xl hover:shadow-[#FFB11A]/20 transition-all reveal">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 group-hover:scale-150 transition-all duration-700"></div>
              <div className="relative z-10 max-w-md">
                <div className="w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tighter uppercase italic">Gift Card Hub</h3>
                <p className="text-black/70 font-bold leading-relaxed text-base sm:text-lg">
                  Convert unused gift cards to Naira instantly.
                  Premium rates for Apple, Steam, AMEX and 20+ more.
                </p>
              </div>
              <img src={transferMoney} alt="" className="absolute bottom-0 right-4 w-48 sm:w-64 opacity-40 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SUPPORTED ASSETS ═══ */}
      <section id="assets" className="py-20 sm:py-28 bg-[#0B0E11] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 bg-[#FFB11A]/10 text-[#FFB11A] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Wallet className="w-3 h-3" /> Market Depth
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
                Premium{" "}
                <span className="text-[#FFB11A] italic underline decoration-white/10 decoration-8 underline-offset-8">
                  Assets List
                </span>
              </h2>
              <p className="text-gray-500 font-medium text-base sm:text-lg mb-8 max-w-lg uppercase tracking-tight">
                Trade verified assets with zero slippage. Our order books are updated millisecond-by-millisecond.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#FFB11A] hover:bg-[#FFB11A]/90 text-black px-8 py-4 rounded-2xl font-black text-base transition-all hover:shadow-lg hover:shadow-[#FFB11A]/20 active:scale-95 flex items-center gap-3 group uppercase tracking-tighter"
              >
                Start Trading
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-4 reveal">
              {/* Crypto Row */}
              <div className="bg-[#181A20] rounded-3xl p-6 sm:p-8 border border-white/5">
                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Hot Currencies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Bitcoin", symbol: "BTC", img: btcIcon, change: "+2.4%" },
                    { name: "Ethereum", symbol: "ETH", img: ethIcon, change: "+1.8%" },
                    { name: "Tether", symbol: "USDT", img: usdtIcon, change: "+0.1%" },
                    { name: "Solana", symbol: "SOL", img: solIcon, change: "+4.2%" },
                    { name: "BNB", symbol: "BNB", img: null, change: "-0.5%" },
                    { name: "Cardano", symbol: "ADA", img: null, change: "+1.2%" },
                  ].map((coin, i) => (
                    <div key={i} className="bg-[#1E2329] rounded-2xl p-4 flex items-center gap-3 border border-white/5 hover:border-[#FFB11A]/30 hover:bg-[#2B3139] transition-all group cursor-default">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#0B0E11] font-black text-xs text-[#FFB11A] group-hover:scale-110 transition-transform border border-white/5">
                        {coin.img ? <img src={coin.img} alt="" className="w-full h-full object-cover" /> : coin.symbol}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-white truncate uppercase">{coin.name}</p>
                        <p className={`text-[10px] font-black ${coin.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{coin.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gift Card Row */}
              <div className="bg-[#181A20] rounded-3xl p-6 sm:p-8 border border-white/5">
                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Top Gift Cards</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Apple", img: appleGC },
                    { name: "Amazon", fallback: "AMZ" },
                    { name: "Steam", fallback: "STM" },
                    { name: "Google", fallback: "GPL" },
                    { name: "Sephora", fallback: "SEP" },
                    { name: "Nordstrom", fallback: "NOR" },
                  ].map((card, i) => (
                    <div key={i} className="bg-[#1E2329] rounded-2xl p-4 flex items-center gap-3 border border-white/5 hover:border-blue-400/30 hover:bg-[#2B3139] transition-all group cursor-default">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#0B0E11] font-black text-[10px] text-blue-400 group-hover:scale-110 transition-transform border border-white/5">
                        {card.img ? <img src={card.img} alt="" className="w-full h-full object-cover" /> : card.fallback}
                      </div>
                      <p className="text-[10px] font-black text-white truncate uppercase">{card.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL / SOCIAL PROOF ═══ */}
      <section className="py-20 sm:py-28 bg-[#FFB11A] relative overflow-hidden reveal">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-black">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-black fill-black" />)}
            </div>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter mb-8 leading-snug uppercase italic">
              "Cheeseball transformed my trading experience.
              The Bybit-inspired interface is premium, and payouts hit my bank in less than 2 minutes."
            </blockquote>
            <div>
              <p className="font-black text-lg uppercase tracking-widest">Adewale O.</p>
              <p className="text-black/50 text-xs font-black uppercase tracking-[0.2em]">Lagos, Nigeria • Verified High Volume Trader</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ACCORDION ═══ */}
      <section id="faq" className="py-20 sm:py-28 bg-[#0B0E11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 bg-[#FFB11A]/10 text-[#FFB11A] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <HelpCircle className="w-3 h-3" /> Support
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 uppercase">
                Got Questions?
              </h2>
              <p className="text-gray-500 font-medium text-base sm:text-lg mb-8 uppercase tracking-tight">
                Everything you need to know about the most premium exchange in Nigeria.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-base transition-all active:scale-95 flex items-center gap-3 uppercase tracking-tighter"
              >
                Contact Support
              </button>
            </div>

            <div className="space-y-3 reveal">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`border rounded-2xl transition-all overflow-hidden cursor-pointer ${
                    activeAccordion === i ? 'border-[#FFB11A]/30 bg-[#1E2329] shadow-2xl shadow-black/50' : 'border-white/5 bg-[#181A20] hover:border-white/10'
                  }`}
                  onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                >
                  <div className="flex justify-between items-center p-5 sm:p-6">
                    <h4 className={`font-black text-xs sm:text-sm pr-4 uppercase tracking-widest ${activeAccordion === i ? 'text-[#FFB11A]' : 'text-white'}`}>
                      {faq.q}
                    </h4>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      activeAccordion === i ? 'rotate-180 text-[#FFB11A]' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${
                    activeAccordion === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-400 font-medium text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 sm:py-28 bg-[#181A20] reveal border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-black rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-16 lg:p-24 text-center relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB11A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-all duration-700"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6 leading-tight uppercase italic">
                The World of{" "}
                <span className="text-[#FFB11A]">
                  Top Rates
                </span>
                <br />Awaits You.
              </h2>
              <p className="text-gray-500 text-base sm:text-xl font-medium mb-10 max-w-xl mx-auto uppercase tracking-tighter">
                Join 50,000+ traders experiencing the premium side of crypto.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-[#FFB11A] hover:bg-[#FFB11A]/90 text-black px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-[#FFB11A]/20 transition-all active:scale-95 flex items-center justify-center gap-3 group uppercase tracking-tighter"
                >
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 uppercase tracking-tighter border-white/10">
                  <Smartphone className="w-5 h-5" />
                  Download App
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0B0E11] pt-16 sm:pt-20 pb-8 sm:pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div className="sm:col-span-2">
              <img src={logo} alt="Cheeseball" className="h-16 w-auto rounded-full mb-6 grayscale hover:grayscale-0 transition-all" />
              <p className="text-gray-500 font-medium max-w-sm text-sm leading-relaxed uppercase tracking-tighter">
                Nigeria's #1 Institutional Grade Exchange. Experience depth, speed, and security like never before.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-600 mb-6">Trade</h4>
              <ul className="space-y-4 text-gray-500 font-black text-xs uppercase tracking-widest">
                <li><button onClick={() => navigate("/rates")} className="hover:text-[#FFB11A] transition-colors">Market</button></li>
                <li><button onClick={() => navigate("/buy")} className="hover:text-[#FFB11A] transition-colors">Buy Crypto</button></li>
                <li><button onClick={() => navigate("/swap")} className="hover:text-[#FFB11A] transition-colors">Convert</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-600 mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-500 font-black text-xs uppercase tracking-widest">
                <li><button onClick={() => navigate("/terms")} className="hover:text-[#FFB11A] transition-colors text-left font-black">Terms</button></li>
                <li><button onClick={() => navigate("/privacy")} className="hover:text-[#FFB11A] transition-colors text-left font-black">Privacy</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} CHEESEBALL • INSTITUTIONAL GRADE TRADING
            </p>
            <div className="flex gap-6">
              <ShieldCheck className="w-5 h-5 text-gray-800" />
              <Lock className="w-5 h-5 text-gray-800" />
              <Zap className="w-5 h-5 text-gray-800" />
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ ANIMATIONS CSS ═══ */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 25s linear infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 10s ease-in-out infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }

        @keyframes gradient-shift {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient-shift { animation: gradient-shift 4s ease-in-out infinite; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }

        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
