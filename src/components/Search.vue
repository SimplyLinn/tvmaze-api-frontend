<template>
  <b-row>
    <b-form-input class="searchForm" autocomplete="off" v-model="searchTerm" @input="debounceInput" @focus="onfocus" placeholder="Search for series"></b-form-input>
    <div class="searchResContainer">
      <keep-alive>
        <search-results v-if="hasFocus" :searchQuery="searchQuery" :searching="searching"></search-results>
      </keep-alive>
    </div>
    <router-view></router-view>
  </b-row>
</template>

<script>
import SearchResults from './SearchResults.vue';
import tvmc from '../tvmazeController';
import debounce from 'debounce';
import { getCurTime, SearchCancelledError } from '../utils';
import { EventBus } from '../event-bus';

export default {
  name: 'app',
  data() {
    return {
      hasFocus: false,
      searchQuery: {term: '', results: [], time: 0},
      searching: false,
      searchTerm: '',
      cancelFunc: null,
      busHandler: null,
    };
  },
  components: {
    'search-results': SearchResults,
  },
  methods: {
    onCloseSearch() {
      this.hasFocus = false;
    },
    onfocus() {
      this.hasFocus = true;
    },
    onPageClick(event) {
      if(event.target !== this.$el && !this.$el.contains(event.target)) {
        this.hasFocus = false;
      }
    },
    debounceInput: debounce(function(text) {
      this.doSearch(text);
    }, 100),
    doSearch (text) {
      if(text[text.length-1] === ' ') {
        text = text.trim() + ' ';
      } else {
        text = text.trim();
      }
      if(this.cancelSearch) {
        this.cancelSearch();
        this.cancelSearch = null;
      }
      if(text.length < 3) {
        this.searchQuery.term = text;
        this.searchQuery.results = [];
        this.searchQuery.time = 0;
        return;
      }
      const time = getCurTime();
      this.searching = true;
      tvmc.search(text, (cancelFunc)=>this.cancelSearch=cancelFunc).then(e=>{
        this.cancelSearch = null;
        this.searching = false;
        this.searchQuery.term = text;
        this.searchQuery.results = e;
        this.searchQuery.time = getCurTime() - time;
      }).catch(err => {
        // If we cancelled the search... just don't do anything.
        // Otherwise rethrow the error!
        if(!(err instanceof SearchCancelledError)) {
          this.searching = false;
          throw err;
        }
      });
    }
  },
  mounted() {
    document.addEventListener('click', this.onPageClick);

    this.busHandler = () => this.onCloseSearch();
    EventBus.$on('closeSearch', this.busHandler);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onPageClick);

    EventBus.$off('closeSearch', this.busHandler);
    this.busHandler = null;
  }
}
</script>