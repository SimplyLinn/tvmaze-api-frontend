<template>
  <img :src="src" :alt="result.name"  />
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
    result: Object,
  },
  methods: {
    loadImage(result) {
      result = result || this.result;
      if(!result.thumbUrl) {
        this.src = "/static/img/GitHub-Mark.png";
        return;
      }
      if(result.thumb) {
        this.src = URL.createObjectURL(result.thumb);
      } else {
        fetch(result.thumbUrl).then(res => {
          res.blob().then(blob=>{
            this.src = URL.createObjectURL(blob);
            result.thumb = blob;
            result.save();
          });
        });
      }
    }
  },
  mounted () {
    this.loadImage();
  },
  watch: {
    result (newShow) {
      this.loadImage(newShow);
    }
  }
}
</script>