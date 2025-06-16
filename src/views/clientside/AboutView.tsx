"use client";
import Image from "next/image";
import React from "react";

const AboutView = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <div
        className=" flex flex-col justify-center
    "
      >
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Story</h2>

          <div className="mb-8">
            <Image
              src="/assets/about/about.jpg"
              alt="Coastal luxury resort view"
              width={800}
              height={400}
              className="w-full h-80 object-cover rounded-lg shadow-sm"
            />
          </div>

          <p className="text-gray-700 leading-relaxed text-base">
            {`Nestled along the golden shores of Mount Lavinia, Colombia's iconic
            beachfront, Sahbay Lounge redefines coastal luxury. Founded in 2010,
            our hotel blends Sri Lanka's rich hospitality traditions with
            contemporary design, offering a serene escape just 12 km from
            Colombo's bustling city center.`}
          </p>
        </section>

        {/* Philosophy Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Philosophy</h2>

          <p className="text-gray-700 leading-relaxed text-base">
            {`We believe in "barefoot elegance" – where unparalleled beach views
            meet thoughtful comforts. Every detail celebrates Sri Lanka's
            natural beauty, from handwoven batik textiles to sustainably sourced
            teak furnishings.`}
          </p>
        </section>

        {/* Unique Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Unique</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Exciting cocktails
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Craft cocktails inspired by local spices and tropical fruits,
                served with stunning ocean views.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Chef Specialties
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Authentic Sri Lankan cuisine prepared with fresh, locally
                sourced ingredients and traditional techniques.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Countless Adventures
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                From water sports to cultural excursions, discover the rich
                heritage and natural beauty of Sri Lanka.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutView;
