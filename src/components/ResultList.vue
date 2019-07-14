<template>
  <div v-if="results.length">
    <template v-for="({ result }, i ) in results">
    <result-entry :result="result" :key="result.id" ></result-entry>
    <hr v-if="i < results.length-1" :key="result.id+'hr'" />
    </template>
  </div>
  <div v-else>
    NO RESULTS TO SHOW!
  </div>
</template>

<script>
import ResultEntry from './ResultEntry';

export default {
  name: 'app',
  data() {
    return {
      filterOpen: false,
    };
  },
  components: {
    'result-entry': ResultEntry,
  },
  props: {
    results: Array,
  },
  computed: {
  },
  methods: {
  }
}
</script>