"use client";
import { useState } from "react";
import CurrencyInput from 'react-currency-input-field';
import Image from 'next/image';
import { BarChart, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer, Cell, Label, LineChart, CartesianGrid, Line} from "recharts";
import { FaCheckCircle } from "react-icons/fa";
import BeforeAfterSlider from './BeforeAfterSlider';

export default function Home() {
  const [laborRate, setLaborRate] = useState(15);
  const [personnel, setPersonnel] = useState(1);
  const [hours, setHours] = useState(1.5);
  const [frequency, setFrequency] = useState(2);
  const [courts, setCourts] = useState(15);
  const [robotCost, setRobotCost] = useState(799);
  const [installationFee, setInstallationFee] = useState(0); // Added installation fee state
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);

const colors = ['#FF6384','#F9da5b','#82ca9d'];

const data = [
  { name: 'Current Costs', value: 4 * laborRate * personnel * hours * courts * frequency},
  { name: 'CECE Costs', value: robotCost + installationFee},
  { name: 'Savings', value: monthlySavings },
];

const Annualdata = [
  { name: 'Current Costs', value: 4 * 12 * laborRate * personnel * hours * courts * frequency},
  { name: 'CECE Costs', value: (12 * robotCost) + installationFee},
  { name: 'Savings', value: annualSavings },
];

  const calculateROI = () => {
    const weeklyCost = laborRate * personnel * hours * courts * frequency;
    const monthlyCost = weeklyCost * 4;
    const totalRobotCost = robotCost; // Include installation fee in calculation
    const savings = monthlyCost - totalRobotCost;

    setMonthlySavings(savings - installationFee);
    setAnnualSavings((savings * 12) - installationFee);
  };

  // Function to handle robot plan selection
  const handleRobotPlanChange = (cost) => {
    setRobotCost(cost);
    // Set installation fee based on plan
    if (cost === 799) {
      setInstallationFee(1500);
    } else {
      setInstallationFee(0);
    }
  };

  // to do: one time fee, animation and textbars for the sliders, none option
      
  return (  
  
    <main className="bg-gradient-to-br from-lime-400 via-lime-300 to-white-900 text-gray-900 min-h-screen py-10">
      <div className="max-w-lvh mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
     <div className="max-w-lvh mx-auto bg-white rounded-xl overflow-hidden flex flex-col lg:flex-row">
       <div className="w-100 flex flex-auto">
        <div className="w-full lg: -1/2 p-10 bg-white">
          
            <h2 className="text-center text-3xl font-bold mb-6"> Autopilot ROI Calculator </h2>
            <h1 className="text-3xl p-10 bg-lime-300 font-bold mb-4 text-center">See Your Potential ROI</h1>
            <p className="text-center text-black mb-8 text-2xl font-bold">Estimate your savings with automated court cleaning</p>
                    
            {/* Results */}
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-3xl text-gray-600 font-bold">Estimated Monthly Savings:</p>
              <div className="text-5xl font-bold text-green-700"> ${monthlySavings.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-3xl text-gray-600 font-bold">Estimated Annual Savings:</p>
              <div className="text-5xl font-bold text-green-700">${annualSavings.toFixed(2)}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-6 font-bold">
              <p className="text-2xl text-gray-600 font-bold"> Estimated Time to Recoup Your Investment </p>
              <div className="text-4xl font-bond text-green-700">6 months</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-6 font-bold" >
              <p className="text-2xl text-gray-600 font-bold"> Estimated 5-year Return on Investment </p>
              <div className="text-4xl font-bond text-green-700"> 6 months</div>
              <div className="text-4xl font-bond text-green-700 font-bold">Greater than 60%</div>
            </div>


            {/* Sliders */}
            <Slider label="Fully burdened labor rate (hourly)" min={10} max={100} value={laborRate} setValue={setLaborRate} prefix="$" />
            <Slider label="Personnel per cleaning" min={1} max={10} value={personnel} setValue={setPersonnel}/>
            <Slider label="Hours per cleaning" min={1} max={5} step={0.5} value={hours} setValue={setHours} suffix=" hrs" />
            <Slider label="Cleanings per week" min={1} max={14} value={frequency} setValue={setFrequency}/>
                {/* <Button></Button> */}
            <Slider label="Number of courts" min={1} max={30} value={courts} setValue={setCourts}/>
                  

            {/* Radio buttons for robot cost */}
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-2xl"> Robot 3-year lease plan </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center text-xl">
                  <input
                    type="radio"
                    name="robotCost"
                    value={799}
                    checked={robotCost === 799}
                    onChange={() => handleRobotPlanChange(799)}
                    className="form-radio"
                  />
                  <span className="ml-2"> $799 Plan </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="robotCost"
                    value={899}
                    checked={robotCost === 899}
                    onChange={() => handleRobotPlanChange(899)}
                    className="form-radio"
                  />
                  <span className="ml-2 text-xl">$899 Plan</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="robotCost"
                    value={999}
                    checked={robotCost === 999}
                    onChange={() => handleRobotPlanChange(999)}
                    className="form-radio"
                  />
                  <span className="ml-2 text-xl">$999 Plan</span>
                </label>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={calculateROI}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
            >
              Calculate My ROI
            </button>
            
            
          </div> 
          </div>

      <div className="flex flex-auto w-100 justify-center items-start px-4 py-6 hidden lg:block"> 
          <div className="flex flex-col items-center space-y-10">
          <div>
          {/*<Image className="" width={576} height={200} src="/image.jpg" alt="IMG"></Image> {/* img */}
          <h3 className="text-center font-bold text-xl"> Current Costs vs. CECE Costs and Savings (Monthly) </h3>
              <BarChart width={500} height={300} data={data}>
                <XAxis dataKey="name"/>
                <YAxis>
                <Label
                value="USD ($)"
                angle={-90}
                position="insideLeft"
                offset={1}
                style={{ textAnchor: 'middle' }}
                />
                </YAxis>
                <Tooltip />
                <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length] || '#ccc'} />
                     ))}
                </Bar>
              </BarChart>
             </div>
               <h3 className="text-center font-bold text-xl"> Current Costs vs. CECE Costs and Savings (Annually) </h3>
              <BarChart width={500} height={300} data={Annualdata}>
                <XAxis dataKey="name"/>
                <YAxis>
                <Label
                value="USD ($)"
                angle={-90}
                position="insideLeft"
                offset={1}
                style={{ textAnchor: 'middle' }}
                />
                </YAxis>
                <Tooltip />
                <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length] || '#ccc'} />
                     ))}
                </Bar>
              </BarChart>
    <table className="table-fixed border-collapse border border-gray-300 w-full">
    
    <thead>
  <tr className="bg-gray-100">
    <th className="border border-gray-400 text-2xl text-left px-4 py-2">3-year lease payment options</th>
    <th className="border border-gray-400 text-4xl text-center px-4 py-2">$799</th>
    <th className="border border-gray-400 text-4xl text-center px-4 py-2">$899</th>
    <th className="border border-gray-400 text-4xl text-center px-4 py-2">$999</th>
  </tr>
