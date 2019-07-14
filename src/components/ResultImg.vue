<template>
  <img :src="src" :alt="result.name"  />
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      src: "/static/img/placeholder-show-thumb.png",
    };
  },
  props: {
    result: Object,
  },
  methods: {
    loadImage(result) {
      result = result || this.result;
      if(!result.thumbUrl) {
        this.src = "/static/img/no-image-show-thumb.png";
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
        }).catch(() => {
          this.src = "/static/img/no-connection-show-thumb.png";
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