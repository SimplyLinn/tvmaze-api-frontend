<template>
  <b-container v-if="show" style="margin-top: 1em;">
    <b-row>
      <b-col cols="3" sm="2">
        <result-img style="width: 100%;" :result="show" />
      </b-col>
      <b-col cols="9" sm="10">
        <template v-if="show.premiered"><b-badge>{{show.premiered.substring(0,4)}}</b-badge>&nbsp;</template>
        <template v-if="show.type"><b-badge>{{show.type}}</b-badge>&nbsp;</template>
        <template v-if="show.status" ><b-badge :variant="statusVariant">{{show.status}}</b-badge>&nbsp;</template>
        <h4>{{show.name}} <template v-if="show.genres"><template v-for="genre in show.genres"><b-badge :key="show.id + genre">{{genre}}</b-badge>&nbsp;</template></template></h4><br/>
        <span>{{summaryText}}</span>
      </b-col>
    </b-row>
    <hr/>
    <template v-for="(season, i) in seasons">
      <b-row v-if="season" :key="`${show.id}s${i}`">
        <b-col><h5>Season {{i + 1}}</h5></b-col>
      </b-row>
      <div v-if="season" :key="`${show.id}s${i}list`">
        
        <b-list-group>
          <b-list-group-item button v-for="episode in season" :key="`${show.id}s${i}e${episode.number}`">S{{String(episode.season).padStart(2,'0')}}E{{String(episode.number).padStart(2,'0')}}: {{episode.name}}</b-list-group-item>
        </b-list-group>
      </div>
      <hr v-if="season && i < seasons.length - 1" :key="`${show.id}s${i}hr`" />
    </template>
  </b-container>
</template>

<script>
import { convertHtmlToText } from '../utils';
import { EventBus } from '../event-bus';
import tvmc from '../tvmazeController';
import ResultImg from './ResultImg';

const SUMMARY_LENGTH = 350;
export default {
  name: 'app',
  data() {
    return {
      show: null
    };
  },
  components: {
    'result-img': ResultImg,
  },
  props: {
    id: Number
  },
  computed: {
    summaryText () {
      const text = convertHtmlToText(this.show.summary);
      return text;
    },
    statusVariant () {
      switch(this.show.status.toLowerCase()) {
        case 'running':
          return 'success';
        case 'ended':
          return 'danger';
        case 'in development':
          return 'warning';
        default:
          return null;
      }
    },
    seasons() {
      if(!this.show.episodes) return [];
      const seasonsArr = [];
      this.show.episodes.forEach(e => {
        const seasonIndex = e.season - 1;
        if(!Array.isArray(seasonsArr[seasonIndex])) seasonsArr[seasonIndex] = [];
        seasonsArr[seasonIndex].push(e);
      });
      seasonsArr.forEach(e=>e.sort((a,b)=>a.number - b.number));
      return seasonsArr;
    }
  },
  mounted() {
    this.fetchShow(this.id);
  },
  methods: {
    async fetchShow(id) {
      console.log(`Fetching show: ${id} (${typeof id})`);
      try {
        this.show = await tvmc.getShow(id);
      } catch (err) {
        console.error(err);
      }
    }
  },
  watch: {
    id (newId, oldId) {
      if(oldId === newId) return;
      this.fetchShow(newId);
    }
  }
}
</script>
