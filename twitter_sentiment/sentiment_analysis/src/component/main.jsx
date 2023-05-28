import React, { useState , useEffect } from 'react';
import {IoRefreshCircleSharp} from 'react-icons/io5';
import axios from 'axios';
import { Schart, LanguageChart } from './chart';
import ReactApexChart from "react-apexcharts";


function SentimentAnalysis() {
  const [keyword, setKeyword] = useState('');
  const [positive, setPositive] = useState(0);
  const [negative, setNegative] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [langData, setLangData] = useState({});
  const [wordCloud, setWordCloud] = useState('');
  const [tweets, setTweets] = useState([]);

  const [activeTab, setActiveTab] = useState(1);



  // chart 
  const [pie, setpie] = useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        width: 380,
        type: "donut",
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: false,
      },
      labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],

      fill: {
        type: "gradient",
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
      },
      title: {
        text: "Gradient Donut with custom Start-angle",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  const [graph, setGraph] = useState({
    series: [20, 40, 40],
    options: {
      chart: {
        width: 380,
        type: "donut",
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: false,
      },
      labels: ["positive", "negative", "neutral"],

      fill: {
        type: "gradient",
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
      },
      title: {
        text: "Gradient Donut with custom Start-angle",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  

  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://127.0.0.1:5000/?query=${keyword}`);
      const sentiment = response.data.Sentiment;
      setPositive(sentiment.positive);
      setNegative(sentiment.negative);
      setNeutral(sentiment.neutral);
      setLangData(response.data.Languages);
      setWordCloud(response.data.wordlist);
      setTweets(response.data.Tweets);
    } catch (error) {
      console.log(error);
    }
  };


  const itemsPerPage = 10; // Number of tweets to display per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the first and last tweet to display
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentTweets = tweets.slice(firstIndex, lastIndex);

  // Handle page navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers based on total tweets and items per page
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(tweets.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    // alert(Object.keys(langData));
    if (Object.keys(langData).length > 0) {
      setpie({
        // series: Object.values(props.percentageByCompany.map(p => p.toFixed(2))),
        series: Object.values(langData),
        options: {
          chart: {
            width: 380,
            type: "donut",
          },
          plotOptions: {
            pie: {
              startAngle: -90,
              endAngle: 270,
            },
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            type: "gradient",
          },
          labels: Object.keys(langData),
          legend: {
            formatter: function (val, opts) {
              return val + " - " + opts.w.globals.series[opts.seriesIndex];
            },
          },
          title: {
            text: "Percentage by Company",
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
      });
      setGraph({
        // series: Object.values(props.percentageByCompany.map(p => p.toFixed(2))),
        series: [positive, negative, neutral],
        options: {
          chart: {
            width: 380,
            type: "donut",
          },
          plotOptions: {
            pie: {
              startAngle: -90,
              endAngle: 270,
            },
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            type: "gradient",
          },
          labels: ["positive", "negative", "neutral"],
          legend: {
            formatter: function (val, opts) {
              return val + " - " + opts.w.globals.series[opts.seriesIndex];
            },
          },
          title: {
            text: "Percentage by Company",
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
      });
    }
  }, [langData]);


  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          {/* <h1 align="center">Sentiment Analysis</h1> */}
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <form
            className="form-inline justify-content-center"
            onSubmit={handleSubmit}
          >
            <input
  type="text"
  className="bg-gray-50 border my-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  placeholder="Enter keyword"
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
  required
  style={{ marginRight: '1%' }}
/>

            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Submit
            </button>
<IoRefreshCircleSharp  className="inline w-6" size={90} />
          </form>
        </div>
      </div>


      <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <a
            href="#"
            className={`${
              activeTab === 1
                ? 'bg-white text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            } inline-block py-2 px-4 font-semibold`}
            onClick={() => handleTabChange(1)}
          >
            WordCLoud
          </a>
          <a
            href="#"
            className={`${
              activeTab === 2
                ? 'bg-white text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            } inline-block py-2 px-4 font-semibold`}
            onClick={() => handleTabChange(2)}
          >
            Statistics
          </a>
          <a
            href="#"
            className={`${
              activeTab === 3
                ? 'bg-white text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            } inline-block py-2 px-4 font-semibold`}
            onClick={() => handleTabChange(3)}
          >
            Raw Twitter Data
          </a>
        </nav>
      </div>
      <div className="p-4">
        {activeTab === 1 && <div className="row">
        <div className="col-sm-12">
          <div id="wordcloud-container">
            <img src={`http://127.0.0.1:5000/image?query=${wordCloud}`} alt="Word Cloud" />
          </div>
        </div>
      </div>}
        {activeTab === 2 &&  <div className="row">
        <div className="col-sm-6">
          <div id="sen">
            <div id="schart">
            <ReactApexChart
                  options={pie.options}
                  series={pie.series}
                  // series={[{ data: pieChartData }]}
                  type="donut"
                  width="100%"
                />
              {/* <Schart positive={positive} negative={negative} neutral={neutral} /> */}
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div id="lan">
            <div id="lchart"></div>
            <ReactApexChart
                  options={graph.options}
                  series={graph.series}
                  // series={[{ data: pieChartData }]}
                  type="donut"
                  width="100%"
                />
            {/* <LanguageChart langData={langData} /> */}
          </div>
        </div>
      </div>}
        {activeTab === 3 && <div className="row">
        <div className="col-sm-12">
          <div id="tweets">
            <div id="tweet_heading"></div>
            <div id="tweet_body">
        {currentTweets?.map((tweet, index) => (
          <div className={`tw-block-parent id=page${index + 1}`} key={index}>
            <div className="timeline-TweetList-tweet">
              <div className="timeline-Tweet">
                <div className="timeline-Tweet-brand">
                  <div className="Icon Icon--twitter"></div>
                </div>
                <div className="timeline-Tweet-author">
                  <div className="TweetAuthor">
                    <a
                      className="TweetAuthor-link"
                      href={`https://twitter.com/${tweet.screen_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    ></a>
                    <span className="TweetAuthor-avatar">
                      <div className="Avatar">
                        <img src={tweet.profile_image} alt="Profile" />
                      </div>
                    </span>
                    <span className="TweetAuthor-name">{tweet.username}</span>
                    <span className="TweetAuthor-screenName">{tweet.screen_name}</span>
                  </div>
                </div>
                <div className="timeline-Tweet-text">
                  <a href={tweet.url} target="_blank" rel="noopener noreferrer">
                    {tweet.text}
                  </a>
                </div>
                <div className="timeline-Tweet-metadata">
                  <span className="timeline-Tweet-timestamp">{tweet?.date.toString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? 'active' : ''}
          >
            {pageNumber}
          </button>
        ))}
      </div>
          </div>
        </div>
      </div>}
      </div>
    </div>


     
     
      
    </div>
  );
}

export default SentimentAnalysis;
