import React from "react";
// import Icon from "../../../components/AppIcon";   // ✔ FIXED PATH
import Button from "../../../components/ui/Button";

const DashboardHome = () => {
  return (
    <div className="w-full">
      {/* Header Greeting Card */}
      <div className="bg-[#E8E2D9] p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Namaste, Arjun Kumar! 🙏
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your Ayurvedic wellness journey
            </p>
          </div>

          <div className="border rounded-xl p-4 bg-white shadow-sm text-center">
            <p className="text-sm text-gray-600">Prakriti</p>
            <p className="text-lg font-semibold text-green-700">Vata–Pitta</p>
            <p className="text-xs text-gray-500">Current State: Pitta</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {/* Scan Food */}
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xl">📷</span>
            </div>
          </div>
          <h3 className="font-semibold text-gray-800">Scan Food</h3>
          <p className="text-sm text-gray-600">
            Analyze meals with Ayurvedic principles
          </p>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-800 mt-3">Analytics</h3>
          <p className="text-sm text-gray-600">View your nutrition insights</p>
        </div>

        {/* Diet Plans */}
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl">🍎</span>
          </div>
          <h3 className="font-semibold text-gray-800 mt-3">Diet Plans</h3>
          <p className="text-sm text-gray-600">Personalized recommendations</p>
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xl">📅</span>
          </div>
          <h3 className="font-semibold text-gray-800 mt-3">Sessions</h3>
          <p className="text-sm text-gray-600">Book consultations</p>
        </div>
      </div>

      {/* Doctor + Nutrition Overview */}
      <div className="grid grid-cols-2 gap-8">
        {/* Doctor */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            Your Ayurvedic Doctor
          </h2>

          <div className="bg-white rounded-xl p-4 border shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                🧑‍⚕️
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Dr. Rajesh Ayengar
                </h3>
                <p className="text-sm text-gray-600">
                  Panchakarma • 4.8/5.0 (250 patients)
                </p>
                <p className="text-xs text-blue-600">15 years experience</p>
              </div>
            </div>

            <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Book Consultation
            </Button>
          </div>
        </div>

        {/* Nutrition Overview */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            Today's Nutrition Overview
          </h2>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="font-medium text-gray-800 mb-1">Calories</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-orange-500 h-3 rounded-full" style={{ width: "85%" }}></div>
            </div>
            <p className="text-right text-sm mt-1">1850 / 2000</p>

            {/* Vata */}
            <p className="font-medium text-gray-800 mt-4 mb-1">Vata</p>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div className="bg-blue-400 h-3 rounded-full" style={{ width: "35%" }}></div>
            </div>

            {/* Pitta */}
            <p className="font-medium text-gray-800 mt-4 mb-1">Pitta</p>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div className="bg-orange-500 h-3 rounded-full" style={{ width: "40%" }}></div>
            </div>

            {/* Kapha */}
            <p className="font-medium text-gray-800 mt-4 mb-1">Kapha</p>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: "25%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Food Scans + Ayurvedic Recommendations */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Recent Food Scans */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Recent Food Scans</h2>
            <button className="text-green-600 font-medium">View All</button>
          </div>

          {[ 
            { color: "bg-green-400", title: "Mixed Vegetable Curry", time: "2 hours ago", cal: "320 cal" },
            { color: "bg-yellow-400", title: "Quinoa Salad Bowl", time: "5 hours ago", cal: "285 cal" },
            { color: "bg-red-400", title: "Spiced Lentil Soup", time: "1 day ago", cal: "380 cal" },
          ].map((item, i) => (
            <div key={i} className="bg-white border rounded-xl shadow-sm p-4 flex justify-between items-center mb-3">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
              <p className="font-semibold text-gray-700">{item.cal}</p>
            </div>
          ))}
        </div>

        {/* Ayurvedic Recommendations */}
        <div className="bg-[#E8E2D9] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">
            Ayurvedic Recommendations
          </h2>

          {[ 
            { icon: "🌅", title: "Morning Routine", text: "Start your day with warm water + ginger." },
            { icon: "🥗", title: "Diet Tip", text: "Include more bitter & astringent foods." },
            { icon: "🧘‍♂️", title: "Mindfulness", text: "Practice slow eating to balance Pitta." },
          ].map((item, i) => (
            <div key={i} className="bg-white border rounded-xl shadow-sm p-4 mb-3">
              <p className="font-medium text-gray-800 flex items-center space-x-2 text-lg">
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </p>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
