import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Smartphone,
  CreditCard,
  ChevronRight,
  UserPlus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import logo from "../../assets/CHEESEBALL 1.png"; // Assuming logo exists here

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Cheeseball" className="h-10 w-auto" />
            <span className="font-black text-xl tracking-tight text-blue-900 hidden sm:block">
              CHEESEBALL
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-500">
            <a
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a href="#rates" className="hover:text-blue-600 transition-colors">
              Rates
            </a>
            <a
              href="#support"
              className="hover:text-blue-600 transition-colors"
            >
              Support
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="text-gray-900 font-black hover:text-blue-600 transition-colors text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all transform hover:scale-105 shadow-lg shadow-blue-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Rates Marquee */}
      <div className="fixed top-20 w-full z-40 bg-blue-600 overflow-hidden py-2 border-y border-blue-500/20 backdrop-blur-sm">
        <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
          {[
            { coin: "BTC", price: "$52,430.12", change: "+2.4%" },
            { coin: "ETH", price: "$2,845.65", change: "+1.8%" },
            { coin: "USDT", price: "₦1,540.00", change: "+0.1%" },
            { coin: "SOL", price: "$112.30", change: "+4.2%" },
            { coin: "BNB", price: "$354.20", change: "-0.5%" },
            { coin: "NGN/USD", price: "₦1,542.10", change: "+0.3%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white">
              <span className="font-black text-xs tracking-tighter opacity-60">{item.coin}</span>
              <span className="font-black text-sm">{item.price}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${item.change.startsWith('+') ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'}`}>{item.change}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {[
             { coin: "BTC", price: "$52,430.12", change: "+2.4%" },
             { coin: "ETH", price: "$2,845.65", change: "+1.8%" },
             { coin: "USDT", price: "₦1,540.00", change: "+0.1%" },
             { coin: "SOL", price: "$112.30", change: "+4.2%" },
             { coin: "BNB", price: "$354.20", change: "-0.5%" },
             { coin: "NGN/USD", price: "₦1,542.10", change: "+0.3%" },
          ].map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3 text-white">
              <span className="font-black text-xs tracking-tighter opacity-60">{item.coin}</span>
              <span className="font-black text-sm">{item.price}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${item.change.startsWith('+') ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'}`}>{item.change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent -z-10"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
              Live Rates Available
            </div>
            <h1 className="text-5xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] lg:leading-[0.85]">
              Trade Crypto{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400">
                Faster
              </span>{" "}
              Than Ever.
            </h1>
            <p className="text-xl text-gray-500 font-bold leading-relaxed max-w-lg">
              Experience lightning-fast transactions, institutional-grade security, and
              the most competitive rates in Nigeria. No delays, no limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/auth")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-[2rem] font-black text-lg transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-200 flex items-center justify-center gap-2 group"
              >
                Start Trading Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 px-8 py-5 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5 text-gray-400" />
                Download App
              </button>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center gap-8">
              <div>
                <p className="text-3xl font-black text-gray-900">50K+</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Active Users
                </p>
              </div>
              <div className="w-px h-10 bg-gray-100"></div>
              <div>
                <p className="text-3xl font-black text-gray-900">$10M+</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Traded Volume
                </p>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center animate-float">
            {/* Abstract Phone/App Mockup Visual */}
            <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden rotate-[-6deg] hover:rotate-0 transition-all duration-700 z-10">
              <div className="absolute top-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 opacity-90"></div>
              {/* Mock UI Elements */}
              <div className="absolute top-8 left-6 right-6">
                <div className="flex justify-between items-center text-white mb-8">
                  <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  <div className="w-20 h-4 bg-white/20 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-40 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 p-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full mb-4"></div>
                    <div className="w-32 h-6 bg-white/20 rounded-full mb-2"></div>
                    <div className="w-20 h-4 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="h-20 bg-white rounded-3xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-gray-100 rounded-full mb-2"></div>
                      <div className="w-16 h-3 bg-gray-50 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-white rounded-3xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-gray-100 rounded-full mb-2"></div>
                      <div className="w-16 h-3 bg-gray-50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full blur-[100px] -z-10 opacity-30"></div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 reveal">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-4">
              Simple. Fast. Secured.
            </h2>
            <p className="text-gray-500 font-bold text-lg">
              Three simple steps to start trading like a pro.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
            
            {[
              { step: "01", title: "Create Account", desc: "Sign up in seconds with just your email address. No complex forms.", icon: <UserPlus className="w-6 h-6 text-blue-600" /> },
              { step: "02", title: "Verify & Fund", desc: "Verify your identity and fund your wallet using our secure gateways.", icon: <ShieldCheck className="w-6 h-6 text-blue-600" /> },
              { step: "03", title: "Start Trading", desc: "Buy or sell your favorite crypto assets at the best rates instantly.", icon: <TrendingUp className="w-6 h-6 text-blue-600" /> },
            ].map((item, i) => (
              <div key={i} className={`relative z-10 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 reveal delay-${i+1}00`}>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100">
                  {item.icon}
                </div>
                <div className="text-4xl font-black text-blue-600/10 mb-4">{item.step}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 font-bold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 reveal">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Built for Scale.
            </h2>
            <p className="text-gray-500 font-bold text-lg">
              We provide the most reliable infrastructure for your crypto
              journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: "Instant Transactions",
                desc: "Say goodbye to delays. Our automated system ensures your trades are processed in seconds.",
                color: "bg-yellow-50",
              },
              {
                icon: <Shield className="w-8 h-8 text-green-500" />,
                title: "Bank-Grade Security",
                desc: "Your assets are protected by industry-leading encryption and secure cold storage protocols.",
                color: "bg-green-50",
              },
              {
                icon: <Globe className="w-8 h-8 text-blue-500" />,
                title: "Best Market Rates",
                desc: "We scan multiple exchanges to give you the most competitive rates in Nigeria, guaranteed.",
                color: "bg-blue-50",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-2 reveal delay-${i+1}00`}
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* market stats */}
      <section className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent)]"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
               <div>
                 <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-6">
                    Real-time Market Insights. 
                 </h2>
                 <p className="text-gray-400 text-lg font-medium mb-8">
                    Stay ahead of the market with our advanced analytics and real-time pricing engine. 
                    We provide the data you need to make informed decisions.
                 </p>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                       <div className="text-3xl font-black text-white mb-1">$2.4B+</div>
                       <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Market Cap tracked</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                       <div className="text-3xl font-black text-white mb-1">99.9%</div>
                       <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Uptime Guaranteed</div>
                    </div>
                 </div>
               </div>
               <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 lg:p-12 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                  <div className="flex justify-between items-center mb-10">
                     <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                     <TrendingUp className="text-white w-8 h-8" />
                  </div>
                  <div className="space-y-4">
                     <div className="h-2 bg-white/20 rounded-full w-full"></div>
                     <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                     <div className="h-32 bg-white/10 rounded-3xl border border-white/10 flex items-center justify-center">
                        <Zap className="text-white/40 w-12 h-12 animate-pulse" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#0063BF] rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                Start Trading Like a Pro Today.
              </h2>
              <p className="text-blue-100 text-xl font-medium mb-12">
                Join 50,000+ Nigerians who trust Cheeseball for their daily
                crypto transactions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button
                    onClick={() => navigate("/auth")}
                    className="bg-white text-blue-600 px-10 py-6 rounded-[2rem] font-black text-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-6 h-6" />
                  </button>
                  <button className="bg-transparent border-2 border-white/30 text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2">
                    <Smartphone className="w-6 h-6" />
                    Download App
                  </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img
                  src={logo}
                  alt="Cheeseball"
                  className="h-8 w-auto brightness-0 invert"
                />
                <span className="font-black text-xl tracking-tight">
                  CHEESEBALL
                </span>
              </div>
              <p className="text-gray-400 font-medium max-w-sm">
                The most trusted cryptocurrency exchange platform for seamless
                buy, sell, and swap transactions in Nigeria.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase text-xs tracking-widest text-gray-500 mb-6">
                Company
              </h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li>
                  <button onClick={() => navigate("/about")} className="hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/careers")} className="hover:text-white transition-colors text-left">
                    Careers
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/press")} className="hover:text-white transition-colors">
                    Press
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase text-xs tracking-widest text-gray-500 mb-6">
                Legal
              </h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li>
                  <button onClick={() => navigate("/terms")} className="hover:text-white transition-colors text-left">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/privacy")} className="hover:text-white transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/aml")} className="hover:text-white transition-colors text-left">
                    AML Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm font-bold">
              © 2024 Cheeseball. All rights reserved.
            </p>
            <div className="flex gap-6">
              <CreditCard className="w-6 h-6 text-gray-600" />
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .reveal {
           opacity: 0;
           transform: translateY(30px);
           transition: all 0.8s ease-out;
        }
        .reveal.active {
           opacity: 1;
           transform: translateY(0);
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