</thead>
<tbody>
  {[
    ["Warranty", "", "", <FaCheckCircle className="text-green-600 inline-block size-9" />],
    ["Void Setup Fee (-$2000)", "", <FaCheckCircle className="text-green-600 inline-block size-9" />, <FaCheckCircle className="text-green-600 inline-block size-9" />],
    ["48-hour Swap Guarantee", "", "", <FaCheckCircle className="text-green-600 inline-block size-9" />],
    ["Software Installation Training", "", <FaCheckCircle className="text-green-600 inline-block size-9" />, <FaCheckCircle className="text-green-600 inline-block size-9" />],
    ["Marketing Launch Promotion", "", "", <FaCheckCircle className="text-green-600 inline-block size-9" />],
    ["System-business Integration", "", "", <FaCheckCircle className="text-green-600 inline-block size-9" />],
    ["Priority Customer", "", "", <FaCheckCircle className="text-green-600 inline-block size-9" />],
  ].map((row, idx) => (
    <tr key={idx}>
      {row.map((cell, i) => (
        <td
          key={i}
          className={`border border-gray-400 px-4 py-2 text-xl text-center ${i === 0 ? "text-left font-semibold" : ""}`}
        >
          {cell}
        </td>
      ))}
    </tr>
  ))}
</tbody>
</table>

    {/* <thead> 
    <tr className="bg-gray-100">
      <th className="text-2xl text-left px-4 py-2">3-year lease payment options</th>
      <th className="text-4xl text-center px-4 py-2">$799</th>
      <th className="text-4xl text-center px-4 py-2">$899</th>
      <th className="text-4xl text-center px-4 py-2">$999</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="text-3xl px-4 py-2 align-middle">Warranty</td>
      <td className="align-middle"></td>
      <td className="align-middle"></td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
    </tr>
    <tr>
      <td className="text-3xl px-4 py-2 align-middle">Void Setup Fee (-$2000)</td>
      <td className="align-middle"></td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
    </tr>
    <tr>
      <td className="text-3xl px-4 py-2 align-middle">48-hour Swap Guarantee</td>
      <td className="align-middle"></td>
      <td className="align-middle"></td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
    </tr>
    <tr>
      <td className="text-3xl px-4 py-2 align-middle">Software Installation Training</td>
      <td className="align-middle"></td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
    </tr>
    <tr>
      <td className="text-3xl px-4 py-2 align-middle">Marketing Launch Promotion</td>
      <td className="align-middle"></td>
      <td className="align-middle"></td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
    </tr>
    <tr>
      <td className="text-3xl px-4 py-2 align-middle">System-business Integration</td>
      <td className="align-middle"></td>
      <td className="align-middle"></td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
    </tr>
    <tr>
      <td className="text-3xl px-4 py-2 align-middle">Priority Customer</td>
      <td className="align-middle"></td>
      <td className="align-middle"></td>
      <td className="text-center align-middle">
        <FaCheckCircle className="text-green-600 inline-block size-9" />
      </td>
    </tr>
  </tbody> 
</table> */}


            </div>
        </div>          
      </div>
      <div className="mt-16">
        <BeforeAfterSlider 
          beforeImage="/Gemini_Generated_Image_2i0gaq2i0gaq2i0g.jpg" // Replace with your actual image paths
          afterImage="/CECE.jpg"   // Replace with your actual image paths
          beforeAlt="Tennis court before cleaning"
          afterAlt="Tennis court after automated cleaning"
        />
      </div>
      </div>
    </main>
  );
     

}


// Reusable Slider Component


function Slider({ label, min, max, step = 1, value, setValue, prefix = "", suffix = "" }) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-2xl">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="text-right text-sm font-mono">
        {prefix}
        {<input className="" type="text" style={{ font: "30px" , width: "25px" }} value={value}  onChange={(e) => setValue(parseFloat(e.target.value) || 0)} />}
        {suffix}
      </div>
    </div>
  );
}