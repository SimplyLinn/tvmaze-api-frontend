<template>
  <b-row @click="clicked" class="resultEntry">
    <b-col cols="3" sm="2">
      <result-img style="width: 100%;" :result="result" />
    </b-col>
    <b-col cols="9" sm="10">
      <template v-if="result.premiered"><b-badge>{{result.premiered.substring(0,4)}}</b-badge>&nbsp;</template>
      <template v-if="result.type"><b-badge>{{result.type}}</b-badge>&nbsp;</template>
      <template v-if="result.status" ><b-badge :variant="statusVariant">{{result.status}}</b-badge>&nbsp;</template>
      <h5>{{result.name}} <template v-if="result.genres"><template v-for="genre in result.genres"><b-badge :key="result.id + genre">{{genre}}</b-badge>&nbsp;</template></template></h5><br/>
      <span>{{summaryText}}</span>
    </b-col>
  </b-row>
</template>

<script>
import ResultImg from './ResultImg';
import { convertHtmlToText } from '../utils';
import { EventBus } from '../event-bus';

const SUMMARY_LENGTH = 350;
export default {
  name: 'app',
  data() {
    return {
    };
  },
  components: {
    'result-img': ResultImg,
  },
  props: {
    result: Object,
  },
  computed: {
    summaryText () {
      const text = convertHtmlToText(this.result.summary);
      if(text.length < SUMMARY_LENGTH) return text;
      return text.substring(0, SUMMARY_LENGTH-3)+"...";
    },
    statusVariant () {
      switch(this.result.status.toLowerCase()) {
        case 'running':
          return 'success';
        case 'ended':
          return 'danger';
        case 'in development':
          return 'warning';
        default:
          return null;
      }
    }
  },
  methods: {
    clicked () {
      EventBus.$emit('closeSearch');
      this.$router.push({ name: 'show', params: { id: this.result.id } })
    }
  }
}
</script>