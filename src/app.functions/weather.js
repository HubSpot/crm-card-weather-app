const axios = require('axios');
const { performance } = require('perf_hooks');
const OPENWEATHER_ENDPOINT_URL = 'https://api.openweathermap.org/data/2.5/find';
const { OPENWEATHER_API_KEY } = process.env;

exports.main = async (context, sendResponse) => {
  const { params } = context;
  const { city = 'Boston', state = 'MA', country = 'US' } = params;

  if (!city || !state || !country) {
    sendResponse({ body: { error: 'No city or state provided' } });
  }
  const queryString = state ? `${city}, ${state}, ${country}` : city;
  const queryUrl = `${OPENWEATHER_ENDPOINT_URL}?q=${encodeURIComponent(
    queryString
  )}&units=imperial&appid=${OPENWEATHER_API_KEY}`;

  console.log('Weather Query URL: ', queryUrl);

  let response;
  try {
    const start = performance.now();
    response = await axios.get(queryUrl);
    console.log(`Request time: ${performance.now() - start}`);
  } catch (error) {
    // Handle error
    sendResponse({ body: { error } });
  }

  const { data } = response;
  const queryResponse = data.list[0];
  const {
    name,
    main: { temp, humidity, feels_like, temp_min, temp_max },
    weather,
  } = queryResponse;
  const weatherTypes = weather.map(w => w.main);

  sendResponse({
    body: {
      // Response must match CRM card data shape
      // see https://legacydocs.hubspot.com/docs/methods/crm-extensions/crm-extensions-overview#sales-object-properties
      results: [
        {
          objectId: 1,
          title: `Local weather for ${name}`,
          temperature: `${Math.round(parseInt(temp, 10))}°`,
          feelsLike: `${Math.round(parseInt(feels_like, 10))}°`,
          humidity: `${Math.round(parseInt(humidity, 10))}%`,
          high: `${Math.round(parseInt(temp_max, 10))}°`,
          low: `${Math.round(parseInt(temp_min, 10))}°`,
          weatherTypes: `${weatherTypes.join('and')}`,
          raw: data,
        },
      ],
    },
  });
};
