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
    <div v-if="show.episodesFetched">
      <template v-for="(season, i) in seasons" >
        <b-row v-if="season" :key="`${show.id}s${i}`">
          <b-col><h5>Season {{i + 1}}</h5></b-col>
        </b-row>
        <div v-if="season" :key="`${show.id}s${i}list`">
          
          <b-list-group>
            <b-list-group-item button v-for="episode in season" :key="`${show.id}s${i}e${episode.number}`" @click="routeEpisode(episode.season, episode.number)">
              <episode-img :show="show" :episode="episode" />
              <span style="position: absolute; top: .5em;">S{{pad(episode.season)}}E{{pad(episode.number)}}</span>
              <b>{{episode.name}}</b>
            </b-list-group-item>
          </b-list-group>
        </div>
        <hr v-if="season && i < seasons.length - 1" :key="`${show.id}s${i}hr`" />
      </template>
    </div>
    <div v-else-if="isOffline">
      Episode data unavailable while offline.
    </div>
    <div v-else>
      There are no episodes to show.
    </div>
    <b-modal ref="episode-modal" size="lg" @hidden="closeEpisode" :visible="!!selectedEpisode" centered>
      <template v-if="selectedEpisode">
        <episode-img :show="show" :episode="selectedEpisode" class="float-left" />
        {{episodeText}}
      </template>
      <div slot="modal-title" v-if="selectedEpisode">
        {{selectedEpisode.name}} <b-badge>S{{pad(selectedEpisode.season)}}E{{pad(selectedEpisode.number)}}</b-badge>
      </div>
      <div slot="modal-footer" class="w-100" v-if="selectedEpisode">
        <p class="float-left" v-if="selectedEpisode.airdate">Aired: {{selectedEpisode.airdate}}</p>
        <b-button
            variant="danger"
            size="sm"
            class="float-right"
            @click="hideModal"
          >
            Close
        </b-button>
      </div>
    </b-modal>
  </b-container>
  <div v-else-if="isOffline">
    You are offline and this show is not in the local database.
  </div>
</template>

<script>
import { convertHtmlToText } from '../utils';
import tvmc from '../tvmazeController';
import ResultImg from './ResultImg';
import EpisodeImg from './EpisodeImg';

export default {
  name: 'app',
  data() {
    return {
      show: null,
      isOffline: navigator.onLine === false
    };
  },
  components: {
    'result-img': ResultImg,
    'episode-img': EpisodeImg
  },
  props: {
    id: Number,
    episode: String
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
    },
    selectedEpisode() {
      if(!this.episode) {
        return null;
      }
      try {
        let [, season, ep] = this.episode.match(/S(\d{2,})E(\d{2,})/)
        season--;
        ep = +ep;
        return this.seasons[season].find(e => e.number === ep);
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    episodeText() {
      if(!this.selectedEpisode) return '';
      const text = convertHtmlToText(this.selectedEpisode.summary);
      return text;
    }
  },
  methods: {
    async fetchShow(id) {
      console.log(`Fetching show: ${id} (${typeof id})`);
      try {
        this.show = await tvmc.getShow(id);
      } catch (err) {
        console.error(err);
      }
    },
    pad(val, size, char) {
      size = size || 2;
      char = char || '0';
      return String(val).padStart(size, char);
    },
    routeEpisode(s, e) {
      const seasonString = `S${this.pad(s)}E${this.pad(e)}`;
      this.$router.push({ name: 'show', params: { id: this.show.id, episode: seasonString } })
    },
    closeEpisode() {
      this.$router.push({ name: 'show', params: { id: this.show.id } })
    },
    hideModal() {
        this.$refs['episode-modal'].hide()
    },
    online() {
      this.isOffline = false;
      if(!this.show || !this.show.episodes) {
        this.fetchShow(this.id);
      }
    },
    offline() {
      this.isOffline = true;
    }
  },
  watch: {
    id (newId, oldId) {
      if(oldId === newId) return;
      this.fetchShow(newId);
    }
  },
  mounted() {
    window.addEventListener('online', this.online);
    window.addEventListener('offline', this.offline);
    this.fetchShow(this.id);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.online);
    window.removeEventListener('offline', this.offline);
  }
}
</script>
