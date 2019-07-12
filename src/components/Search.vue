<template>
  <b-row>
    <b-form-input class="searchForm" autocomplete="off" @input="debounceInput" @focus="onfocus" placeholder="Search for series"></b-form-input>
    <div class="searchResContainer">
      <keep-alive>
        <search-results v-if="hasFocus" :searchQuery="searchQuery"></search-results>
      </keep-alive>
    </div>
    <div>
      Woaoeu
    </div>
  </b-row>
</template>

<script>
import SearchResults from './SearchResults.vue';
import tvmc from '../tvmazeController';
import debounce from 'debounce';
import { getCurTime } from '../utils';

export default {
  name: 'app',
  data() {
    return {
      hasFocus: false,
      searchQuery: {term: '', results: [], time: 0},
    };
  },
  components: {
    'search-results': SearchResults,
  },
  methods: {
    onfocus() {
      this.hasFocus = true;
    },
    onPageClick(event) {
      if(event.target !== this.$el && !this.$el.contains(event.target)) {
        this.hasFocus = false;
      }
    },
    debounceInput: debounce(function(text) {
      if(!text) {
        this.searchQuery.term = text;
        this.searchQuery.results = [];
      }
      const time = getCurTime();
      tvmc.search(text).then(e=>{
        this.searchQuery.term = text;
        this.searchQuery.results = e;
        this.searchQuery.time = getCurTime() - time;
      });
    }, 800)
  },
  mounted() {
    document.addEventListener('click', this.onPageClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onPageClick);
  }
}
</script>