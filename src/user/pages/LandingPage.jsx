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
    <div className="min-h-screen bg-white font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* ═══ FLOATING NAV ═══ */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-100/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <img src={logo} alt="Cheeseball" className="h-12 sm:h-16 w-auto rounded-full" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-gray-500 hover:text-blue-600 font-bold text-sm transition-colors">How it Works</a>
            <a href="#features" className="text-gray-500 hover:text-blue-600 font-bold text-sm transition-colors">Features</a>
            <a href="#assets" className="text-gray-500 hover:text-blue-600 font-bold text-sm transition-colors">Assets</a>
            <a href="#faq" className="text-gray-500 hover:text-blue-600 font-bold text-sm transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/auth")} className="text-gray-700 font-bold text-sm hover:text-blue-600 transition-colors hidden sm:block">
              Sign In
            </button>
            <button onClick={() => navigate("/signup")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 rounded-2xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ LIVE TICKER ═══ */}
      <div className="fixed top-16 sm:top-20 w-full z-40 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 overflow-hidden py-2.5">
        <div className="flex animate-marquee whitespace-nowrap gap-10 items-center">
          {[...marketData, ...marketData].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white">
              <span className="font-bold text-xs opacity-70">{item.coin}</span>
              <span className="font-black text-sm">{item.price}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.up ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-36 sm:pt-44 pb-16 sm:pb-24 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest animate-fade-in-down">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
                #1 Crypto Exchange in Nigeria
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9] animate-fade-in-up">
                Buy, Sell &{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text animate-gradient-shift">
                  Swap Crypto
                </span>
                <br />
                In Seconds.
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-lg animate-fade-in-up animation-delay-200">
                The fastest, safest way to trade cryptocurrency and gift cards in Nigeria.
                Get the best rates, instant payouts, and 24/7 support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-2xl font-black text-lg transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-3 group"
                >
                  Start Trading Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 px-8 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  Download App
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-4 animate-fade-in-up animation-delay-600">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-bold">Trusted by 50,000+ users</p>
                </div>
              </div>
            </div>

            {/* Hero Visual — floating coins */}
            <div className="relative hidden lg:flex items-center justify-center h-[550px]">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central glow */}
                <div className="w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-[80px] opacity-50 animate-pulse-slow"></div>
              </div>

              {/* Floating crypto coins */}
              <img src={btcIcon} alt="Bitcoin" className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-28 animate-float drop-shadow-2xl" />
              <img src={ethIcon} alt="Ethereum" className="absolute top-32 right-8 w-24 h-24 animate-float animation-delay-500 drop-shadow-xl" />
              <img src={usdtIcon} alt="USDT" className="absolute bottom-24 left-8 w-20 h-20 animate-float animation-delay-1000 drop-shadow-xl" />
              <img src={solIcon} alt="Solana" className="absolute bottom-8 right-16 w-22 h-22 animate-float animation-delay-1500 drop-shadow-xl" style={{ width: '5.5rem', height: '5.5rem' }} />
              <img src={appleGC} alt="Gift Card" className="absolute top-40 left-4 w-20 h-20 animate-float animation-delay-2000 drop-shadow-xl" />

              {/* Floating stat card */}
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-2xl shadow-gray-200/60 px-8 py-5 flex items-center gap-4 animate-float animation-delay-700 border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold">Trade Volume</p>
                  <p className="text-lg font-black text-gray-900">$2.4M <span className="text-green-500 text-xs">+12%</span></p>
                </div>
              </div>

              {/* Success notification */}
              <div className="absolute top-24 left-0 bg-white rounded-2xl shadow-xl shadow-gray-200/50 px-5 py-3 flex items-center gap-3 animate-slide-in-left animation-delay-1000 border border-gray-100">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Payment Received!</p>
                  <p className="text-[10px] text-gray-400 font-bold">+₦250,000 • 3s ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ANIMATED STATS ═══ */}
      <section id="stats-section" className="py-16 sm:py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 sm:gap-12 text-center">
            <div className="group">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums">
                {counter.users.toLocaleString()}+
              </p>
              <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">Active Traders</p>
            </div>
            <div className="group">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums">
                ${counter.volume}M+
              </p>
              <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">Volume Traded</p>
            </div>
            <div className="group">
              <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tabular-nums">
                {counter.trades.toLocaleString()}+
              </p>
              <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">Trades Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" className="py-20 sm:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3" /> Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Start Trading in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">3 Steps</span>
            </h2>
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              No complicated setup. Just sign up and start trading in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent z-0"></div>

            {[
              { step: "01", title: "Create Account", desc: "Sign up in 30 seconds with your email. No paperwork, no KYC delays.", icon: <UserPlus className="w-7 h-7" />, color: "from-blue-500 to-blue-600" },
              { step: "02", title: "Choose Your Trade", desc: "Pick from crypto, gift cards, or swaps. Set your amount and get instant quotes.", icon: <BarChart3 className="w-7 h-7" />, color: "from-indigo-500 to-indigo-600" },
              { step: "03", title: "Get Paid Instantly", desc: "Receive your payout in seconds. We support all Nigerian banks for instant transfers.", icon: <Wallet className="w-7 h-7" />, color: "from-purple-500 to-purple-600" },
            ].map((item, i) => (
              <div key={i} className={`relative z-10 text-center group reveal`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${item.color} text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {item.icon}
                </div>
                <div className="text-5xl font-black text-gray-100 mb-2">{item.step}</div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES BENTO GRID ═══ */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <Shield className="w-3 h-3" /> Why Cheeseball
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Built Different.
            </h2>
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              We're not just another exchange. Here's what makes us the top choice.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Big Feature Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2rem] p-8 sm:p-12 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-200 transition-all reveal">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 max-w-md">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Lightning-Fast Transactions</h3>
                <p className="text-blue-100 font-medium leading-relaxed text-base sm:text-lg">
                  Our automated system processes trades in seconds, not minutes.
                  Get your money faster than anywhere else.
                </p>
              </div>
              <img src={mobilePay} alt="" className="absolute bottom-0 right-4 w-48 sm:w-64 opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all group reveal">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
                <Lock className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Bank-Grade Security</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                AES-256 encryption, 2FA, and cold storage. Your assets are protected 24/7.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all group reveal">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-100 transition-colors">
                <Globe className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Best Market Rates</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                We scan multiple sources to guarantee you the most competitive rates in Nigeria.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all group reveal">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Our team is always online. Get help via live chat, email, or phone anytime.
              </p>
            </div>

            {/* Big card 2 */}
            <div className="lg:col-span-2 bg-gray-900 rounded-[2rem] p-8 sm:p-12 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-gray-300 transition-all reveal">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 group-hover:bg-blue-500/20 transition-all duration-700"></div>
              <div className="relative z-10 max-w-md">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Trade Gift Cards Too</h3>
                <p className="text-gray-400 font-medium leading-relaxed text-base sm:text-lg">
                  Got an unused gift card? Swap it for instant cash.
                  We accept Apple, Amazon, Steam, Google Play, and 20+ brands.
                </p>
              </div>
              <img src={transferMoney} alt="" className="absolute bottom-0 right-4 w-48 sm:w-64 opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SUPPORTED ASSETS ═══ */}
      <section id="assets" className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <Wallet className="w-3 h-3" /> Supported Assets
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
                All Your Favorite{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  Coins & Cards
                </span>
              </h2>
              <p className="text-gray-500 font-medium text-base sm:text-lg mb-8 max-w-lg">
                Trade top cryptocurrencies and swap 20+ gift card brands at the best rates.
                New assets added regularly.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95 flex items-center gap-3 group"
              >
                Start Trading Now
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-4 reveal">
              {/* Crypto Row */}
              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Cryptocurrencies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Bitcoin", symbol: "BTC", img: btcIcon, change: "+2.4%" },
                    { name: "Ethereum", symbol: "ETH", img: ethIcon, change: "+1.8%" },
                    { name: "Tether", symbol: "USDT", img: usdtIcon, change: "+0.1%" },
                    { name: "Solana", symbol: "SOL", img: solIcon, change: "+4.2%" },
                    { name: "BNB", symbol: "BNB", img: null, change: "-0.5%" },
                    { name: "Cardano", symbol: "ADA", img: null, change: "+1.2%" },
                  ].map((coin, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-default">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 font-black text-xs group-hover:scale-110 transition-transform">
                        {coin.img ? <img src={coin.img} alt="" className="w-full h-full object-cover" /> : coin.symbol}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{coin.name}</p>
                        <p className={`text-xs font-bold ${coin.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{coin.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gift Card Row */}
              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Gift Cards</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Apple/iTunes", img: appleGC },
                    { name: "Amazon", fallback: "AMZ" },
                    { name: "Steam", fallback: "STM" },
                    { name: "Google Play", fallback: "GPL" },
                    { name: "Sephora", fallback: "SEP" },
                    { name: "Nordstrom", fallback: "NOR" },
                  ].map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-default">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 font-black text-[10px] group-hover:scale-110 transition-transform">
                        {card.img ? <img src={card.img} alt="" className="w-full h-full object-cover" /> : card.fallback}
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate">{card.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL / SOCIAL PROOF ═══ */}
      <section className="py-20 sm:py-28 bg-blue-600 relative overflow-hidden reveal">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-300 fill-yellow-300" />)}
            </div>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-8 leading-snug">
              "Cheeseball is hands down the fastest exchange I've ever used.
              I sold BTC and had the money in my bank in under 3 minutes."
            </blockquote>
            <div>
              <p className="text-white font-bold text-lg">Adewale O.</p>
              <p className="text-blue-200 text-sm font-medium">Lagos, Nigeria • Verified Trader</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ACCORDION ═══ */}
      <section id="faq" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <HelpCircle className="w-3 h-3" /> FAQ
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
                Got Questions?
              </h2>
              <p className="text-gray-500 font-medium text-base sm:text-lg mb-8">
                Everything you need to know about trading on Cheeseball.
                Can't find what you're looking for? Chat with us.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all hover:shadow-lg active:scale-95 flex items-center gap-3"
              >
                Contact Support
              </button>
            </div>

            <div className="space-y-3 reveal">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`border rounded-2xl transition-all overflow-hidden cursor-pointer ${
                    activeAccordion === i ? 'border-blue-200 bg-blue-50/50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                  onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                >
                  <div className="flex justify-between items-center p-5 sm:p-6">
                    <h4 className={`font-bold text-sm sm:text-base pr-4 ${activeAccordion === i ? 'text-blue-700' : 'text-gray-900'}`}>
                      {faq.q}
                    </h4>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      activeAccordion === i ? 'rotate-180 text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${
                    activeAccordion === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-500 font-medium text-sm leading-relaxed">
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
      <section className="py-20 sm:py-28 bg-gray-50 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-16 lg:p-24 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
                Ready to Start{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                  Trading?
                </span>
              </h2>
              <p className="text-gray-400 text-base sm:text-xl font-medium mb-10 max-w-xl mx-auto">
                Join 50,000+ Nigerians who already trust Cheeseball for fast, secure crypto and gift card trading.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                  <Smartphone className="w-5 h-5" />
                  Download App
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-white pt-16 sm:pt-20 pb-8 sm:pb-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div className="sm:col-span-2">
              <img src={logo} alt="Cheeseball" className="h-16 w-auto rounded-full mb-6" />
              <p className="text-gray-500 font-medium max-w-sm text-sm leading-relaxed">
                Nigeria's most trusted cryptocurrency exchange. Buy, sell, and swap 
                crypto and gift cards with the best rates and instant payouts.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase text-xs tracking-widest text-gray-400 mb-4">Company</h4>
              <ul className="space-y-3 text-gray-500 font-medium text-sm">
                <li><button onClick={() => navigate("/about")} className="hover:text-blue-600 transition-colors">About Us</button></li>
                <li><button onClick={() => navigate("/careers")} className="hover:text-blue-600 transition-colors">Careers</button></li>
                <li><button onClick={() => navigate("/press")} className="hover:text-blue-600 transition-colors">Press</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-xs tracking-widest text-gray-400 mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-500 font-medium text-sm">
                <li><button onClick={() => navigate("/terms")} className="hover:text-blue-600 transition-colors text-left">Terms of Service</button></li>
                <li><button onClick={() => navigate("/privacy")} className="hover:text-blue-600 transition-colors text-left">Privacy Policy</button></li>
                <li><button onClick={() => navigate("/aml")} className="hover:text-blue-600 transition-colors text-left">AML Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm font-bold">
              © {new Date().getFullYear()} Cheeseball. All rights reserved.
            </p>
            <div className="flex gap-4">
              <CreditCard className="w-5 h-5 text-gray-300" />
              <Shield className="w-5 h-5 text-gray-300" />
              <Lock className="w-5 h-5 text-gray-300" />
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
