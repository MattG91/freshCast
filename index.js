// Global variables
let searchEndpoint = 'https://tastedive.com/api/similar';
const apiKey = '382162-freshCas-XQFB23BA'

// Handler functions
function searchResultsHandler() {
  $('#search-btn').on('click', e => {
    e.preventDefault();
    const userQuery = $('#user-query').val();
    const userResultsNumber = $('#user-number-results').val();
    $('#user-query').val("");
    $('#user-number-results').val("");
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
     
function getSearchResults(query, number) {
  console.log(query);
  if (query == '' || number == '') {
    alert('Please fill out both search fields')
  } else {
    let userSearch = 'q=' + query.split(' ').join("+") + '&';
    let params = {
      type: 'podcast',
      limit: number,
      info: 1,
      k: apiKey
    };
  
    let results = $.ajax({
      url: 'https://tastedive.com/api/similar',
      data: userSearch + formatQueryParameters(params),
      dataType: 'jsonp',
      type: 'GET'
    }).done(function(output) {
      console.log(output);
      if (output.Similar.Results.length === 0) {
        alert('Looks like we couldent find your podcast:( Check your spelling or try another!')
      } else {
        renderResultsToDom(output);
      }
    })
  }
} 
  // let url = formatQueryUrl(query, number);
  // fetch(url,)
  // .then(response => {
  //   if (response.ok) {
  //     console.log(response.json());
  //   }
  // })


// function formatQueryUrl(query, number) {
//   let userSearch = query.split(' ').join("+");
//   let userUrl = searchEndpoint + `q=${userSearch}` + `&info=1` +  `&type=podcast` + `&limit=${number}` + `&k=${apiKey}`;
//   console.log(userUrl);
//   return userUrl;
// }


function renderResultsToDom(resultsObj) {
  $('.results-list').empty();
  for (let i=0; i<resultsObj.Similar.Results.length; i++) {
    let domNode = `
    <li><a href='${resultsObj.Similar.Results[i].yUrl}' target='_blank'>${resultsObj.Similar.Results[i].Name}</a></li>
    <p>${resultsObj.Similar.Results[i].wTeaser}</p>
    `
    $('.results-list').append(domNode);
  }
}









// Initializers
function startApp() {
  displayNavList();
  searchResultsHandler();
}

$(startApp);