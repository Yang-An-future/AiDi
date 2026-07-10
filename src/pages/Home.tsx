import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CalendarClock, School, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../hooks/useFirestore';
import type { Announcement, CourseAnnouncement, ReviewEntry, PartnerSchool } from '../types/content';

const carouselImages = [
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1920"
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: announcements, loading: announcementsLoading } = useFirestoreCollection<Announcement>('announcements');
  const { data: courses, loading: coursesLoading } = useFirestoreCollection<CourseAnnouncement>('courses');
  const { data: reviews } = useFirestoreCollection<ReviewEntry>('reviews');
  const { data: schools } = useFirestoreCollection<PartnerSchool>('schools');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Carousel */}
      <section className="relative h-64 md:h-[500px] overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={carouselImages[currentSlide]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center md:items-start text-center md:text-left text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold font-serif mb-4 leading-tight">AI Di+ 實驗方案計劃</h2>
            <div className="h-1.5 w-24 bg-[#C5A059] mb-6"></div>
            <p className="text-lg md:text-2xl text-gray-200 max-w-2xl font-light">
              「AI 加成」數位學伴：引領偏鄉教育邁向智慧新世代
            </p>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-[#C5A059] w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 w-full -mt-10 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* 2. Latest Announcements & 3. Course Announcements */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {/* Latest Announcements */}
          <section className="bg-white rounded-xl shadow-xl p-8 border-t-8 border-[#003366]">
            <h3 className="text-xl font-bold text-[#003366] flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-[#C5A059]" /> 最新公告
            </h3>
            <div className="space-y-4">
              {!announcementsLoading && announcements.length === 0 && (
                <p className="text-sm text-gray-400 italic">目前尚無公告。</p>
              )}
              {announcements.slice(0, 3).map((item) => (
                <div key={item.id} className="group flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                  <div className="text-xs font-mono text-gray-400 mt-1">{item.date}</div>
                  <div>
                    <h4 className="font-bold text-gray-800 group-hover:text-[#003366] transition-colors line-clamp-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 italic">{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Course Announcements */}
          <section className="bg-white rounded-xl shadow-xl p-8 border-t-8 border-[#C5A059]">
            <h3 className="text-xl font-bold text-[#003366] flex items-center gap-3 mb-6">
              <CalendarClock className="w-5 h-5 text-[#C5A059]" /> 課程公告
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!coursesLoading && courses.length === 0 && (
                <p className="text-sm text-gray-400 italic sm:col-span-2">目前尚無課程公告。</p>
              )}
              {courses.map((item) => (
                <div key={item.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-[#C5A059] transition-all group">
                  <span className="text-[10px] bg-[#003366] text-white px-2 py-0.5 rounded-full mb-3 inline-block">{item.tag}</span>
                  <h4 className="font-bold text-gray-800 group-hover:text-[#003366]">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-2">地點：{item.location}</p>
                  <p className="text-xs text-[#C5A059] mt-1 font-semibold">時間：{item.time}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Project Execution Review */}
          <section>
            <h3 className="text-2xl font-bold text-[#003366] mb-8 flex items-center gap-4">
              <div className="w-8 h-1 bg-[#C5A059]"></div>
              計畫執行回顧
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <Link to={`/review/${rev.id}`} key={rev.id} className="group overflow-hidden rounded-2xl shadow-lg bg-white block border border-slate-100">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={rev.imgUrl}
                      alt={rev.year}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-[#003366] transition-colors">{rev.year}</h4>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">
                      查看回顧 <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* 5. Partner Schools (Sidebar Style) */}
        <div className="md:col-span-4">
          <section className="bg-white rounded-xl shadow-lg p-8 sticky top-24 border-l-4 border-[#003366]">
            <h3 className="text-xl font-bold text-[#003366] flex items-center gap-3 mb-8">
              <School className="w-6 h-6 text-[#C5A059]" /> 合作學校
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {schools.map((school) => (
                <div key={school.id} className="flex flex-col items-center group cursor-default">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-2 mb-3 shadow-inner group-hover:border-[#C5A059] transition-colors">
                    <img src={school.logoUrl} alt={school.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 text-center group-hover:text-[#003366] transition-colors">{school.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
              <p className="text-sm text-gray-500 italic">更多合作夥伴積極洽談中...</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
