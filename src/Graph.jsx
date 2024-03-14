import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const Graph = () => {
  const [chartData, setChartData] = useState({});
  const [totalRequests, setTotalRequests] = useState(0);
  const [uniqueDepartments, setUniqueDepartments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://checkinn.co/api/v1/int/requests"
      );
      const data = response.data.requests;
      const hotels = generateChartData(data);
      setChartData(hotels);
      calculateTotalRequests(data);
      calculateUniqueDepartments(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateChartData = (data) => {
    const hotels = {};
    data.forEach((request) => {
      const hotelName = request.hotel.shortname;
      if (!hotels.hasOwnProperty(hotelName)) {
        hotels[hotelName] = 1;
      } else {
        hotels[hotelName]++;
      }
    });

    return {
      options: {
        chart: {
          id: "requests-per-hotel",
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: Object.keys(hotels),
        },
        yaxis: {
          min: 0,
          stepSize: 2,
        },
      },
      series: [
        {
          name: "Requests",
          data: Object.values(hotels),
        },
      ],
    };
  };

  const calculateTotalRequests = (data) => {
    setTotalRequests(data.length);
  };

  const calculateUniqueDepartments = (data) => {
    const uniqueDepartmentsSet = new Set();
    data.forEach((request) => {
      uniqueDepartmentsSet.add(request.desk.name);
    });
    setUniqueDepartments(Array.from(uniqueDepartmentsSet));
  };

  return (
    <div className="container mx-auto py-8 border border-dashed border-gray-600 rounded-md">
      <h1 className="text-2xl text-center font-semibold mb-4">Requests per Hotel</h1>
      <div>
        {chartData.options && chartData.series && (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={400}
          />
        )}
      </div>
      <div className="text-center">
        <p className="my-2">Total requests:{totalRequests}</p>
        <span>
          List of <i>unique</i> department names across all Hotels:
          {uniqueDepartments.map((department, index) => (
            <span key={index} className="m-1">
              {department},
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default Graph;
