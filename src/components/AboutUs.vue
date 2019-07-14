<template>
  <div>
    <h3>About us</h3>
    <p>
      "Us", there's just one of me as of yet. What you're looking at is an overengineered solution to a very simple assignment given to me.
      There's offline caching, service workers and a lot of background stuff running to make this at least not completely break down. It has
      live search, and everything is performed in-browser.
    </p>
    <p>
      There are some corners cut. While I did spend some time optimizing the live search there's still work that could be done there.
      Certain keywords (especially when searching for only the keyword "the") can make the page hang for several seconds on my desktop machine.
      I did not have time to look into solutions for that due to time constraints, and any attempt at doing a "quick and dirty fix" would have severely
      affected the quality of the search results.
    </p>
    <p>
      Another place where corners where cut, design wise, is that I'm trusting the size of the thumbnails from the tvmaze API. And I didn't structure
      my scss file in any logical way, nor did I split it up into multiple files. I gave myself the deadline Sunday night and in order to meet that
      tight of a deadline some corners have to be cut.
    </p>
    <p>
      Defining features are:
      <ul>
        <li>Progressive Web App. You can "install" this webpage on PC's and phones.</li>
        <li>Offline caching of the show database. You search for and read the summary of the shows even while offline. And the episode data if you've viewed it at least once while online</li>
        <li>Online recovery, if you're visiting a page without a connection, it automatically connects and downloads any missing data to populate the page</li>
        <li>Responsive design, using bootstrap it fits most device screens</li>
        <li>Live search, it shows search results while typing</li>
      </ul>
    </p>
    <p>
      I think that's all I wanna write here. I let the project speak for itself now.<br/>
      - Linn
    </p>
  </div>
</template>