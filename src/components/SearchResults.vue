<template>
  <b-container class="searchbox">
    <template v-if="searchQuery.term">
    <b-row>
      <b-col>Showing {{`${searchQuery.results.length} result${searchQuery.results.length === 1 ? '' : 's'}`}} for <b>{{searchQuery.term}}</b> (query took {{searchQuery.time}}ms)</b-col>
    </b-row>
    <result-list :results="searchQuery.results" />
    </template>
    <b-row v-else>
      Start typing to search.
    </b-row>
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
  },
  methods: {
  }
}
</script>