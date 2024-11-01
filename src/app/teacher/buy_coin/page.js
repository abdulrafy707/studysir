'use client';
import React, { useState } from 'react';
import BuyCoinsModal from '@/app/components/BuyCoinsModal'; // Import your modal component

export default function PlansPage() {
    const plans = [
        {
          title: 'Basic Plan',
          price: '3000',
          coins: '3000', // Number of coins
          features: [
            '3,000 Coins',
            'Ads Free',
            'Live Chat any student',
            'Teach all over the world',
            'Post Your Courses',
            'Manage Your Calendar',
            'Sell Your Courses',
            'Sell Ebooks',
            'StudySir Team Support',
          ],
          discount: null,
        },
        {
          title: 'Pro Plan',
          price: '5699',
          coins: '6000', // Number of coins
          features: [
            '6,000 Coins',
            'Ads Free',
            'Live Chat any student',
            'Teach all over the world',
            'Post Your Courses',
            'Manage Your Calendar',
            'Sell Your Courses',
            'Sell Ebooks',
            'StudySir Team Support',
          ],
          discount: '5% Off',
        },
        {
          title: 'Academy Plan',
          price: '9999',
          coins: '12000', // Number of coins
          features: [
            '12,000 Coins',
            'Ads Free',
            'Live Chat any student',
            'Teach all over the world',
            'Post Your Courses',
            'Manage Your Calendar',
            'Sell Your Courses',
            'Sell Ebooks',
            'StudySir Team Support',
          ],
          discount: '17% Off',
        },
      ];
      
  const [selectedPlan, setSelectedPlan] = useState(null); // To store the selected plan
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 sm:px-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 w-full sm:max-w-md mx-auto"
          >
            {/* Plan Title */}
            <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
              {plan.title}
            </h2>

            {/* Features List */}
            <ul className="mb-6 text-gray-700 text-sm md:text-base leading-loose">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center mb-2">
                  <span className="text-blue-500 mr-2">•</span> {feature}
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-gray-900">Rs. {plan.price}</span>
            </div>

            {/* Discount Badge */}
            {plan.discount && (
              <div className="text-center mb-4">
                <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  {plan.discount}
                </span>
              </div>
            )}

            {/* Buy Now Button */}
            <div className="flex justify-center">
              <button
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition-all"
                onClick={() => openModal(plan)} // Open modal with selected plan
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show Modal when Buy Now is clicked */}
      {isModalOpen && (
        <BuyCoinsModal onClose={closeModal} selectedPlan={selectedPlan} />
      )}
    </div>
  );
}
