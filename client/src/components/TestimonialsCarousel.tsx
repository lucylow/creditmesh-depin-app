import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Verifier Node Operator",
    earnings: "2,847.5 CMESH",
    quote: "Running a verifier node has been incredibly rewarding. The passive income from CreditMesh has exceeded my expectations.",
    avatar: "🔐",
  },
  {
    name: "Maria Rodriguez",
    role: "Gateway Operator",
    earnings: "2,156.3 CMESH",
    quote: "Setting up my gateway was straightforward, and I'm earning consistent rewards every epoch. Highly recommended!",
    avatar: "🌐",
  },
  {
    name: "James Wilson",
    role: "Sensor Network Owner",
    earnings: "1,432.1 CMESH",
    quote: "With just a few sensors, I'm generating passive income. CreditMesh makes IoT monetization simple and transparent.",
    avatar: "📊",
  },
  {
    name: "Lisa Park",
    role: "Multi-Device Operator",
    earnings: "4,200+ CMESH",
    quote: "Diversifying across sensors and gateways has maximized my earnings. The network is stable and reliable.",
    avatar: "⭐",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[current];

  return (
    <div className="card-blueprint">
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-5xl">{testimonial.avatar}</div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">{testimonial.name}</h4>
            <p className="text-sm text-slate-600 font-mono uppercase tracking-widest">{testimonial.role}</p>
            <p className="text-sm text-cyan-600 font-bold mt-1">{testimonial.earnings} earned</p>
          </div>
        </div>

        <p className="text-slate-700 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>

        {/* Carousel Indicators */}
        <div className="flex gap-2 justify-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? "w-8 bg-cyan-600" : "w-2 bg-slate-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
