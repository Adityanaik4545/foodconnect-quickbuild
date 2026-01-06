"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Utensils, 
  Users, 
  Truck, 
  Clock,
} from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
          <Image src="/assets/logo/foodconnect_main.png" height={200} width={200} alt='logo'/>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/register">
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className={`font-semibold transition-colors ${scrolled ? 'text-emerald-600 hover:text-emerald-700' : 'text-white hover:text-emerald-200'}`}>
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`${scrolled ? 'text-gray-800' : 'text-white'}`}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 animate-fadeIn">
          {['Home', 'About Us'].map((item) => (
            <a key={item} href="#" className="text-gray-700 font-medium hover:text-emerald-600 block py-2 border-b border-gray-100">
              {item}
            </a>
          ))}
          <div className="flex flex-col space-y-3 pt-2">
            <Link href="/register">
              <button className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700">
                Donate Food
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full text-emerald-600 font-semibold py-2 hover:bg-emerald-50 rounded-xl">
                Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80"
          alt="Community sharing food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-gray-900/90 via-gray-900/70 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl lg:text-7xl font-bold font-poppins leading-tight mb-6">
            Share a Meal, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">
              Share Hope.
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Bridge the gap between surplus food and hunger. Connect with local communities to reduce waste and feed those in need efficiently and transparently.
          </p>
          
        </div>
      </div>
    </div>
  );
};



const FeatureCard = ({ title, description, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
      <Icon className="h-7 w-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-emerald-600 font-semibold tracking-wide uppercase mb-3">Process</h2>
          <h2 className="text-4xl font-bold text-gray-900 font-poppins mb-6">How FoodConnect Works</h2>
          <p className="text-lg text-gray-600">We've made the process of donating excess food simple, fast, and transparent. Join the movement in three easy steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="1. List Food" 
            description="Enter details about the food type, quantity, and pickup location. It takes less than 2 minutes to post a donation."
            icon={Utensils}
            color="bg-orange-500"
          />
          <FeatureCard 
            title="2. We Match" 
            description="Our smart algorithm instantly notifies nearby verified NGOs and volunteers who need food urgently."
            icon={Users}
            color="bg-emerald-500"
          />
          <FeatureCard 
            title="3. Pickup & Drop" 
            description="Volunteers or NGO partners collect the food from your doorstep and distribute it to those in need."
            icon={Truck}
            color="bg-blue-500"
          />
        </div>
      </div>
    </section>
  );
};

const RecentDonations = () => {
  const donations = [
    { title: "50kg Rice Bags", donor: "Grand Hotel", time: "2 hours ago", location: "Downtown", status: "Collected" },
    { title: "Surplus Bakery Items", donor: "Sweet Treats", time: "15 mins ago", location: "Westside", status: "Active" },
    { title: "Wedding Event Surplus", donor: "John Doe", time: "Just now", location: "Convention Center", status: "Active" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-center">
        <div className="lg:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80" 
            alt="Food distribution" 
            className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
          />
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold text-gray-900 font-poppins mb-6">Live Impact Feed</h2>
          <p className="text-lg text-gray-600 mb-8">Real-time updates on donations happening in your area. See the immediate impact of our community.</p>
          
          <div className="space-y-4">
            {donations.map((item, idx) => (
              <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-emerald-50/50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-600 font-bold text-xl">
                  {item.title.charAt(0)}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <div className="flex text-sm text-gray-500 gap-3 mt-1">
                    <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {item.donor}</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {item.time}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <Link href="/register">
            <button className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
              View All Donations
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-20 bg-emerald-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-900/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white font-poppins mb-6">Ready to make a difference?</h2>
        <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
          Whether you are a restaurant with surplus food or a volunteer looking to help, there is a place for you in our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <button className="bg-white text-emerald-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl">
              Register as Sharer
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-800 transition-colors shadow-xl border border-emerald-500">
              Join as Seeker
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Image src="/assets/logo/foodconnect_main.png" height={200} width={200} alt='logo' />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Connecting surplus food with communities in need. Building a world with zero hunger and zero waste.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 font-poppins">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Safety Standards</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-poppins">Get Involved</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Donate Food</Link></li>
              <li><Link href="/register" className="hover:text-emerald-400 transition-colors">Request Food</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FoodConnect Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="font-sans antialiased text-gray-900 bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>
      
      <Navbar />
      <Hero />
      <HowItWorks />
      <RecentDonations />
      <CTA />
      <Footer />
    </div>
  );
}
