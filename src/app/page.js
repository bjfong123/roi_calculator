"use client";
import { useState, useEffect } from "react";
import CurrencyInput from "react-currency-input-field";
import Image from "next/image";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label,
  LineChart,
  CartesianGrid,
  Line,
} from "recharts";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import BeforeAfterSlider from "./BeforeAfterSlider";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

export default function Home() {
  const [laborRate, setLaborRate] = useState(15);
  const [personnel, setPersonnel] = useState(1);
  const [hours, setHours] = useState(1.5);
  const [frequency, setFrequency] = useState(2);
  const [courts, setCourts] = useState(15);
  const [robotCost, setRobotCost] = useState(799);
  const [installationFee, setInstallationFee] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentMonthlyCost, setCurrentMonthlyCost] = useState(0);
  const [currentAnnualCost, setCurrentAnnualCost] = useState(0);

  const colors = ["#FF6384", "#F9da5b", "#82ca9d"];

  // Plan features data
  const planFeatures = {
    799: [
      { name: "Basic Plan", included: true },
      { name: "Standard Support", included: true },
    ],
    899: [
      { name: "Void Setup Fee (-$2000)", included: true },
      { name: "Software Installation Training", included: true },
      { name: "Enhanced Support", included: true },
    ],
    999: [
      { name: "Warranty", included: true },
      { name: "Void Setup Fee (-$2000)", included: true },
      { name: "48-hour Swap Guarantee", included: true },
      { name: "Software Installation Training", included: true },
      { name: "Marketing Launch Promotion", included: true },
      { name: "System-business Integration", included: true },
      { name: "Priority Customer", included: true },
    ],
  };

  // Auto-calculate ROI whenever any input changes
  useEffect(() => {
    const calculateROI = () => {
      const weeklyCost = laborRate * personnel * hours * courts * frequency;
      const monthlyCost = weeklyCost * 4;
      const totalRobotCost = robotCost;
      const savings = monthlyCost - totalRobotCost;

      setMonthlySavings(savings - installationFee);
      setAnnualSavings(savings * 12 - installationFee);
      setCurrentMonthlyCost(monthlyCost);
      setCurrentAnnualCost(monthlyCost*12);
    };

    calculateROI();
  }, [laborRate, personnel, hours, frequency, courts, robotCost, installationFee]);

  // Calculate data for charts (updates automatically)
  const data = [
    {
      name: "Current Costs",
      value: 4 * laborRate * personnel * hours * courts * frequency,
    },
    { name: "CECE Costs", value: robotCost + installationFee },
    { name: "Savings", value: monthlySavings },
  ];

  const Annualdata = [
    {
      name: "Current Costs",
      value: 4 * 12 * laborRate * personnel * hours * courts * frequency,
    },
    { name: "CECE Costs", value: 12 * robotCost + installationFee },
    { name: "Savings", value: annualSavings },
  ];

  const handleRobotPlanChange = (cost) => {
    setRobotCost(cost);
    if (cost === 799) {
      setInstallationFee(1500);
    } else {
      setInstallationFee(0);
    }
  };

  const toggleDropdown = (planCost) => {
    setActiveDropdown(activeDropdown === planCost ? null : planCost);
  };

  return (
    <>
      <main className="bg-stone-800 text-gray-900 min-h-screen py-4 px-2">
        <div className="w-full max-w-none lg:max-w-[90vw] xl:max-w-[85vw] 2xl:max-w-7xl mx-auto bg-white shadow-2xl rounded-none lg:rounded-xl overflow-hidden">
          <div className="flex items-center justify-center p-6 lg:p-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-center leading-tight">
              Operation ROI Calculator
            </h1>
          </div>
          
          <div className="p-0 m-0 print:hidden">
            <BeforeAfterSlider
              hours={hours}
              frequency={frequency}
              courts={courts}
              beforeAlt="Human cleaning capacity visualization"
              afterAlt="Robot cleaning capacity visualization"
            />
          </div>
          
          <div className="flex flex-col xl:flex-row gap-0 xl:gap-8 p-6 lg:p-8 xl:p-10">
            
            <div className="flex-1 xl:flex-none xl:w-1/2 bg-white rounded-lg shadow-lg p-8 lg:p-10 mb-6 xl:mb-0">
          
              <p className="text-center text-black mb-8 text-2xl font-bold">
                Estimate your savings with automated court cleaning
              </p>

              {/* Results - Now update automatically */}
              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <p className="text-3xl text-gray-600 font-bold mb-2">
                  Current Monthly Costs:
                </p>
                <div className="text-5xl font-bold text-red-600">
                  {formatCurrency(currentMonthlyCost)}
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mb-8">
                <p className="text-3xl text-gray-600 font-bold mb-2">
                  Current Annual Costs:
                </p>
                <div className="text-5xl font-bold text-red-600">
                  {formatCurrency(currentAnnualCost)}
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <p className="text-3xl text-gray-600 font-bold mb-2">
                  Estimated Monthly Savings:
                </p>
                <div className="text-5xl font-bold text-green-700">
                  {formatCurrency(monthlySavings)}
                </div>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg mb-8">
                <p className="text-3xl text-gray-600 font-bold mb-2">
                  Estimated Annual Savings:
                </p>
                <div className="text-5xl font-bold text-green-700">
                  {formatCurrency(annualSavings)}
                </div>
              </div>

              {/* Sliders - Now trigger automatic updates */}
              <div className="space-y-6 print:hidden">
                <Slider
                  label="Fully burdened labor rate (hourly)"
                  min={10}
                  max={100}
                  value={laborRate}
                  setValue={setLaborRate}
                  prefix="$"
                />
                <Slider
                  label="Personnel per cleaning"
                  min={1}
                  max={10}
                  value={personnel}
                  setValue={setPersonnel}
                />
                <Slider
                  label="Hours per cleaning"
                  min={1}
                  max={5}
                  step={0.5}
                  value={hours}
                  setValue={setHours}
                  suffix=" hrs"
                />
                <Slider
                  label="Cleanings per week"
                  min={1}
                  max={14}
                  value={frequency}
                  setValue={setFrequency}
                />
                <Slider
                  label="Number of courts"
                  min={1}
                  max={30}
                  value={courts}
                  setValue={setCourts}
                />
              </div>

              

              {/* Calculate button removed - everything updates automatically */}
            </div>

            <div className="flex-1 xl:flex-none xl:w-1/2 bg-white rounded-lg shadow-lg p-8 lg:p-10">
              <div className="flex flex-col items-center space-y-10">
                
                {/* Charts now update automatically */}
                <div className="w-full">
                  <h3 className="text-center font-bold text-xl mb-4">
                    Current Costs vs. CECE Costs and Savings (Monthly)
                  </h3>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data}>
                        <XAxis 
                          dataKey="name" 
                          fontSize={14}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis fontSize={14}>
                          <Label
                            value="USD ($)"
                            angle={-90}
                            position="insideLeft"
                            offset={1}
                            style={{ textAnchor: "middle" }}
                          />
                        </YAxis>
                        <Tooltip />
                        <Bar dataKey="value">
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length] || "#ccc"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    
                  </div>

                </div>
                
                <div className="w-full">
                  <h3 className="text-center font-bold text-xl mb-4">
                    Current Costs vs. CECE Costs and Savings (Annually)
                  </h3>
                  <div className="w-full">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={Annualdata}>
                        <XAxis 
                          dataKey="name" 
                          fontSize={14}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis fontSize={14}>
                          <Label
                            value="USD ($)"
                            angle={-90}
                            position="insideLeft"
                            offset={1}
                            style={{ textAnchor: "middle" }}
                          />
                        </YAxis>
                        <Tooltip />
                        <Bar dataKey="value">
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length] || "#ccc"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Robot Plan Selection with Dropdowns */}
              <div className="mb-8 mt-8">
                <label className="block font-semibold mb-4 text-2xl">
                  Robot 3-year lease plan
                </label>
                <div className="flex flex-col gap-4">
                  
                  {/* $799 Plan */}
                  <div className="relative">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        robotCost === 799 ? 'border-green-500 bg-green-50' : 'border-gray-300'
                      }`}
                      onClick={() => {
                        handleRobotPlanChange(799);
                        toggleDropdown(799);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="robotCost"
                            value={799}
                            checked={robotCost === 799}
                            onChange={() => handleRobotPlanChange(799)}
                            className="form-radio h-5 w-5 mr-3"
                          />
                          <span className="text-xl font-semibold">$799/Month Plan</span>
                        </div>
                        {activeDropdown === 799 ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                      
                      {activeDropdown === 799 && (
                        <div className="mt-4 pl-8 border-t pt-4">
                          {planFeatures[799].map((feature, index) => (
                            <div key={index} className="flex items-center mb-2">
                              <span className="text-sm text-gray-600">• {feature.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* $899 Plan */}
                  <div className="relative">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        robotCost === 899 ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                      }`}
                      onClick={() => {
                        handleRobotPlanChange(899);
                        toggleDropdown(899);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="robotCost"
                            value={899}
                            checked={robotCost === 899}
                            onChange={() => handleRobotPlanChange(899)}
                            className="form-radio h-5 w-5 mr-3"
                          />
                          <span className="text-xl font-semibold">$899/Month Plan</span>
                        </div>
                        {activeDropdown === 899 ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                      
                      {activeDropdown === 899 && (
                        <div className="mt-4 pl-8 border-t pt-4">
                          {planFeatures[899].map((feature, index) => (
                            <div key={index} className="flex items-center mb-2">
                              <FaCheckCircle className="text-green-600 mr-2 w-4 h-4" />
                              <span className="text-sm text-gray-600">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* $999 Plan */}
                  <div className="relative">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        robotCost === 999 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onClick={() => {
                        handleRobotPlanChange(999);
                        toggleDropdown(999);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="robotCost"
                            value={999}
                            checked={robotCost === 999}
                            onChange={() => handleRobotPlanChange(999)}
                            className="form-radio h-5 w-5 mr-3"
                          />
                          <span className="text-xl font-semibold">$999/Month Plan</span>
                        </div>
                        {activeDropdown === 999 ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                      
                      {activeDropdown === 999 && (
                        <div className="mt-4 pl-8 border-t pt-4">
                          {planFeatures[999].map((feature, index) => (
                            <div key={index} className="flex items-center mb-2">
                              <FaCheckCircle className="text-green-600 mr-2 w-4 h-4" />
                              <span className="text-sm text-gray-600">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                      <div className="flex justify-center align-center">
                      <button
                      onClick={() => window.print()}
                      className="bg-green-900 text-white rounded-xl brightness-150 w-50 h-10 text-xl hover:bg-green-800 transition-all"
                      >
                        Print page

                      </button>
                      </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  setValue,
  prefix = "",
  suffix = "",
}) {
  return (
    <div className="mb-6">
      <label className="block font-semibold mb-3 text-2xl">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-right text-base font-mono mt-2">
        <span className="text-gray-600">{prefix}</span>
        <input
          className="inline-block w-24 text-center border border-gray-300 rounded px-2 py-1 text-lg"
          type="number"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
        />
        <span className="text-gray-600">{suffix}</span>
      </div>
    </div>
  );
}
