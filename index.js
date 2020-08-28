// Global variables
const searchEndpoint = 'https://tastedive.com/api/similar';
const apiKey = '382162-freshCas-XQFB23BA';



// Handles the search button to get values and pass to function
function searchResultsHandler() {
  $('.input-form').submit(e => {
    e.preventDefault();
    const userQuery = $('#user-query').val();
    const userResultsNumber = $('#user-number-results').val() || '10';
    clearInputs();
    getSearchResults(userQuery, userResultsNumber);
  });
}



// Single purpose functions

// toggles the navigation list for the app
function displayNavList() {
  $('.fa-bars').on('click', () => {
    $('.nav-list').slideToggle(250)
  });
} 

// toggles the instructions for the app
function showInstructions() {
  $('#instructions-btn').on('click', () => {
    $('.landing-message').slideToggle(250);
  })
}

// formats params for API request
function formatQueryParameters(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

// clears inputs on search
function clearInputs() {
  $('#user-query').val("");
  $('#user-number-results').val("");
}

//renders API results to DOM
function renderResultsToDom(resultsObj) {
  $('.results-list').empty();
  const episodeNodes = [];
  for (let i = 0; i < resultsObj.Similar.Results.length; i++) {
    const episode = renderEpisode(resultsObj.Similar.Results[i]);
    if (episode) {
      episodeNodes.push(episode);
    };
  }

  $('.results-list').append(episodeNodes.join(''));
}

// builds HTML nodes to be rendered
function renderEpisode(episode) {
  if (!episode.wTeaser && !episode.yUrl) {
    return null;
  }
  return `
    <div class='episode-container'>
      <div class='flex-item'>
        <li>${episode.Name}</li>
        <p>${episode.wTeaser}</p>
      </div
      <div class='flex-item yt-frame'>
        <iframe class="podcast-iframe" src="${episode.yUrl}" target='_blank'></iframe>
      </div>
    </div>
  `;
}

// call the API to get a JSON response
function getSearchResults(query, number = 5) {
  const userSearch = '?q=' + query.split(' ').join("+") + '&';
  const params = {
    type: 'podcast',
    limit: number,
    info: 1,
    k: apiKey
  };
  const PROXY = 'https://cors-anywhere.herokuapp.com/';
  fetch(PROXY + searchEndpoint + userSearch + formatQueryParameters(params))
  .then(rawResponse => {
    if (rawResponse.ok) {
      return rawResponse.json();
    } else {
      throw new Error(message.statusText);
    }
  })
  .then(response => {
    if (response.Similar.Results.length === 0) {
      $('.results-list').empty();
      $('.error-field').text('Looks like we couldent find your podcast :( Check your spelling and try again!').removeClass('hide');
    } else {
      $('.error-field').text('').addClass('hide');
      $('.landing-message').addClass('hide');
      $('#instructions-btn').show();
      renderResultsToDom(response);
    }
  })
  .catch(error => {
    alert(`Looks like something went wrong: ${error.message}`);
  })
}



// Initializers
function startApp() {
  displayNavList();
  searchResultsHandler();
  showInstructions();
}

$(startApp);