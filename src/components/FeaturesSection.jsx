const IconBook = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
  
  const IconSparkles = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
      <path d="M9.9 10.8c-.4.7-.7 1.4-.7 2.2 0 2.8 2.2 5 5 5 .8 0 1.5-.2 2.2-.7" />
      <path d="M19 12.2c.4-.7.7-1.4.7-2.2 0-2.8-2.2-5-5-5-.8 0-1.5.2-2.2.7" />
      <path d="M5.2 6.8c.4-.7.7-1.4.7-2.2 0-2.8-2.2-5-5-5-.8 0-1.5.2-2.2.7" />
    </svg>
  );
  
  const IconZap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
      <path d="M4 14h6v8L20 10h-6V2z" />
    </svg>
  );
  
  const IconGlobe = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
  const FeaturesSection = () => {
    const features = [
      {
        icon: <IconBook />,
        title: "Personalized Adventures",
        description: "Craft stories with your child's name, favorite characters, and unique scenarios.",
      },
      {
        icon: <IconSparkles />,
        title: "Spark Imagination",
        description: "Encourage creativity and critical thinking with engaging and imaginative plots.",
      },
      {
        icon: <IconZap />,
        title: "Effortless Creation",
        description: "Generate captivating stories in just a few clicks, saving you time and effort.",
      },
      {
        icon: <IconGlobe />,
        title: "Read Anywhere, Anytime",
        description: "Access stories on any device, fostering a love for reading on the go.",
      },
    ];
  
    return (
      <section className="py-16 bg-white px-4 md:px-16 rounded-xl shadow-lg m-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#5253A3]">
            Unlock the Magic of Storytelling
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover how our platform makes creating personalized stories simple and fun for both you and your child.
          </p>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                <div className="text-[#5253A3] text-5xl mb-4 p-3 rounded-full bg-white shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-[#5253A3]">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  export default FeaturesSection