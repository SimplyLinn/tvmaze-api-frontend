<template>
  <img :src="src" :alt="episode.name"  />
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      src: "/static/img/logo_transparent.png",
    };
  },
  props: {
    episode: Object,
  },
  methods: {
  },
  mounted () {
    const episode = this.episode;
    if(!episode.thumbUrl) {
      this.src = "/static/img/GitHub-Mark.png";
      return;
    }
    if(episode.thumb) {
      this.src = URL.createObjectURL(episode.thumb);
    } else {
      fetch(episode.thumbUrl).then(res => {
        res.blob().then(blob=>{
          this.src = URL.createObjectURL(blob);
          episode.thumb = blob;
          episode.save();
        });
      });
    }
  }
}
</script>