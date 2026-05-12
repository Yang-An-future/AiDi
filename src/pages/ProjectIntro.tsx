import React from 'react';
import { motion } from 'motion/react';
import { Target, Flag, BookOpen, UserCheck, Sparkles } from 'lucide-react';

export default function ProjectIntro() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] font-serif mb-4 italic">計畫介紹</h2>
          <div className="h-1.5 w-24 bg-[#C5A059] mx-auto"></div>
        </motion.div>

        <div className="space-y-16">
          {/* Section: Service Target & Domains */}
          <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-l-[12px] border-[#003366]">
            <h3 className="text-2xl font-bold text-[#003366] flex items-center gap-4 mb-8">
              <BookOpen className="w-8 h-8 text-[#C5A059]" /> 服務對象與領域
            </h3>
            <p className="text-gray-600 mb-10 leading-relaxed italic">
              本計畫旨在縮減城鄉數位落差，主要對象為偏遠地區國民中小學 3 至 9 年級學生。透過一對四線上數位學習，激發學習興趣並培養自主學習能力。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">⛰️</div>
                <h4 className="font-bold text-[#003366] text-lg mb-2">拼讀山海</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">國語文、英文、本土語、社會領域。讓語言與文化在山海間交織。</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">✨</div>
                <h4 className="font-bold text-[#003366] text-lg mb-2">素養 Fun 星</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">閱讀素養、數位素養。在資訊爆炸時代，培育辨識與運用的核心能力。</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">☁️</div>
                <h4 className="font-bold text-[#003366] text-lg mb-2">雲上數屋</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">數學、程式設計、AI 應用、自然探究。運用雲端資源探索科學奧秘。</p>
              </div>
            </div>
          </section>

          {/* Section: Project Goals */}
          <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-r-[12px] border-[#C5A059]">
            <h3 className="text-2xl font-bold text-[#003366] flex items-center justify-end gap-4 mb-10">
              計畫執行目標 <Flag className="w-8 h-8 text-[#C5A059]" />
            </h3>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003366] text-lg">AI 加成、智慧共學</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    引進最新生成式 AI 技術與因材網數位平台，輔助大學伴精準掌握學生進度，提供個人化學習諮詢。
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#003366]">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003366] text-lg">培育優質數位師資</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    完整培育大專校院師培生之數位教學能力、教學管理及數位關懷精神，實踐服務學習能量。
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003366] text-lg">落實數位共融社會</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    整合大專校院行政與教學資源，建立長期數位關懷機制，協助偏鄉地區學子與未來科技軌。
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
