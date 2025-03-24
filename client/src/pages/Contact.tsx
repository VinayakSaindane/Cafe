import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Get in Touch
          </h1>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2">
            <Card className="h-full">
              <CardContent className="p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:w-1/2">
            <Card className="h-full flex flex-col">
              <div className="w-full h-64">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Manhattan!5e0!3m2!1sen!2sus!4v1592005257026!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Cafe Location Map"
                ></iframe>
              </div>
              
              <CardContent className="p-8 flex-grow">
                <h3 
                  className="text-xl font-bold text-[#5C4033] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-[#8B4513] mr-4 mt-1">
                      <i className="fas fa-map-marker-alt text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#5C4033]">Our Location</h4>
                      <p className="text-[#333333]">123 Brew Street, Downtown<br />New York, NY 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-[#8B4513] mr-4 mt-1">
                      <i className="fas fa-phone-alt text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#5C4033]">Phone Number</h4>
                      <p className="text-[#333333]">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-[#8B4513] mr-4 mt-1">
                      <i className="fas fa-envelope text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#5C4033]">Email Address</h4>
                      <p className="text-[#333333]">info@brewandbite.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-[#8B4513] mr-4 mt-1">
                      <i className="fas fa-clock text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#5C4033]">Hours of Operation</h4>
                      <p className="text-[#333333]">Monday - Friday: 7AM - 9PM<br />Saturday - Sunday: 8AM - 10PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium text-[#5C4033] mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#5C4033] text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-[#8B4513] transition-colors"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#5C4033] text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-[#8B4513] transition-colors"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#5C4033] text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-[#8B4513] transition-colors"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a 
                      href="https://yelp.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#5C4033] text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-[#8B4513] transition-colors"
                    >
                      <i className="fab fa-yelp"></i>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
