import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#001a33] text-gray-300 border-t border-blue-900/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-5 h-5 text-[#C5A059]" /> 聯絡資訊
            </h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center justify-center md:justify-start gap-2">聯絡人：楊承安</p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-70">電話：</span>(08)766-3800 #14409
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-70">Email：</span>
                <a href="mailto:anselm14409@gmail.com" className="hover:text-[#C5A059] transition-colors underline decoration-blue-800">
                  anselm14409@gmail.com
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-1 bg-[#C5A059]"></div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-gray-400">AI Di+ Educational Project</p>
            <p className="text-[10px] text-gray-500">© 2026 National Pingtung University. All Rights Reserved.</p>
          </div>
          
          <div className="space-y-4 text-center md:text-right">
             <h4 className="text-white font-bold text-lg flex items-center justify-center md:justify-end gap-2">
              <MapPin className="w-5 h-5 text-[#C5A059]" /> 計劃中心
            </h4>
            <div className="text-sm space-y-1">
              <p>900 屏東縣屏東市</p>
              <p>民生路 4-18 號</p>
              <p className="text-xs text-[#C5A059] font-medium pt-2">國立屏東大學</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
