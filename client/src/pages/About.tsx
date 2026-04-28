const About = () => {
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6 text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Story
          </h1>
          
          <div className="mb-12">
            <img
              src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=500&q=80"
              alt="Brew & Bite Cafe storefront"
              className="w-full h-auto rounded-lg shadow-lg mb-8"
            />
            
            <div className="prose max-w-none">
              <p className="text-lg mb-4">
                Brew & Bite was founded in 2015 by a group of friends who shared a passion for exceptional coffee and food. What began as a small corner cafe has grown into a beloved community hub, known for its warm atmosphere, artisanal offerings, and commitment to quality.
              </p>
              
              <p className="text-lg mb-4">
                Our mission is simple: to create a space where every customer feels welcome and can enjoy thoughtfully prepared food and beverages that delight the senses. We believe in the power of a perfect cup of coffee to brighten someone's day and the joy that comes from a meal crafted with care.
              </p>
              
              <h2 
                className="text-2xl font-bold text-[#5C4033] mt-8 mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Philosophy
              </h2>
              
              <p className="text-lg mb-4">
                At Brew & Bite, we are guided by three core principles:
              </p>
              
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-lg">
                  <strong>Quality Without Compromise</strong> - We source the finest ingredients, from our ethically traded coffee beans to our locally grown produce.
                </li>
                <li className="text-lg">
                  <strong>Community Connection</strong> - We strive to be more than just a cafe; we aim to be a gathering place that brings people together.
                </li>
                <li className="text-lg">
                  <strong>Sustainability</strong> - We are committed to environmentally responsible practices in everything we do, from our compostable packaging to our energy-efficient equipment.
                </li>
              </ul>
              
              <h2 
                className="text-2xl font-bold text-[#5C4033] mt-8 mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Space
              </h2>
              
              <p className="text-lg mb-4">
                Our cafe is designed to be a sanctuary from the hustle and bustle of everyday life. With comfortable seating, warm lighting, and thoughtful decor, we've created an environment where you can work, socialize, or simply enjoy a moment of solitude with your favorite beverage.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                  alt="Cafe interior with comfortable seating"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"
                  alt="Barista preparing coffee"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
