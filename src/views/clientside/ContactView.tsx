import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const ContactView = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Address Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Address</h2>
              <div className="space-y-2 text-gray-700 mb-4">
                <p className="font-semibold">Saltbay Lounge</p>
                <p>No. 17 Beach Road, Mount Lavinia</p>
                <p>Colombo 10370, Sri Lanka</p>
              </div>
              <Button variant="outline" className="mb-6">
                View on Google maps
              </Button>

              <div className="mb-8">
                <Image
                  src="/assets/contact/contact.jpg"
                  alt="Saltbay Lounge location map"
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg shadow-sm"
                />
              </div>
            </section>

            {/* Reach Us Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Reach Us
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">
                    Reservations
                  </span>
                  <span className="text-gray-900">+94 112 345 678 (24/7)</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">
                    General Inquiries
                  </span>
                  <a
                    href="mailto:info@saltbaylounge.lk"
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    info@saltbaylounge.lk
                  </a>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">
                    Events & Weddings
                  </span>
                  <a
                    href="mailto:events@saltbaylounge.lk"
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    events@saltbaylounge.lk
                  </a>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Emergency</span>
                  <span className="text-gray-900">
                    +94 765 432 190 (Security)
                  </span>
                </div>
              </div>
            </section>

            {/* Connect Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect</h2>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  Instagram
                </Button>
                <Button
                  variant="secondary"
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  Facebook
                </Button>
                <Button
                  variant="secondary"
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  TripAdvisor
                </Button>
              </div>
            </section>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Form
                </h2>
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter Your Name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Your Email"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Enter Subject"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      placeholder="Enter Your Message"
                      rows={6}
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
