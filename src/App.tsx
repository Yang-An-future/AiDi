import React from 'react';
import { BookOpen, Users, Rocket, Upload, Phone, Mail, MapPin, ChevronRight, FileUp, Sparkles, MessageSquare, MonitorSmartphone, School, Image } from 'lucide-react';

export default function App() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#003366] border-b-4 border-[#C5A059] text-white shadow-md px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#003366] font-bold text-xl">AI+</span>
              </div>
              <div>
                <h1 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-0.5">AI Di+ 實驗方案計劃</h1>
                <p className="text-[#C5A059] text-[10px] md:text-xs uppercase tracking-widest font-semibold hidden sm:block">National Pingtung University • Academic Excellence</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-white text-sm font-medium">
              <button onClick={() => scrollToSection('schools')} className="whitespace-nowrap opacity-70 hover:opacity-100 hover:border-b-2 hover:border-[#C5A059] transition-all pb-1 border-b-2 border-transparent">教學領域</button>
              <button onClick={() => scrollToSection('highlights')} className="whitespace-nowrap opacity-70 hover:opacity-100 hover:border-b-2 hover:border-[#C5A059] transition-all pb-1 border-b-2 border-transparent">活動花絮</button>
              <button onClick={() => scrollToSection('team')} className="whitespace-nowrap opacity-70 hover:opacity-100 hover:border-b-2 hover:border-[#C5A059] transition-all pb-1 border-b-2 border-transparent">團隊模式</button>
              <button onClick={() => scrollToSection('future')} className="whitespace-nowrap opacity-70 hover:opacity-100 hover:border-b-2 hover:border-[#C5A059] transition-all pb-1 border-b-2 border-transparent">計畫目標</button>
              <button onClick={() => scrollToSection('upload')} className="whitespace-nowrap opacity-70 hover:opacity-100 hover:border-b-2 hover:border-[#C5A059] transition-all pb-1 border-b-2 border-transparent">資料上傳</button>
              <button className="ml-2 px-4 py-2 bg-[#C5A059] text-[#003366] rounded hover:bg-[#b08e4e] transition-colors font-bold shadow-sm whitespace-nowrap">計畫工作坊</button>
            </div>
            {/* Mobile Menu Button (simplified) */}
            <div className="lg:hidden">
              <button className="text-xs font-semibold px-3 py-2 bg-[#C5A059] text-[#003366] rounded-md transition-colors hover:bg-[#b08e4e] whitespace-nowrap">工作坊</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 lg:h-96 bg-[#002244] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="University Campus Background" 
            className="w-full h-full object-cover opacity-10 mix-blend-overlay"
          />
        </div>
        
        <div className="relative w-full max-w-7xl mx-auto px-8 z-10 text-center md:text-left flex flex-col items-center md:items-start justify-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-white font-serif italic mb-4 tracking-tight">115-116 年 AI Di+ 實驗方案</h2>
            <div className="h-1.5 md:h-2 w-24 md:w-32 bg-[#C5A059] mt-2 mb-6 shadow-[0_0_15px_rgba(197,160,89,0.5)]"></div>
            <p className="text-base md:text-xl text-gray-300 max-w-2xl leading-relaxed mt-4 font-light">
              教育部數位學伴計畫（AI 加成模式）：透過「大學伴」線上引導，提升偏鄉學生 AI 數位素養，落實數位共融與適性學習。
            </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="grid grid-cols-1 md:grid-cols-12 max-w-7xl mx-auto gap-6 p-6 w-full">
        
        {/* Left Column: Educational Content & Future Outlook */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Partner Schools / Subjects Section */}
          <section id="schools">
            <div className="bg-white p-6 md:p-8 border-l-4 border-[#003366] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[#003366] font-bold text-xl border-b pb-3 mb-4 flex items-center">
                <span className="mr-3 p-2 bg-[#003366]/5 rounded-lg"><School className="w-5 h-5 text-[#003366]" /></span> 
                服務對象與領域
              </h3>
              <p className="text-xs text-gray-500 mb-4">計畫重點：縮減偏鄉數位落差，針對中小學 3-9 年級開發適性教材。</p>
              <div className="space-y-4">
                <div className="flex flex-col border-b border-slate-50 pb-2">
                  <span className="font-bold text-sm text-[#003366]">拼讀山海</span>
                  <span className="text-[11px] text-gray-500">國語文、英文、本土語、社會科</span>
                </div>
                <div className="flex flex-col border-b border-slate-50 pb-2">
                  <span className="font-bold text-sm text-[#003366]">素養 Fun 星</span>
                  <span className="text-[11px] text-gray-500">閱讀素養、數位素養 (Digital Literacy)</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#003366]">雲上數屋</span>
                  <span className="text-[11px] text-gray-500">數學、程式設計、AI 應用、自然探究</span>
                </div>
              </div>
            </div>
          </section>

          {/* Event Highlights Section */}
          <section id="highlights">
            <div className="bg-white p-6 md:p-8 border-l-4 border-[#C5A059] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-[#003366] font-bold text-xl border-b pb-3 mb-4 flex items-center">
                <span className="mr-3 p-2 bg-[#C5A059]/10 rounded-lg"><Image className="w-5 h-5 text-[#C5A059]" /></span> 
                計畫執行剪影
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-video bg-slate-200 rounded-md overflow-hidden relative group cursor-pointer">
                   <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80" alt="大學伴研習" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="aspect-video bg-slate-200 rounded-md overflow-hidden relative group cursor-pointer">
                   <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80" alt="偏鄉互動" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">培訓大專生運用資訊工具與 AI 資源導入教學。</p>
            </div>
          </section>
        </div>

        {/* Middle Column: Team Members */}
        <div className="md:col-span-4 flex flex-col">
          <section id="team" className="h-full">
              <div className="bg-white p-6 md:p-8 border-t-4 border-[#003366] shadow-sm h-full">
                <h3 className="text-[#003366] font-bold text-xl border-b pb-3 mb-6 flex items-center">
                  <span className="mr-3"><Users className="w-5 h-5 text-[#003366]" /></span> 
                  計畫執行核心
                </h3>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-100 transition-colors hover:bg-slate-100 hover:border-slate-200">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded flex-shrink-0 flex items-center justify-center font-bold text-[#003366]">HOST</div>
                  <div>
                    <p className="font-bold text-gray-800 flex flex-wrap items-center gap-1">林青穎 博士 <span className="text-[10px] font-normal bg-blue-100 text-[#003366] px-2 py-0.5 rounded-full">計畫主持人</span></p>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      負責大學端與學習端媒合、師培品質管理與研究成效分析。
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-100 transition-colors hover:bg-slate-100 hover:border-slate-200">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded flex-shrink-0 flex items-center justify-center text-[#C5A059]"><Users className="w-6 h-6" /></div>
                  <div>
                    <p className="font-bold text-gray-800">大學伴團隊 <span className="text-[10px] font-normal bg-amber-100 text-[#b38b42] px-2 py-0.5 rounded-full ml-1">數位師資</span></p>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      招募優質大專生，經 12 小時以上專業研習與 AI 工具培訓後投入教學。
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-100 transition-colors hover:bg-slate-100 hover:border-slate-200">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded flex-shrink-0 flex items-center justify-center text-slate-400"><School className="w-6 h-6" /></div>
                  <div>
                    <p className="font-bold text-gray-800">國中小學習端 <span className="text-[10px] font-normal bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full ml-1">合作夥伴</span></p>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      協助 3 至 9 年級學生使用教育部因材網平臺及 AI 夥伴輔助學習。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Data Upload Form */}
        <div className="md:col-span-4 flex flex-col">
          <section id="future" className="mb-6">
              <div className="bg-white p-6 md:p-8 border-l-4 border-[#C5A059] shadow-sm">
                <h3 className="text-[#003366] font-bold text-xl border-b pb-3 mb-4 flex items-center">
                  <span className="mr-3"><Rocket className="w-5 h-5 text-[#C5A059]" /></span> 
                  計畫目標
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <div className="text-[#C5A059] mt-1 font-bold">01</div>
                    <p className="text-xs md:text-sm text-gray-600">縮減城鄉數位落差，提升 AI 工具應用能力。</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="text-[#C5A059] mt-1 font-bold">02</div>
                    <p className="text-xs md:text-sm text-gray-600">培育大學伴數位教學能力與服務關懷精神。</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="text-[#C5A059] mt-1 font-bold">03</div>
                    <p className="text-xs md:text-sm text-gray-600">結合生成式 AI 加成數位學伴模式，落實自主學習。</p>
                  </li>
                </ul>
              </div>
          </section>

          <section id="upload" className="flex-1">
              <div className="bg-[#003366] text-white p-6 md:p-8 rounded-sm shadow-lg h-full">
                <h3 className="text-[#C5A059] font-bold text-xl border-b border-blue-800 pb-3 mb-6 flex items-center">
                  <span className="mr-3"><Upload className="w-5 h-5 text-[#C5A059]" /></span>
                  成果與日誌上傳
                </h3>

                <form className="flex flex-col gap-5 h-[calc(100%-3rem)]" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label htmlFor="title" className="block text-[11px] uppercase tracking-wider font-bold text-blue-300 mb-2">資料標題</label>
                    <input 
                      type="text" 
                      id="title" 
                      className="w-full bg-[#002244] border border-blue-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-blue-800" 
                      placeholder="請輸入檔案名稱..."
                      required
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <label htmlFor="details" className="block text-[11px] uppercase tracking-wider font-bold text-blue-300 mb-2">詳細內容說明</label>
                    <textarea 
                      id="details" 
                      rows={8} 
                      className="w-full flex-1 bg-[#002244] border border-blue-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] transition-colors resize-none placeholder:text-blue-800" 
                      placeholder="請簡述上傳內容..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mt-auto">
                      <div className="relative group">
                         <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            multiple
                         />
                         <button type="button" className="w-full bg-[#C5A059] hover:bg-[#b08e4e] text-[#003366] font-bold py-3 md:py-4 rounded flex items-center justify-center gap-2 transition-colors relative pointer-events-none">
                           <FileUp className="w-5 h-5" /> 選擇檔案並上傳
                         </button>
                      </div>
                      <p className="text-[11px] text-blue-400 mt-3 text-center">支援 PDF, JPG, PNG (最大 10MB)</p>
                  </div>
                </form>
              </div>
          </section>
        </div>

      </main>

      {/* Footer Section */}
      <footer id="contact" className="bg-slate-100 border-t border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <div className="text-xs md:text-[13px] text-slate-500 leading-relaxed md:leading-loose">
              <p className="font-bold text-slate-700 text-sm md:text-base mb-1">計劃主持人：林青穎 博士</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><Phone className="w-3.5 h-3.5" /> 聯絡電話：(08) 766-3800 #1234</p>
            </div>
            
            <div className="text-center order-first md:order-none">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href="mailto:program-admin@nptu.edu.tw" className="text-xs md:text-[13px] text-slate-500 underline hover:text-[#003366] transition-colors">program-admin@nptu.edu.tw</a>
              </div>
              <p className="text-[10px] md:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">AI Di+ Educational Research Project</p>
            </div>
            
            <div className="text-xs md:text-[13px] text-slate-500 leading-relaxed md:leading-loose md:text-right">
              <p className="flex items-center justify-center md:justify-end gap-2 mb-1"><MapPin className="w-3.5 h-3.5" /> 計劃中心地址：</p>
              <p>900 屏東縣屏東市民生路4-18號</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

