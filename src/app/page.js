"use client";

import React, { useState, useEffect } from "react";
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
  Area,
} from "recharts";
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaPlay,
  FaPause,
  FaRedo,
  FaTrophy,
  FaRobot,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";

// Helper function to format numbers as USD currency strings
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

// Main Home component - the ROI calculator
export default function Home() {
  // === State declarations for inputs and computed values ===

  // Number of clubs
  const [numClub, setClub] = useState(15);
  // Number of courts per club
  const [courts, setCourts] = useState(15);
  // Labor rates (hourly, weekly, monthly)
  const [laborRate, setLaborRate] = useState(0);
  const [weeklyRate, setWeeklyRate] = useState(0);
  const [monthlyRate, setMonthlyRate] = useState(0);
  // Number of personnel working
  const [personnel, setPersonnel] = useState(1);

  // Cleaning times and frequencies for various tasks and additonal hours
  const [otherHours, setOtherHours] = useState(30);
  const [frequency, setFrequency] = useState(5); // Frequency per week for other tasks

  // Individual cleaning task frequencies (times per week)
  const [mopFrequency, setMopFrequency] = useState(5);
  const [scrubfrequency, setScrubFrequency] = useState(5);
  const [vacuumFrequency, setVacuumFrequency] = useState(5);
  const [sweepingFrequency, setSweepingFrequency] = useState(5);

  // Cleaning durations per court in minutes for each type
  const [dryCleanHours, setDryCleanHours] = useState(30); // sweep duration court
  const [mopHours, setmopHours] = useState(30);
  const [scrubHours, setScrubHours] = useState(30);
  const [vacuumHours, setVacuumHours] = useState(30);

  // Extra cleaning time for other areas (not courts) in minutes
  const [sweepingOther, setSweepingOther] = useState(0);
  const [moppingOther, setMoppingOther] = useState(0);
  const [scrubbingOther, setScrubbingOther] = useState(0);
  const [vacuumingOther, setVacuumingOther] = useState(0);

  // Robot automation cost inputs
  const [robotCost, setRobotCost] = useState(899);
  const [installationFee, setInstallationFee] = useState(0);

  // Computed savings
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);

  // Dropdown state for selecting robot plans
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Current estimated labor costs
  const [currentMonthlyCost, setCurrentMonthlyCost] = useState(0);
  const [currentAnnualCost, setCurrentAnnualCost] = useState(0);

  // User selection for why they use this calculator
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [otherReason, setOtherReason] = useState("");

  // Selected cleaning options - not fully implemented in current code but placeholder
  const [selectedCleaningOptions, setSelectedCleaningOptions] = useState([]);

  // State to toggle between monthly and annual chart views
  const [chartView, setChartView] = useState("monthly");

  // Automation efficiency factor (percentage of time reduction)
  const [automationEfficiency, setAutomationEfficiency] = useState(0.6);

  // Array of months for chart
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Ju", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Build dataset for 12 months with cumulative savings growth
  const savingsData = months.map((month, i) => ({
    month,
    monthly: monthlySavings, // monthly savings assumed constant
    cumulative: monthlySavings * (i + 1), // cumulative saving grows month over month
  }));

  // Colors used for charts
  const colors = ["#FF6384", "#F9da5b", "#82ca9d"];

  // Feature list by robot plan cost for display
  const planFeatures = {
    899: [
      { name: "Basic Plan", included: true },
      { name: "Standard Support", included: true },
    ],
    999: [
      { name: "Void Setup Fee", included: true },
      { name: "Software Installation Training", included: true },
      { name: "Enhanced Support", included: true },
    ],
    1199: [
      { name: "Warranty", included: true },
      { name: "Void Setup Fee", included: true },
      { name: "48-hour Swap Guarantee", included: true },
      { name: "Software Installation Training", included: true },
      { name: "Marketing Launch Promotion", included: true },
      { name: "System-business Integration", included: true },
      { name: "Priority Customer", included: true },
    ],
  };

  // Possible reasons for using ROI calculator
  const reasons = [
    "Save Money/Prevent Resurfacing Costs",
    "Save Time",
    "Improve Cleaning Quality",
    "Energy Efficiency",
    "Extend Court Lifespan",
    "Other",
  ];

  // Calculate total cleaning minutes per cleaning cycle across all courts and clubs
  const totalMinutesPerCycle =
    (dryCleanHours * sweepingFrequency) +
    (sweepingOther * sweepingFrequency) +
    (mopHours * mopFrequency) +
    (moppingOther * mopFrequency) +
    (scrubHours * scrubfrequency) +
    (scrubbingOther * scrubfrequency) +
    (vacuumHours * vacuumFrequency) +
    (vacuumingOther * vacuumFrequency) +
    (otherHours * frequency);

  // Calculate total monthly time spent (in hours), assuming 4.33 weeks/month
  const monthlyTimeSpent = ((totalMinutesPerCycle * courts * numClub) * 4.33) / 60;
  // Calculate total yearly time spent (in hours)
  const yearlyTimeSpent = ((totalMinutesPerCycle * courts * numClub) * 52) / 60;

  // Time spent after automation efficiency applied, monthly and yearly
  const monthlyTimeWithAutomation = monthlyTimeSpent * (1 - automationEfficiency);
  const monthlyTimeSaved = monthlyTimeSpent - monthlyTimeWithAutomation;

  const yearlyTimeWithAutomation = yearlyTimeSpent * (1 - automationEfficiency);
  const yearlyTimeSaved = yearlyTimeSpent - yearlyTimeWithAutomation;

  // useEffect to recalculate costs and savings whenever any dependency changes
  useEffect(() => {
    // Calculate total weekly minutes per court/tasks
    const weeklyMinutesPerCourt =
      (dryCleanHours + sweepingOther) * sweepingFrequency +
      (mopHours + moppingOther) * mopFrequency +
      (scrubHours + scrubbingOther) * scrubfrequency +
      (vacuumHours + vacuumingOther) * vacuumFrequency +
      otherHours * frequency;

    // Total weekly hours for all courts and clubs
    const totalWeeklyHours = (weeklyMinutesPerCourt / 60) * courts * numClub;

    // Variables to hold computed labor costs
    let computedWeeklyLaborCost = 0;
    let computedMonthlyLaborCost = 0;

    // Labor cost calculation based on input of hourly, weekly, or monthly rates
    if (laborRate > 0) {
      // Hourly labor rate multiplied by total weekly hours
      computedWeeklyLaborCost = laborRate * totalWeeklyHours;
      computedMonthlyLaborCost = computedWeeklyLaborCost * 4.33;
    } else if (weeklyRate > 0) {
      // Flat weekly rate multiplied by 4.33 weeks/month
      computedWeeklyLaborCost = weeklyRate;
      computedMonthlyLaborCost = weeklyRate * 4.33;
    } else if (monthlyRate > 0) {
      // Flat monthly rate directly
      computedMonthlyLaborCost = monthlyRate;
      computedWeeklyLaborCost = monthlyRate / 4.33;
    }

    // Set current monthly and annual cost values
    const currentMonthlyCost = computedMonthlyLaborCost;
    const currentAnnualCost = currentMonthlyCost * 12;

    // Robot monthly cost is the plan cost
    const robotMonthlyCost = robotCost;

    // Calculate estimated monthly savings
    const estimatedMonthlySavings = currentMonthlyCost - robotMonthlyCost;
    // Calculate estimated annual savings considering installation fee once
    const estimatedAnnualSavings =
      (currentMonthlyCost - robotMonthlyCost) * 12 - installationFee;

    // Update state accordingly
    setCurrentMonthlyCost(currentMonthlyCost);
    setCurrentAnnualCost(currentAnnualCost);
    setMonthlySavings(estimatedMonthlySavings);
    setAnnualSavings(estimatedAnnualSavings);
  }, [
    numClub,
    courts,
    laborRate,
    weeklyRate,
    monthlyRate,
    sweepingFrequency,
    dryCleanHours,
    sweepingOther,
    scrubfrequency,
    scrubHours,
    scrubbingOther,
    mopFrequency,
    mopHours,
    moppingOther,
    vacuumFrequency,
    vacuumHours,
    vacuumingOther,
    frequency,
    otherHours,
    robotCost,
    installationFee,
  ]);

  // Collapsible section component for better UI grouping with toggle
  function CollapsibleSection({ title, children }) {
    const [open, setOpen] = useState(false); // open/close state

    return (
      <div className="border rounded-lg mb-4 bg-gray-50 shadow-sm">
        <button
          className="w-full flex justify-between items-center p-3 font-bold text-lg bg-gray-100 hover:bg-gray-200 transition-all"
          onClick={() => setOpen(!open)}
        >
          {title}
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {open && <div className="p-4">{children}</div>}
      </div>
    );
  }

  // Data array for monthly cost comparison bar chart
  const data = [
    {
      name: "Current Costs",
      value: 4 * laborRate * personnel * courts * frequency,
    },
    { name: "CECE Costs", value: robotCost + installationFee },
    { name: "Savings", value: monthlySavings },
  ];

  // Data for annual cost comparison bar chart
  const Annualdata = [
    {
      name: "Current Costs",
      value: 4 * 12 * laborRate * personnel * courts * frequency,
    },
    { name: "CECE Costs", value: 12 * robotCost + installationFee },
    { name: "Savings", value: annualSavings },
  ];

  // Update robotCost state & installation fee based on plan selected
  const handleRobotPlanChange = (cost) => {
    setRobotCost(cost);
    // $899 plan has $2000 install fee, other plans have none
    if (cost === 899) {
      setInstallationFee(2000);
    } else {
      setInstallationFee(0);
    }
  };

  // Toggle dropdown for showing robot plan features details
  const toggleDropdown = (planCost) => {
    setActiveDropdown(activeDropdown === planCost ? null : planCost);
  };

  // Predefined ROI presets for common cleaning service scenarios
  const ownerRoi = () => {
    setWeeklyRate(0);
    setMonthlyRate(0);
    setLaborRate(0);
  };

  const contractRoi = () => {
    setLaborRate(0);
    setWeeklyRate(0);
    setMonthlyRate(3500);
  };

  const inHouseRoi = () => {
    setLaborRate(0);
    setWeeklyRate(5000);
    setMonthlyRate(0);
  };

  // For cost difference comparisons on line chart
  const oldMonthlyCost = currentMonthlyCost;
  const newMonthlyCost = robotCost + installationFee;

  // Prepare monthly comparison data for line chart visualization
  const monthlyComparisonData = months.map((month) => ({
    month,
    oldMonthlyCost: currentMonthlyCost,
    newMonthlyCost: robotCost + installationFee,
    diff: currentMonthlyCost - (robotCost + installationFee), // positive is saving
  }));

  return (
    <>
      {/* Main page container */}
      <main className="bg-stone-800 text-gray-900 min-h-screen py-4 px-2">
        <div className="w-full max-w-none lg:max-w-[90vw] xl:max-w-[85vw] 2xl:max-w-7xl mx-auto bg-white shadow-2xl rounded-none lg:rounded-xl overflow-hidden">

          {/* Header - Logo and title */}
          <div className="flex items-center align-center justify-center p-3 lg:p-8">
            <Image
              src={"/logo.png"}
              alt="Description"
              width={300}
              height={200}
            />
          </div>
          <div className="text-5xl text-center font-bold flex items-center mx-90 h-20 py-4 text-gray-800 rounded-2xl">
            <h1 className="ml-18"> Calculate Your ROI </h1>
          </div>

          {/* User info form for basic contact details */}
          <div className="bg-white rounded-lg p-6 shadow-md mb-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-5"> Enter Information </h1>
            <form className="flex flex-col gap-6 w-full max-w-md">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <label
                    className="w-32 text-lg font-semibold"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder=""
                    className="flex-1 border border-gray-300 rounded px-4 py-2 text-lg focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label
                    className="w-32 text-lg font-semibold "
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder=""
                    className="flex-1 border border-gray-300 rounded px-4 py-2 text-lg focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-lg font-semibold" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder=""
                    className="flex-1 border border-gray-300 rounded px-4 py-2 text-lg focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label
                    className="w-32 text-lg font-semibold"
                    htmlFor="company"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder=""
                    className="flex-1 border border-gray-300 rounded px-4 py-2 text-lg focus:outline-none"
                  />
                </div>
              </div>
              
              {/* Reason checkboxes */}
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                What is your main reason for using this ROI calculator?
              </h2>
              <div className="flex flex-col gap-3">
                {reasons.map((reason, index) => (
                  <label key={index} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="roiReasons"
                      value={reason}
                      checked={selectedReasons.includes(reason)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (e.target.checked) {
                          setSelectedReasons([...selectedReasons, value]);
                        } else {
                          setSelectedReasons(selectedReasons.filter((r) => r !== value));
                        }
                      }}
                      className="form-checkbox h-5 w-5 text-green-600"
                    />
                    <span className="font-bold text-lg text-gray-700">{reason}</span>
                  </label>
                ))}

                {/* Text input if 'Other' is selected */}
                {selectedReasons.includes("Other") && (
                  <input
                    type="text"
                    placeholder=""
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className="mt-2 border border-gray-300 rounded px-4 py-2 text-lg focus:outline-none"
                  />
                )}
              </div>
            </form>
          </div>

          {/* Main input panel with sliders and robot plans */}
          <div className="flex flex-col xl:flex-row gap-0 xl:gap-8 p-6 lg:p-8 xl:p-10 pt-3">

            {/* Left Panel */}
            <div className="flex-1 xl:w-1/2 bg-white rounded-lg shadow-lg p-8 lg:p-10">

              {/* ROI Model Buttons */}
              <p className="text-center text-2xl font-bold pb-5">
                Select Your Cleaning Process
              </p>

              <div className="flex justify-center items-center">
                <div className="">
                  <h1 className="mr-2 font-bold"> Cleaning Model: </h1>
                  <p className="text-xs"> Hover over the buttons for more details </p>
                </div>

                {/* ROI option buttons with tooltip */}
                <button
                  className="whitespace-nowrap mr-7 text-xl font-bold bg-lime-400 hover:bg-lime-500 transition duration-200 ease-in-out rounded-3xl px-4 py-2 cursor-pointer"
                  onClick={() => inHouseRoi()}
                  title="assumes a weekly labor cost of $5000 and no monthly costs and hourly rate"
                >
                  In-House
                </button>

                <button
                  className="mr-7 text-xl font-bold bg-lime-400 hover:bg-lime-500 transition duration-200 ease-in-out rounded-3xl px-4 py-2 cursor-pointer"
                  onClick={() => contractRoi()}
                  title="assumes a monthly labor cost of $3500 and no hourly rate or weekly costs"
                >
                  Contract
                </button>

                <button
                  className="mr-7 text-xl font-bold bg-lime-400 hover:bg-lime-500 transition duration-200 ease-in-out rounded-3xl px-4 py-2 cursor-pointer"
                  onClick={() => ownerRoi()}
                  title="assumes no monthly or weekly costs and no hourly rate"
                >
                  Owner
                </button>
              </div>

              {/* Input sliders for clubs, courts, and labor cost */}
              <div className="space-y- print:hidden pt-8">
                {/* Number of clubs slider */}
                <Slider
                  label="Number of clubs"
                  min={0}
                  max={50}
                  step={1}
                  value={numClub}
                  setValue={setClub}
                />
                {/* Number of courts slider */}
                <Slider
                  label="Number of courts per club"
                  min={1}
                  max={50}
                  step={1}
                  value={courts}
                  setValue={setCourts}
                />
                {/* Hourly labor rate slider with description */}
                <Slider
                  label="Hourly labor rate"
                  min={0}
                  max={100}
                  step={0.5}
                  value={laborRate}
                  setValue={setLaborRate}
                  prefix="$"
                  description="Use when monthly and weekly costs are unknown"
                />
                {/* Estimated weekly labor cost slider */}
                <Slider
                  label="Estimated weekly labor cost"
                  min={0}
                  max={10000}
                  step={500}
                  value={weeklyRate}
                  setValue={setWeeklyRate}
                  prefix="$"
                  description="Use when monthly costs and hourly rates are unknown"
                />
                {/* Estimated monthly labor cost slider */}
                <Slider
                  label="Estimated monthly labor cost"
                  min={0}
                  max={10000}
                  step={1000}
                  value={monthlyRate}
                  setValue={setMonthlyRate}
                  prefix="$"
                  description="Use when weekly costs and hourly rates are unknown"
                />
                <hr className="my-6 border-t mt-10 border-gray-300" />
              </div>

              {/* Robot plan selection panel */}
              <div className="mt-12">
                <label className="block font-semibold mb-4 text-2xl">
                  Select Your Automation Plan
                </label>
                <div className="flex flex-col gap-4">
                  {/* Show each plan cost as an interactive card */}
                  {[899, 999, 1199].map((cost) => (
                    <div key={cost} className="relative">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          robotCost === cost
                            ? `border-${
                                cost === 899
                                  ? "green"
                                  : cost === 999
                                  ? "purple"
                                  : "blue"
                              }-500 bg-${
                                cost === 899
                                  ? "green"
                                  : cost === 999
                                  ? "purple"
                                  : "blue"
                              }-50`
                            : "border-gray-300"
                        }`}
                        onClick={() => {
                          handleRobotPlanChange(cost);
                          toggleDropdown(cost);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="robotCost"
                              value={cost}
                              checked={robotCost === cost}
                              onChange={() => handleRobotPlanChange(cost)}
                              className="form-radio h-5 w-5 mr-3"
                            />
                            <span className="text-xl font-semibold">
                              ${cost}/Month Plan
                            </span>
                          </div>
                          {activeDropdown === cost ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </div>

                        {/* List features of plan if dropdown active */}
                        {activeDropdown === cost && (
                          <div className="mt-4 pl-8 border-t pt-4">
                            {planFeatures[cost].map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center mb-2"
                              >
                                <FaCheckCircle className="text-green-600 mr-2 w-4 h-4" />
                                <span className="text-sm text-gray-600">
                                  {feature.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Button to print/save as PDF */}
                  <div className="flex justify-center align-center">
                    <button
                      onClick={() => window.print()}
                      className="bg-green-900 text-white rounded-xl brightness-150 w-50 h-10 text-xl hover:bg-green-800 transition-all"
                    >
                      Save Results As PDF
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-8 lg:p-10"></div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 xl:w-1/2 flex flex-col gap-6">

              {/* More info and sliders for cleaning task details */}
              <div className="bg-white rounded-lg shadow-lg p-8 lg:p-10">
                <p className="text-center text-black mb-6 text-2xl font-bold">
                  More information
                </p>

                {/* Sweeping info */}
                <CollapsibleSection title="Sweeping Information">
                  <Slider
                    label="Sweeping frequency (per week)"
                    min={0}
                    max={10}
                    step={1}
                    value={sweepingFrequency}
                    setValue={setSweepingFrequency}
                  />
                  <Slider
                    label="Sweeping duration for 1 court (minutes)"
                    min={0}
                    max={120}
                    step={15}
                    value={dryCleanHours}
                    setValue={setDryCleanHours}
                  />
                  <Slider
                    label="Sweeping duration for other places (minutes)"
                    min={0}
                    max={120}
                    step={15}
                    value={sweepingOther}
                    setValue={setSweepingOther}
                  />
                </CollapsibleSection>

                {/* Scrubbing info */}
                <CollapsibleSection title="Scrubbing Information">
                  <Slider
                    label="Wet cleaning frequency (per week)"
                    min={0}
                    max={10}
                    step={1}
                    value={scrubfrequency}
                    setValue={setScrubFrequency}
                  />
                  <Slider
                    label="Wet cleaning duration for 1 court (minutes)"
                    min={0}
                    max={120}
                    step={15}
                    value={scrubHours}
                    setValue={setScrubHours}
                  />
                  <Slider
                    label="Wet cleaning duration for other places (minutes)"
                    min={0}
                    max={120}
                    step={15}
                    value={scrubbingOther}
                    setValue={setScrubbingOther}
                  />
                </CollapsibleSection>

                {/* Mopping info */}
                <CollapsibleSection title="Mopping Information">
                  <Slider
                    label="Mopping frequency (per week)"
                    min={0}
                    max={10}
                    step={1}
                    value={mopFrequency}
                    setValue={setMopFrequency}
                  />
                  <Slider
                    label="Mopping duration for 1 court (minutes)"
                    min={0}
                    max={120}
                    step={15}
                    value={mopHours}
                    setValue={setmopHours}
                  />
                  <Slider
                    label="Mopping duration for other places (minutes)"
                    min={0}
                    max={120}
                    step={15}
                    value={moppingOther}
                    setValue={setMoppingOther}
                  />
                </CollapsibleSection>

                {/* Vacuuming info */}
                <CollapsibleSection title="Vacuuming Information">
                  <Slider
                    label="Vacuuming frequency (per week)"
                    min={0}
                    max={10}
                    step={1}
                    value={vacuumFrequency}
                    setValue={setVacuumFrequency}
                  />
                  <Slider
                    label="Vacuuming duration for 1 court (minutes)"
                    min={0}
                    max={120}
                    step={15}
                    value={vacuumHours}
                    setValue={setVacuumHours}
                  />
                  <Slider
                    label="Vacuuming duration for other places (minutes)"
                    min={0}
                    max={120}
                    step={15}
                    value={vacuumingOther}
                    setValue={setVacuumingOther}
                  />
                </CollapsibleSection>

                {/* Other Tasks info */}
                <CollapsibleSection title="Other Tasks">
                  <Slider
                    label="Frequency of additional cleaning tasks (per week)"
                    min={0}
                    max={20}
                    step={1}
                    value={frequency}
                    setValue={setFrequency}
                  />
                  <Slider
                    label="Time for additional cleaning tasks (minutes)"
                    min={0}
                    max={240}
                    step={15}
                    value={otherHours}
                    setValue={setOtherHours}
                    description="(e.g. Taking out the trash)"
                  />
                </CollapsibleSection>
              </div>
            </div>
          </div>

          {/* Savings estimate table */}
          <div className="bg-white rounded-lg shadow-lg p-8 lg:p-10 w-full">
            <p className="text-center text-black mb-6 text-2xl font-bold">
              Estimate your savings with automated court cleaning
            </p>

            <div className="w-full">
              <table className="w-full border-collapse border border-gray-300 text-center">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-6 text-lg w-1/3"></th>
                    <th className="border border-gray-300 p-6 text-lg w-1/3">Monthly</th>
                    <th className="border border-gray-300 p-6 text-lg w-1/3">Yearly</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-6 font-bold text-xl">Current Costs</td>
                    <td className="border border-gray-300 p-6 text-red-600 font-bold text-xl">{formatCurrency(currentMonthlyCost)}</td>
                    <td className="border border-gray-300 p-6 text-red-600 font-bold text-xl">{formatCurrency(currentAnnualCost)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-6 font-bold text-xl">Estimated Savings</td>
                    <td className="border border-gray-300 p-6 text-green-700 font-bold text-xl">{formatCurrency(monthlySavings)}</td>
                    <td className="border border-gray-300 p-6 text-green-700 font-bold text-xl">{formatCurrency(annualSavings)}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-6 font-bold text-xl">Time Spent</td>
                    <td className="border border-gray-300 p-6 text-red-600 font-bold text-xl">{monthlyTimeSpent.toFixed(1)} hrs</td>
                    <td className="border border-gray-300 p-6 text-red-600 font-bold text-xl">{yearlyTimeSpent.toFixed(1)} hrs</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-6 font-bold text-xl">Time Saved</td>
                    <td className="border border-gray-300 p-6 text-green-700 font-bold text-xl">{monthlyTimeSaved.toFixed(1)} hrs</td>
                    <td className="border border-gray-300 p-6 text-green-700 font-bold text-xl">{yearlyTimeSaved.toFixed(1)} hrs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 lg:p-10 w-full mt-8"></div>
          </div>

          {/* Chart view toggle and bar charts for monthly and annual costs */}
          <div className="bg-white rounded-lg shadow-lg p-8 lg:p-10 w-full mt-8">
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setChartView("monthly")}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  chartView === "monthly"
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Monthly
              </button>

              <button
                onClick={() => setChartView("annual")}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  chartView === "annual"
                    ? "bg-green-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Annual
              </button>
            </div>

            {/* Monthly cost bar chart */}
            {chartView === "monthly" && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    }
                  />
                  <Tooltip />
                  <Bar dataKey="value">
                    {data.map((entry, index) => {
                      // Red for costs, green for savings
                      let color = "#FF6384"; // Default bright red for costs
                      if (entry.name === "Savings") color = "#82ca9d";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Annual cost bar chart */}
            {chartView === "annual" && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Annualdata}>
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    }
                  />
                  <Tooltip />
                  <Bar dataKey="value">
                    {Annualdata.map((entry, index) => {
                      // Both costs red, savings green
                      let color = "#FF6384";
                      if (entry.name === "Savings") color = "#82ca9d";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            <hr className="my-6 border-t border-gray-300" />

            {/* Cleaning schedule calendar, showing weekly task allocation */}
            <CleaningCalendar
              sweepingFrequency={sweepingFrequency}
              scrubFrequency={scrubfrequency}
              mopFrequency={mopFrequency}
              vacuumFrequency={vacuumFrequency}
              dryCleanHours={dryCleanHours}
              scrubHours={scrubHours}
              mopHours={mopHours}
              vacuumHours={vacuumHours}
              numClub={numClub}
              courts={courts}
            />
          </div>

          {/* Line chart showing monthly cost comparison old vs new */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
              <Legend />

              {/* Old costs line */}
              <Line type="monotone" dataKey="oldMonthlyCost" stroke="#ff0000" strokeWidth={3} dot={false} />
              {/* New costs line */}
              <Line type="monotone" dataKey="newMonthlyCost" stroke="#007bff" strokeWidth={3} dot={false} />

              {/* Area fill showing cost difference */}
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="green" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="red" stopOpacity={0.4} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="diff"
                stroke="none"
                fill="url(#areaFill)"
                baseValue={0}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </>
  );
}

// Slider component: takes label, min, max, step, value and setter, optional prefix/suffix and description
function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  setValue,
  prefix = "",
  suffix = "",
  description = "",
}) {
  // Local input state for controlled input field (text)
  const [inputValue, setInputValue] = useState(value.toString());

  // Sync inputValue state when value prop changes (from parent)
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Handle direct input change for number field
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    // Parse and clamp input
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      const clampedValue = Math.max(min, Math.min(max, parsed));
      setValue(clampedValue);
    }
  };

  // Select all text on focus for ease of editing
  const handleFocus = (e) => {
    e.target.select();
  };

  // On input blur, reset or clamp value if invalid or empty
  const handleBlur = () => {
    if (inputValue === "" || isNaN(parseFloat(inputValue))) {
      setInputValue(value.toString());
    } else {
      const parsed = parseFloat(inputValue);
      const clampedValue = Math.max(min, Math.min(max, parsed));
      setInputValue(clampedValue.toString());
      setValue(clampedValue);
    }
  };

  // Keyboard handling for increment/decrement with arrow keys
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newValue = Math.min(max, value + step);
      setValue(newValue);
      setInputValue(newValue.toString());
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newValue = Math.max(min, value - step);
      setValue(newValue);
      setInputValue(newValue.toString());
    }
  };

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-3 text-2xl">{label}</label>
      {description && <p className="text-lg text-gray-500 mb-2">{description}</p>}
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
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
        />
        <span className="text-gray-600">{suffix}</span>
      </div>
    </div>
  );
}

// Helper to convert minutes since midnight to readable time ranges with AM/PM formatting
function formatTimeRange(startMinutes, duration) {
  const pad = (n) => n.toString().padStart(2, "0");
  const startHour = Math.floor(startMinutes / 60);
  const startMin = startMinutes % 60;
  const endMinutes = startMinutes + duration;
  const endHour = Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;

  // Convert 24-hour hour to 12-hour format
  const to12 = (h) => ((h + 11) % 12) + 1;
  // Determine AM or PM suffix
  const ampm = (h) => (h < 12 || h === 24 ? "am" : "pm");

  // Format start and end time strings
  const startStr = `${to12(startHour)}:${pad(startMin)}${ampm(startHour)}`;
  const endStr = `${to12(endHour)}:${pad(endMin)}${ampm(endHour)}`;
  return `${startStr} to ${endStr}`;
}

// CleaningCalendar component:
// Displays the weekly schedule for cleaning tasks in a grid layout
function CleaningCalendar({
  sweepingFrequency,
  scrubFrequency,
  mopFrequency,
  vacuumFrequency,
  dryCleanHours,
  scrubHours,
  mopHours,
  vacuumHours,
}) {
  // Days of week labels
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Utility to determine which days cleaning tasks occur given frequency (per week)
  function getCleaningDays(freq) {
    if (freq <= 0) return [];
    if (freq >= 7) return days.map((_, idx) => idx);
    const interval = Math.floor(7 / freq);
    return [...Array(freq)].map((_, i) => (i * interval) % 7);
  }

  // schedule holds tasks with coloring, frequency days and durations
  let currentTime = 8 * 60; // Start time at 8:00 AM in minutes from midnight

  const schedule = [
    {
      label: "Sweep",
      colorClass: "bg-orange-500",
      activeDays: getCleaningDays(sweepingFrequency),
      duration: dryCleanHours,
    },
    {
      label: "Scrub",
      colorClass: "bg-blue-500",
      activeDays: getCleaningDays(scrubFrequency),
      duration: scrubHours,
    },
    {
      label: "Mop",
      colorClass: "bg-yellow-400",
      activeDays: getCleaningDays(mopFrequency),
      duration: mopHours,
    },
    {
      label: "Vacuum",
      colorClass: "bg-green-500",
      activeDays: getCleaningDays(vacuumFrequency),
      duration: vacuumHours,
    },
  ].map((task) => {
    // Assign start/end time range strings and increment currentTime
    const start = currentTime;
    const end = currentTime + task.duration;
    const timeRange = formatTimeRange(start, task.duration);
    currentTime = end;
    return { ...task, timeRange };
  });

  return (
    <div className="my-12 px-2 md:px-6">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Your Automated Cleaning Schedule
      </h3>

      {/* Days header row */}
      <div className="grid grid-cols-8 gap-2 mb-2 text-center text-lg font-semibold text-gray-700">
        <div className="text-right pr-2"></div>
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Task rows */}
      {schedule.map((row, i) => (
        <div key={i} className="grid grid-cols-8 gap-2 mb-2 items-center">
          {/* Time range label */}
          <div className="text-right pr-3 font-semibold text-sm text-gray-700">
            {row.timeRange}
          </div>
          {/* Day cells colored if cleaning on that day */}
          {days.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-lg h-14 flex items-center justify-center transition-all
                ${row.activeDays.includes(idx)
                  ? `${row.colorClass}`
                  : "bg-gray-200"}`}
            />
          ))}
        </div>
      ))}

      {/* Legend for colors */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          Sweep
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          Scrub
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          Mop
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          Vacuum
        </div>
      </div>
    </div>
  );
}

// Export Slider and CleaningCalendar as named exports
export { Slider, CleaningCalendar };
