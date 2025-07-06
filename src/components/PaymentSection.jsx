const PaymentSection = () => {
    const plans = [
      {
        name: "Free Plan",
        price: "$0",
        frequency: "per month",
        features: [
          "Up to 5 stories per month",
          "Basic personalization options",
          "Standard story themes",
          "Ad-supported experience",
        ],
        buttonText: "Start Free",
        isPopular: false,
      },
      {
        name: "Premium Plan",
        price: "$9.99",
        frequency: "per month",
        features: [
          "Unlimited stories",
          "Advanced personalization",
          "Exclusive story themes",
          "Ad-free experience",
          "Priority customer support",
          "Early access to new features",
        ],
        buttonText: "Go Premium",
        isPopular: true,
      },
    ];
  
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100 px-4 md:px-16 rounded-xl shadow-lg m-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#5253A3]">
            Choose Your Story Plan
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Select the perfect plan to start crafting endless magical tales for your child.
          </p>
  
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-xl shadow-lg w-full max-w-sm transform transition-all duration-300 ease-in-out hover:scale-105
                  ${plan.isPopular ? 'border-4 border-[#5253A3] scale-105' : 'border border-gray-200'}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Popular
                  </div>
                )}
                <h3 className="text-3xl font-bold mb-4 text-[#5253A3]">
                  {plan.name}
                </h3>
                <div className="text-5xl font-extrabold text-[#5253A3] mb-6">
                  {plan.price}
                  <span className="text-lg text-gray-500">/{plan.frequency}</span>
                </div>
                <ul className="text-left text-gray-700 mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-full font-semibold text-white transition duration-300 ease-in-out transform hover:scale-105
                  ${plan.isPopular ? 'bg-[#5253A3] hover:bg-[#6a6bd8]' : 'bg-gray-400 hover:bg-gray-500'}`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  export default PaymentSection