import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Chart, ArcElement } from 'chart.js';

// Register the "arc" element
Chart.register(ArcElement);

function Schart({ pos, neg, neu }) {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const chartData = {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [
          {
            data: [pos, neg, neu],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
          },
        ],
      };

      const options = {
        plugins: {
          title: {
            display: true,
            text: 'Sentiment Analysis',
          },
        },
      };

      chartInstance = new Chart(chartRef.current, {
        type: 'pie',
        data: chartData,
        options: options,
      });
    }
  }, [pos, neg, neu]);

  return <canvas ref={chartRef} />;
}

Schart.propTypes = {
  pos: PropTypes.number.isRequired,
  neg: PropTypes.number.isRequired,
  neu: PropTypes.number.isRequired,
};

function LanguageChart({ langData }) {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    if (chartRef && chartRef.current) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const data = {
        labels: Object.keys(langData),
        datasets: [
          {
            data: Object.values(langData),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#8B98FF',
              '#4BC0C0',
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#8B98FF',
              '#4BC0C0',
            ],
          },
        ],
      };

      const options = {
        plugins: {
          title: {
            display: true,
            text: 'Language Analysis',
          },
        },
      };

      chartInstance = new Chart(chartRef.current, {
        type: 'pie',
        data: data,
        options: options,
      });
    }
  }, [langData]);

  return <canvas ref={chartRef} />;
}

LanguageChart.propTypes = {
  langData: PropTypes.object.isRequired,
};

export { Schart, LanguageChart };
