import React from "react";
import { motion } from "framer-motion";
import { HiSparkles, HiBookOpen, HiColorSwatch, HiVolumeUp } from "react-icons/hi";

const AboutSection = () => {
  const steps = [
    {
      icon: <HiSparkles className="text-4xl text-kidYellow" />,
      title: "Imagine",
      desc: "Tell us a name, a place, or a theme. Our AI sprinkles some magic dust to weave a unique story."
    },
    {
      icon: <HiBookOpen className="text-4xl text-kidBlue" />,
      title: "Read & Learn",
      desc: "Every story comes with built-in reading quizzes to help your little one grow while they explore."
    },
    {
      icon: <HiVolumeUp className="text-4xl text-kidPink" />,
      title: "Listen",
      desc: "Switch to Audiobook mode! Our magical narrator reads aloud and even flips the pages automatically."
    },
    {
      icon: <HiColorSwatch className="text-4xl text-green-400" />,
      title: "Create Art",
      desc: "Turn any story into a custom printable coloring book. Your child becomes the illustrator!"
    }
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-white/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-[#5253A3] mb-6">
            What is KiddoTales? 🪄
          </h2>
          <p className="text-xl md:text-2xl text-[#5253A3]/80 max-w-3xl mx-auto leading-relaxed">
            We've combined the latest AI technology with a love for storytelling to create a platform that turns every child into the hero of their own adventure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-[0_20px_50px_rgba(82,83,163,0.2)] border-4 border-transparent hover:border-white transition-all flex flex-col items-center text-center group cursor-default"
            >
              <div className="mb-6 p-5 rounded-3xl bg-[#CAD3FF]/30 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#5253A3] mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-12 bg-[#5253A3] rounded-[3rem] text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500/20 to-blue-500/20 pointer-events-none"></div>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
            More than just a book site.
          </h3>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8 relative z-10">
            KiddoTales is a companion for parents and a playground for children. It's about bonding, learning, and creating memories that last a lifetime.
          </p>
          <div className="flex justify-center gap-4 relative z-10">
            <span className="px-6 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">No Ads</span>
            <span className="px-6 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">Safe for Kids</span>
            <span className="px-6 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">AI Powered</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
