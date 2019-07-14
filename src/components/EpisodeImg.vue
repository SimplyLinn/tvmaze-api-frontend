<template>
  <img style="margin-right: 1em;" :src="src" :alt="episode.name"  />
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      src: "/static/img/placeholder-episode-thumb.png",
    };
  },
  props: {
    show: Object,
    episode: Object,
  },
  methods: {
  },
  mounted () {
    const episode = this.episode;
    if(!episode.thumbUrl) {
      this.src = "/static/img/no-image-episode-thumb.png";
      return;
    }
    if(episode.thumb) {
      this.src = URL.createObjectURL(episode.thumb);
    } else {
      fetch(episode.thumbUrl).then(res => {
        res.blob().then(blob=>{
          this.src = URL.createObjectURL(blob);
          episode.thumb = blob;
          this.show.save();
        });
      }).catch(() => {
        this.src = "/static/img/no-connection-episode-thumb.png";
      });
    }
  }
}
</script>