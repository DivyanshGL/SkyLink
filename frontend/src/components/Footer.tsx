import React from 'react';
import { Plane } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-sky-500 p-2 rounded-xl text-white">
                <Plane size={24} className="transform -rotate-45" />
              </div>
              <span className="text-2xl font-bold text-white">SkyLink</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Experience the world with unparalleled comfort and convenience. Your journey begins with a single click.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-sky-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-sky-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Cancellation Options</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Safety Information</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SkyLink Inc. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-500">
            <span>English (US)</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
