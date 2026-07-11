import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '../assets/logo-160.webp';

export default function Footer() {
  return (
    <footer className="bg-[#001a33] text-gray-300 relative">
      <div className="h-1 w-full bg-gradient-to-r from-[#2DACE3] via-[#F5892E] to-[#2DACE3]"></div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-5 h-5 text-[#F5892E]" /> 聯絡資訊
            </h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-center md:justify-start gap-2">聯絡人：楊承安</p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-70">電話：</span>(08)766-3800 #14409
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-70">Email：</span>
                <a href="mailto:anselm14409@gmail.com" className="hover:text-[#F5892E] transition-colors underline decoration-blue-800">
                  anselm14409@gmail.com
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src={logo} alt="AI Di+ Logo" className="w-16 h-16 rounded-full bg-white shadow-md" />
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-gray-400">AI Di+ Educational Project</p>
            <p className="text-[10px] text-gray-500">© 2026 National Pingtung University. All Rights Reserved.</p>
          </div>
          
          <div className="space-y-4 text-center md:text-right">
             <h4 className="text-white font-bold text-lg flex items-center justify-center md:justify-end gap-2">
              <MapPin className="w-5 h-5 text-[#F5892E]" /> 計劃中心
            </h4>
            <div className="text-sm space-y-1">
              <p>900 屏東縣屏東市</p>
              <p>民生路 4-18 號</p>
              <p className="text-xs text-[#F5892E] font-medium pt-2">國立屏東大學</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
