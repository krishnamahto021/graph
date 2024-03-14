import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

const Graph = () => {
  const [chartData, setChartData] = useState({});

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
        },
        xaxis: {
          categories: Object.keys(hotels),
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


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Requests per Hotel</h1>
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
    </div>
  );
};

export default Graph;
