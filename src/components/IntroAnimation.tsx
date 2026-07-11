import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/logo-640.webp';

const SESSION_KEY = 'aidi-intro-shown';

// Timeline constants (seconds), kept in one place because the "+" and the
// persistent glow both need to know exactly when the text finishes sliding in.
const CHAR_BASE_DELAY = 0.3;
const CHAR_STAGGER = 0.07;
const CHAR_DURATION = 0.45;
const AIDI_TEXT = 'AI Di';
const TITLE_TEXT = '實驗方案計劃';
const TEXT_SETTLE_TIME =
  CHAR_BASE_DELAY + (Math.max(AIDI_TEXT.length, TITLE_TEXT.length) - 1) * CHAR_STAGGER + CHAR_DURATION;
const PLUS_DELAY = TEXT_SETTLE_TIME + 0.5;
const PLUS_RISE_DURATION = 0.55;
const PLUS_POP_DURATION = 0.25;
const PLUS_SETTLE_DURATION = 0.35;
const PLUS_TOTAL_DURATION = PLUS_RISE_DURATION + PLUS_POP_DURATION + PLUS_SETTLE_DURATION;
const HALO_START_MS = (PLUS_DELAY + PLUS_TOTAL_DURATION) * 1000;
const HOLD_MS = HALO_START_MS + 650;

function SlideInChars({
  text,
  from,
  charColor,
  className,
}: {
  text: string;
  from: 'left' | 'right';
  charColor?: (index: number) => string | undefined;
  className?: string;
}) {
  const offsetX = from === 'left' ? -90 : 90;
  return (
    <span className={className}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ x: offsetX, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: CHAR_BASE_DELAY + i * CHAR_STAGGER, duration: CHAR_DURATION, ease: 'easeOut' }}
          className="inline-block"
          style={charColor ? { color: charColor(i) } : undefined}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function IntroAnimation() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY));
  const [haloOn, setHaloOn] = useState(false);

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    const haloTimer = setTimeout(() => setHaloOn(true), HALO_START_MS);
    const hideTimer = setTimeout(() => setVisible(false), HOLD_MS);
    return () => {
      clearTimeout(haloTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          onClick={() => setVisible(false)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 md:gap-8 bg-[#003366] cursor-pointer overflow-hidden"
        >
          {/* Rotating gradient glow, echoing the logo's ring */}
          <motion.div
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 0.55 }}
            transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, opacity: { duration: 1 } }}
            className="absolute w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, #2DACE3, #F5892E, #2DACE3)',
              filter: 'blur(70px)',
            }}
          />

          <motion.img
            src={logo}
            alt="AI Di+"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
            className="relative w-28 h-28 md:w-40 md:h-40 rounded-full shadow-2xl"
          />

          {/* Title: "AI Di" flies in from the left one character at a time,
              "實驗方案計劃" from the right, leaving a gap reserved for "+".
              Once both sides settle, "+" waits 0.5s, then spins 360° up into
              place shuriken-style, pops with a flash of glow, settles back to
              size, and keeps glowing softly. */}
          <div className="relative flex flex-wrap items-baseline justify-center gap-x-1 md:gap-x-2 gap-y-1 px-6 max-w-lg md:max-w-3xl text-center">
            <SlideInChars
              text={AIDI_TEXT}
              from="left"
              charColor={(i) => (i <= 1 ? '#2DACE3' : '#F5892E')}
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold whitespace-nowrap"
            />

            <span className="relative inline-block mx-1 md:mx-2">
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full -z-10"
                style={{ background: 'radial-gradient(circle, rgba(245,137,46,0.9) 0%, rgba(245,137,46,0) 70%)' }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={haloOn ? { opacity: [0, 0.9, 0.35, 0.9, 0.35], scale: [0.7, 1.6, 1.2, 1.6, 1.2] } : {}}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                initial={{ y: 90, opacity: 0, rotate: 0, scale: 0.3 }}
                animate={{
                  y: [90, 0, 0, 0],
                  opacity: [0, 1, 1, 1],
                  rotate: [0, 360, 360, 360],
                  scale: [0.3, 1, 1.7, 1],
                  filter: [
                    'drop-shadow(0 0 0px rgba(245,137,46,0))',
                    'drop-shadow(0 0 0px rgba(245,137,46,0))',
                    'drop-shadow(0 0 28px rgba(245,137,46,1))',
                    'drop-shadow(0 0 14px rgba(245,137,46,0.85))',
                  ],
                }}
                transition={{
                  delay: PLUS_DELAY,
                  duration: PLUS_TOTAL_DURATION,
                  times: [0, PLUS_RISE_DURATION / PLUS_TOTAL_DURATION, (PLUS_RISE_DURATION + PLUS_POP_DURATION) / PLUS_TOTAL_DURATION, 1],
                  ease: 'easeOut',
                }}
                className="relative inline-block text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#F5892E]"
              >
                +
              </motion.span>
            </span>

            <SlideInChars
              text={TITLE_TEXT}
              from="right"
              className="text-xl sm:text-2xl md:text-4xl font-bold text-white whitespace-nowrap"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
