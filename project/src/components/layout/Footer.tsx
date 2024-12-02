import React from 'react';
import { Store, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <Store className="h-8 w-8" />
              <span className="text-2xl font-bold">Kwik-E-Mart</span>
            </div>
            <p className="mt-2">Thank you, come again!</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/products" className="hover:text-yellow-400">Products</a></li>
              <li><a href="/offers" className="hover:text-yellow-400">Offers</a></li>
              <li><a href="/about" className="hover:text-yellow-400">About Us</a></li>
              <li><a href="/contact" className="hover:text-yellow-400">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>apu@kwik-e-mart.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>555-123-4567</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Store Hours</h3>
            <p>Open 24/7</p>
            <p className="mt-2">Even during zombie apocalypses!</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-blue-500">
          <p className="text-center">© {new Date().getFullYear()} Kwik-E-Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}