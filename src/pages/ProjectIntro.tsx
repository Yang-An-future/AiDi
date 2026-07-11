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
          <div className="h-1.5 w-24 bg-[#F5892E] mx-auto"></div>
        </motion.div>

        <div className="space-y-16">
          {/* Section 1: 三大特色課程領域 */}
          <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-l-[12px] border-[#003366]">
            <h3 className="text-2xl font-bold text-[#003366] flex items-center gap-4 mb-8">
              <BookOpen className="w-8 h-8 text-[#F5892E]" /> 1. 三大特色課程領域
            </h3>
            <p className="text-gray-600 mb-10 leading-relaxed">
              計畫將教學科目精心規劃為三個富有創意的領域，涵蓋基礎學科到前瞻的 AI 科技應用：
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">⛰️</div>
                <h4 className="font-bold text-[#003366] text-lg mb-2">拼讀山海</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">包含國語文、英文、本土語、社會科領域。</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">✨</div>
                <h4 className="font-bold text-[#003366] text-lg mb-2">素養 Fun 星</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">聚焦於閱讀素養與數位素養的培養。</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">☁️</div>
                <h4 className="font-bold text-[#003366] text-lg mb-2">雲上數屋</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">包含數學、程式設計、AI 應用、自然探究等理科與資訊領域。</p>
              </div>
            </div>
          </section>

          {/* Section 2: 深度導入 AI 與數位學習平臺 */}
          <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-r-[12px] border-[#F5892E]">
            <h3 className="text-2xl font-bold text-[#003366] flex items-center gap-4 mb-8">
              <Sparkles className="w-8 h-8 text-[#F5892E]" /> 2. 深度導入 AI 與數位學習平臺
            </h3>
            <div className="space-y-6 text-gray-600">
              <p className="leading-relaxed">
                課程深度結合數位學習工具，大學伴主要採用<span className="font-bold text-[#003366]">「教育部因材網數位學習平臺」</span>，並搭配「知識節點星空圖」與「AI 學習夥伴」輔助教學。
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>透過智慧適性診斷追蹤學習成效。</li>
                <li>引導學生運用生成式 AI 等資源進行學習。</li>
              </ul>
            </div>
          </section>

          {/* Section 3: 「一對四」大學伴線上陪伴模式 */}
          <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-l-[12px] border-[#003366]">
            <h3 className="text-2xl font-bold text-[#003366] flex items-center gap-4 mb-8">
              <UserCheck className="w-8 h-8 text-[#F5892E]" /> 3. 「一對四」大學伴線上陪伴模式
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-[#003366] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F5892E] rounded-full"></span> 定時定點
                </h4>
                <p className="text-sm text-gray-500 pl-4">安排於課後時間，每週 2 次，每次 90 分鐘，穩定陪伴國中小學生（3 至 9 年級）學習。</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-[#003366] flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F5892E] rounded-full"></span> 小班式分組
                </h4>
                <p className="text-sm text-gray-500 pl-4">原則上採 1 位大學伴對 4 位小學伴的線上模式，提供即時的資訊應用與學習諮詢。</p>
              </div>
            </div>
          </section>

          {/* Section 4: 著重自主學習與多元教學法 */}
          <section className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-r-[12px] border-[#F5892E]">
            <h3 className="text-2xl font-bold text-[#003366] flex items-center gap-4 mb-8">
              <Target className="w-8 h-8 text-[#F5892E]" /> 4. 著重自主學習與多元教學法
            </h3>
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                最終目標讓學生透過目標設定、執行與檢核，培養出<span className="font-bold text-[#003366]">「數位自主學習能力」</span>。
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                <h4 className="font-bold text-[#003366] text-sm mb-3">創新教材教法：</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm">PBL 專題式學習</span>
                  <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm">生成式 AI 協作教學</span>
                  <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm">跨學科領域融合</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
