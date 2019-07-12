<template>
  <b-row>
    <b-form-input class="searchForm" autocomplete="off" @focus="onfocus" placeholder="Search for series" v-model="searchString"></b-form-input>
    <div class="searchResContainer">
      <keep-alive>
        <search-results v-if="hasFocus" :searchString="searchString"></search-results>
      </keep-alive>
    </div>
    <div>
      Woaoeu
    </div>
  </b-row>
</template>

<script>
import SearchResults from './SearchResults.vue';

export default {
  name: 'app',
  data() {
    return {
      hasFocus: false,
      searchString: "",
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
    }
  },
  mounted() {
    document.addEventListener('click', this.onPageClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onPageClick);
  }
}
</script>