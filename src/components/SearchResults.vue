<template>
  <b-container class="searchbox">
    <template v-if="searchQuery.term.length >= 3">
      <b-row style="margin-bottom: 5px;">
        <b-col>Showing {{`${searchQuery.results.length} result${searchQuery.results.length === 1 ? '' : 's'}`}} for <b>{{searchQuery.term}}</b> (query took {{searchQuery.time}}ms)</b-col>
      </b-row>
      <result-list :results="searchQuery.results" />
    </template>
    <b-row v-else>
      Type at least 3 characters to search.
    </b-row>
    <div v-if="searching" class="searchBlur"></div>
  </b-container>
</template>

<script>
import ResultList from './ResultList'

export default {
  name: 'app',
  data() {
    return {
      filterOpen: false,
    };
  },
  components: {
    'result-list': ResultList,
  },
  props: {
    searchQuery: Object,
    searching: Boolean,
  },
  methods: {
  }
}
</script>