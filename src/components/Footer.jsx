const Footer = () => {
    return (
      <footer className="bg-[#5253A3] text-white py-12 px-4 md:px-16 rounded-xl shadow-inner m-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Us */}
          <div>
            <h3 className="text-2xl font-bold mb-4">About Us</h3>
            <p className="text-gray-300">
              We are dedicated to fostering a love for reading and creativity in children through personalized stories.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-200 transition-colors duration-200">Home</a></li>
              <li><a href="#" className="hover:text-blue-200 transition-colors duration-200">Features</a></li>
              <li><a href="#" className="hover:text-blue-200 transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-200 transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
  
          {/* Social Media */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.7 5 4.9 9 5.1 0-.4.1-.8.1-1.2C12.1 5.9 15.6 2 20 2c1.4 0 2.5.6 3 1.2z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
  
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Story Weaver. All rights reserved.
        </div>
      </footer>
    );
  };

  export default Footer