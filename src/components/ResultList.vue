<template>
  <div v-if="results.length">
    <b-row v-for="{ result } in results" :key="result.id">
      <b-col>
        <result-img :result="result" />
      </b-col>
      <b-col>
        {{result.name}}
      </b-col>
    </b-row>
  </div>
  <div v-else>
    NO RESULTS TO SHOW!
  </div>
</template>

<script>
import ResultImg from './ResultImg';

export default {
  name: 'app',
  data() {
    return {
      filterOpen: false,
    };
  },
  components: {
    'result-img': ResultImg,
  },
  props: {
    results: Array,
  },
  methods: {
  }
}
</script>