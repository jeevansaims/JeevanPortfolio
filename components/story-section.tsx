"use client"

import { motion, useScroll } from "framer-motion"
import { useRef } from "react"
import { Heart, TrendingDown, Code, Activity, Zap, Target, Award, Globe } from "lucide-react"
import { GlassmorphicCard } from "./glassmorphic-card"

export function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  return (
    <div ref={containerRef} className="relative">
      {/* Chapter 1: The Opening */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* Background continues from hero section - seamless transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
            {/* Optional: Add your dramatic image here when ready */}
            {/* <img
              src="/your-image.jpg"
              alt=""
              className="w-full h-full object-cover opacity-40"
            /> */}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/30 to-black"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 pb-3">
            My Story
          </h2>
          <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
            I'm a third-year M.Sc. student in applied physics and industrial mathematics,<br />
            but that description barely touches who I am or what the last year has done to me.
          </p>
          <div className="mt-12">
            <p className="text-lg text-zinc-400 italic">
              To understand me, you need to know where I started...
            </p>
          </div>
        </motion.div>
      </section>

      {/* Chapter 2: The Collapse */}
      <section className="relative min-h-screen py-32">
        <div className="absolute inset-0 overflow-hidden">
          {/* Smooth gradient transition from previous section */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-zinc-900"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h3 className="text-4xl md:text-6xl font-bold text-red-400 mb-8">
              One year ago, my entire life collapsed from every direction.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: The Physical Collapse */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard>
                <div className="relative aspect-video bg-gradient-to-br from-red-900/20 to-red-950/40 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                  {/* Optional: Add your image here when ready */}
                  <img
                    src="/holter2.png"
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-8 h-8 text-red-400" />
                  <h4 className="text-2xl font-bold text-red-400">Physical Collapse</h4>
                </div>
                <p className="text-lg text-zinc-300 leading-relaxed mb-4">
                  I was a competitive powerlifter with a clear identity and a future built around strength.
                </p>
                <p className="text-lg text-zinc-300 leading-relaxed mb-4">
                  Then I was diagnosed with <span className="text-red-400 font-semibold">heart failure</span> and my heart was misfiring <span className="text-red-400 font-semibold">20% of the time</span>.
                </p>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  Overnight, the one thing I trusted, my body, stopped cooperating.
                </p>
              </GlassmorphicCard>
            </motion.div>

            {/* Right: The Financial Collapse */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard>
                <div className="relative aspect-video bg-gradient-to-br from-red-900/20 to-red-950/40 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                  {/* Optional: Add your trading image here when ready */}
                  <img
                    src="/pnl.png"
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />

                </div>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="w-8 h-8 text-red-400" />
                  <h4 className="text-2xl font-bold text-red-400">Financial Collapse</h4>
                </div>
                <p className="text-lg text-zinc-300 leading-relaxed mb-4">
                  At the exact same time, I blew my entire trading account.
                </p>
                <p className="text-lg text-zinc-300 leading-relaxed mb-4">
                  Trading and mathematics were always passions of mine, my escape, my curiosity. But I wasn't disciplined. I traded emotionally, recklessly, without the mathematical rigor I knew I was capable of.
                </p>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  So in the same months my heart collapsed, my finances did too.
                </p>
              </GlassmorphicCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Rock Bottom */}
      <section className="relative min-h-screen flex items-center justify-center py-32">
        <div className="absolute inset-0 bg-black">
          {/* Optional: Add a subtle texture or image here when ready */}
          {/* <div className="absolute inset-0 opacity-10">
            <img
              src="/your-image.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div> */}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <div className="space-y-6 mb-12">
            <p className="text-3xl md:text-4xl font-light text-zinc-500 line-through">No strength.</p>
            <p className="text-3xl md:text-4xl font-light text-zinc-500 line-through">No stability.</p>
            <p className="text-3xl md:text-4xl font-light text-zinc-500 line-through">No control.</p>
            <p className="text-3xl md:text-4xl font-light text-zinc-500 line-through">No identity.</p>
          </div>

          <p className="text-2xl md:text-3xl text-zinc-400 mb-8">This was my rock bottom.</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600 pb-3">
              And rock bottom is where I rebuilt myself.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Chapter 4: The Rebuild */}
      <section className="relative py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h3 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600 mb-8">
              The Rebuild
            </h3>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              I didn't reinvent myself by choice. I did it because there was no other option left.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-lg text-zinc-300">While my heart was misfiring,</p>
                  <p className="text-xl font-bold text-white mt-2">I was studying.</p>
                </div>
              </GlassmorphicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard>
                <div className="text-center">
                  <Activity className="w-12 h-12 text-phthalo-400 mx-auto mb-4" />
                  <p className="text-lg text-zinc-300">While I couldn't train,</p>
                  <p className="text-xl font-bold text-white mt-2">I was learning to code.</p>
                </div>
              </GlassmorphicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GlassmorphicCard>
                <div className="text-center">
                  <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-lg text-zinc-300">While I lost money,</p>
                  <p className="text-xl font-bold text-white mt-2">I promised discipline.</p>
                </div>
              </GlassmorphicCard>
            </motion.div>
          </div>

          {/* ECG Project Story */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassmorphicCard>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="w-10 h-10 text-phthalo-400" />
                    <h4 className="text-3xl font-bold text-phthalo-400">Built Out of Survival</h4>
                  </div>
                  <p className="text-lg text-zinc-300 leading-relaxed mb-4">
                    I taught myself full-stack development and machine learning out of survival, not ambition.
                  </p>
                  <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                    I needed a way to train safely with a failing heart, so I built one. Line by line, with no prior experience, I created a real-time ECG workout system:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-phthalo-400 rounded-full"></div>
                      <span className="text-zinc-300">Arrhythmia detection</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-phthalo-400 rounded-full"></div>
                      <span className="text-zinc-300">PVC classification</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-phthalo-400 rounded-full"></div>
                      <span className="text-zinc-300">Polar H10 integration</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-phthalo-400 rounded-full"></div>
                      <span className="text-zinc-300">Live workout alerts</span>
                    </li>
                  </ul>
                  <p className="text-lg text-phthalo-300 italic">
                    I watched my arrhythmias in real-time while debugging the code that kept me safe.
                  </p>
                </div>

                <div className="relative">
                  {/* ECG app screenshot - add your actual screenshot here */}
                  <div className="relative aspect-square bg-gradient-to-br from-phthalo-900/20 to-phthalo-950/40 rounded-xl overflow-hidden border border-phthalo-500/20 flex items-center justify-center">
                    {/* Uncomment and add your ECG app screenshot */}
                    <img
                      src="/ecg_app.png"
                      alt=""
                      className="w-full h-full object-cover opacity-80"
                    />
                    <Activity className="w-32 h-32 text-phthalo-400 opacity-30" />
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </section>

      {/* Chapter 5: The Explosion */}
      <section className="relative py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h3 className="text-4xl md:text-6xl font-bold mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Then everything exploded.
              </span>
            </h3>
            <p className="text-xl text-zinc-300">Within months...</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                from: "Zero coding experience",
                to: "Advanced AI & Medical-Tech Systems",
                description: "Built a real-time ECG monitoring system with arrhythmia detection from scratch",
                icon: Code
              },
              {
                from: "Financially wrecked",
                to: "Full-Stack Quant Engineering",
                description: "Mastered portfolio optimization, backtesting frameworks, and algorithmic trading",
                icon: TrendingDown
              },
              {
                from: "No network",
                to: "Hacker Houses Across Continents",
                description: "Connected with founders from Dubai, France, and the US in collaborative tech spaces",
                icon: Zap
              },
              {
                from: "Anonymity",
                to: "Y Combinator Private Events",
                description: "Invited to exclusive YC gatherings based on work and reputation",
                icon: Award
              },
              {
                from: "Self-doubt",
                to: "Jane Street Portal",
                description: "Selected by one of the world's top quantitative trading firms",
                icon: Target
              },
              {
                from: "Independent Builder",
                to: "Hedge Funds & Top AI Companies",
                description: "My work attracted attention from quantitative firms and leading AI startups, opening unexpected doors into elite ecosystems.",
                icon: Globe
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassmorphicCard>
                  <div className="flex flex-col p-6 h-full min-h-[240px]">
                    {/* Icon and From State */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-zinc-600" />
                      </div>
                      <p className="text-xs text-zinc-600 line-through uppercase tracking-wider font-medium">
                        {item.from}
                      </p>
                    </div>

                    {/* Visual separator with glow */}
                    <div className="relative h-px bg-gradient-to-r from-transparent via-phthalo-500/50 to-transparent mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-phthalo-500/30 to-transparent blur-sm"></div>
                    </div>

                    {/* To State - Emphasized */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-phthalo-500 to-phthalo-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-phthalo-500/20">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white leading-tight">
                          {item.to}
                        </h4>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-zinc-400 leading-relaxed mt-auto">
                      {item.description}
                    </p>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>

          {/* Special 10M+ Views Card - Centered Below */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <GlassmorphicCard>
              <div className="p-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="hidden md:flex w-16 h-16 rounded-xl bg-gradient-to-br from-phthalo-500 to-phthalo-700 items-center justify-center shadow-lg shadow-phthalo-500/30">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600 text-center">
                    10M+ Views & 70K Followers
                  </h4>
                </div>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  Generated over 10 million views and gained 70,000 followers in just 3 months by documenting my journey publicly with transparent storytelling.
                </p>
              </div>
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-xl text-zinc-300 italic">
              None of this came from privilege or background.<br />
              <span className="text-phthalo-400 font-semibold">It came from building.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chapter 6: Today */}
      <section className="relative py-32">
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h3 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600 mb-8 pb-3">
              Today
            </h3>
            <p className="text-2xl text-zinc-300">
              I work at the intersection of mathematics, engineering, health, and finance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* Health Focus */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div className="h-full">
                <GlassmorphicCard  className="h-full">
                  <div className="flex flex-col h-full">
                  <div className="relative aspect-video bg-gradient-to-br from-red-900/20 to-red-950/40 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                    {/* Optional: Add health tech image */}
                    <img
                      src="/ecg_app_2.png"
                      alt=""
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-red-400" />
                    <h4 className="text-2xl font-bold text-red-400">In Health</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <span className="text-zinc-300">Real-time ECG analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <span className="text-zinc-300">PVC pattern detection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <span className="text-zinc-300">Medical safety systems</span>
                    </li>
                  </ul>
                </div>
              </GlassmorphicCard>
              </div>
            </motion.div>

            {/* Finance Focus */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div className="h-full">
                <GlassmorphicCard className="h-full">
                  <div className="flex flex-col h-full">
                  <div className="relative aspect-video bg-gradient-to-br from-phthalo-900/20 to-phthalo-950/40 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
                    {/* Optional: Add quant/finance image */}
                    <img
                      src="/trade.png"
                      alt=""
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-8 h-8 text-phthalo-400" />
                    <h4 className="text-2xl font-bold text-phthalo-400">In Finance</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-phthalo-400 rounded-full mt-2"></div>
                      <span className="text-zinc-300">Cardinality-constrained portfolio optimization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-phthalo-400 rounded-full mt-2"></div>
                      <span className="text-zinc-300">High-frequency crypto strategy research</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-phthalo-400 rounded-full mt-2"></div>
                      <span className="text-zinc-300">AI-driven trading analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-phthalo-400 rounded-full mt-2"></div>
                      <span className="text-zinc-300">Full-stack quant engineering</span>
                    </li>
                  </ul>
                </div>
              </GlassmorphicCard>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <GlassmorphicCard>
              <p className="text-xl text-zinc-300 text-center leading-relaxed">
                I blew my trading account, but instead of quitting, I decided to master the mathematics behind markets.<br />
                <span className="text-phthalo-400 font-semibold">I didn't want trading to be impulsive anymore, I wanted it to be engineered.</span>
              </p>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </section>

      {/* Chapter 7: The Drive */}
      <section className="relative min-h-screen flex items-center justify-center py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black">
            {/* Optional: Add a powerful image of you working/training */}
            {/* <img
              src="/your-driven-image.jpg"
              alt=""
              className="w-full h-full object-cover opacity-20"
            /> */}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto px-6"
        >
          <GlassmorphicCard>
            <div className="text-center space-y-6 p-8">
              <p className="text-2xl md:text-3xl text-zinc-300 leading-relaxed">
                But the truth is: <span className="text-white font-semibold">I'm not driven by prestige or career paths.</span>
              </p>
              <div className="space-y-4 text-xl text-zinc-400 italic">
                <p>I'm driven by the memory of rock bottom,</p>
                <p>the moment when everything I relied on failed me,</p>
                <p>and I had to rebuild myself using nothing but curiosity, discipline, and faith.</p>
              </div>
              <div className="pt-8 space-y-4 text-xl text-zinc-300">
                <p>I build because building is how I stay alive.</p>
                <p>I learn because my mind replaced what my body could no longer do.</p>
                <p>I trade with mathematics because pain taught me the cost of emotion.</p>
                <p>I push forward because I promised myself I would not waste the second chance I was given.</p>
              </div>
            </div>
          </GlassmorphicCard>
        </motion.div>
      </section>

      {/* Chapter 8: Final Statement */}
      <section className="relative py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-phthalo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <div className="mb-8">
            <p className="text-2xl md:text-3xl text-phthalo-400 font-semibold mb-4">
              If I had to describe myself in one sentence:
            </p>
          </div>

          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-300 to-phthalo-400">
              I'm someone who had his entire identity destroyed, physically, financially, and emotionally,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
              and rebuilt something stronger, smarter, and more purposeful in its place.
            </span>
          </h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-phthalo-400"
          >
            And I'm just getting started.
          </motion.p>
        </motion.div>
      </section>
    </div>
  )
}
