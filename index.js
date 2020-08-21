// Global variables
const searchEndpoint = 'https://tastedive.com/api/similar';
const apiKey = '382162-freshCas-XQFB23BA'





// Handler functions
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
function displayNavList() {
  $('.fa-bars').on('click', () => {
    $('.nav-list').toggleClass('hide')
  })
} 

function formatQueryParameters(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function clearInputs() {
  $('#user-query').val("");
  $('#user-number-results').val("");
}


function renderResultsToDom(resultsObj) {
  $('.results-list').empty();
  const episodeNodes = [];
  for (let i = 0; i < resultsObj.Similar.Results.length; i++) {
    const episode = renderEpisode(resultsObj.Similar.Results[i]);
    if (episode) {
      episodeNodes.push(episode);
    }
  }

  $('.results-list').append(episodeNodes.join(''));
}

function renderEpisode(episode) {
  if (!episode.wTeaser && !episode.yUrl) {
    return null;
  }

  return `
    <div class='episode-container'>
      <li>${episode.Name}</li>
      <p>${episode.wTeaser}</p>
      <iframe class="podcast-iframe" src="${episode.yUrl}" target='_blank'></iframe>
    </div>
  `;
}

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
    return rawResponse.json();
  })
  .then(response => {
    console.log(response.Similar.Results);
    if (response.Similar.Results.length === 0) {
      $('.results-list').empty();
      $('.error-field').text('Looks like we couldent find your podcast :( Check your spelling and try again!').removeClass('hide');
    } else {
      $('.error-field').text('').addClass('hide');
      renderResultsToDom(response);
    }
  })
}





// Initializers
function startApp() {
  displayNavList();
  searchResultsHandler();
}

$(startApp);