import React from 'react';
import { motion } from 'motion/react';
import { Users, User, ShieldCheck, Mail, Briefcase } from 'lucide-react';
import { useFirestoreCollection, useFirestoreDoc } from '../hooks/useFirestore';
import type { Assistant, PrincipalInvestigator } from '../types/content';

const fallbackPI: PrincipalInvestigator = {
  name: '尚未設定',
  title: '計畫主持人',
  affiliation: '國立屏東大學',
  bio: '',
  email: '',
};

export default function ProjectOrg() {
  const { data: pi } = useFirestoreDoc<PrincipalInvestigator>('org/principalInvestigator');
  const { data: assistants } = useFirestoreCollection<Assistant>('assistants');
  const principalInvestigator = pi ?? fallbackPI;

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-16"
        >
          <span className="text-[#C5A059] font-bold tracking-[0.3em] text-sm uppercase block mb-2">Internal Structure</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] font-serif mb-4">計畫組織</h2>
          <div className="h-1.5 w-24 bg-[#003366] mx-auto mb-4"></div>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">由國立屏東大學專業教育團隊主導，結合學術研究與數位科技實踐。</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Principal Investigator */}
          <div className="lg:col-span-5">
            <div className="bg-[#003366] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
              <ShieldCheck className="w-12 h-12 text-[#C5A059] mb-8" />
              <h3 className="text-sm font-bold tracking-widest text-blue-300 uppercase mb-2">Principal Investigator</h3>
              <h4 className="text-3xl font-bold mb-4 font-serif">{principalInvestigator.name}</h4>
              <div className="flex items-center gap-2 text-blue-200 text-sm mb-8 italic">
                <Briefcase className="w-4 h-4" /> {principalInvestigator.affiliation} {principalInvestigator.title}
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-10 opacity-80">
                {principalInvestigator.bio}
              </p>
              {principalInvestigator.email && (
                <a href={`mailto:${principalInvestigator.email}`} className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full text-xs font-bold transition-all backdrop-blur-sm">
                  <Mail className="w-4 h-4" /> 聯繫主持人
                </a>
              )}
            </div>
          </div>

          {/* Full-time Assistants */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
               <h3 className="text-xl font-bold text-[#003366] mb-8 flex items-center gap-3">
                <Users className="w-6 h-6 text-[#C5A059]" /> 專任助理團隊
              </h3>
              
              <div className="space-y-4">
                {assistants.length === 0 && (
                  <p className="text-sm text-gray-400 italic">尚未設定助理成員。</p>
                )}
                {assistants.map((assistant) => (
                  <div key={assistant.id} className="flex gap-6 p-6 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-[#C5A059]/10 group-hover:text-[#C5A059] transition-all">
                      <User className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h5 className="font-bold text-gray-800 text-lg">{assistant.name}</h5>
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full uppercase tracking-tighter">Full-time</span>
                      </div>
                      <p className="text-[#003366] font-bold text-xs mb-2">{assistant.role}</p>
                      <p className="text-xs text-gray-500 leading-relaxed italic">{assistant.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-100/50 rounded-[2rem] p-8 border border-dashed border-slate-300 text-center">
              <p className="text-xs text-gray-400 font-medium">兼任助理與大學伴團隊支援</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
