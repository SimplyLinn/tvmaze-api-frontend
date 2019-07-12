<template>
  <b-container class="searchbox">
    <b-button pill variant="outline-secondary" :pressed="filterOpen" @click="filterOpen=!filterOpen">
      <div class="icon center">
        <img src="/static/img/filter_icon.svg" alt="">
        <img class="onhover" src="/static/img/filter_icon_light.svg" alt="">
      </div>
      filters
    </b-button>
    <keep-alive>
      <b-row v-if="filterOpen">
        FILTER STUFF HERE
      </b-row>
    </keep-alive>
    <b-row v-if="searchString">
      <h3>You searched for: {{searchString}}</h3>
    </b-row>
    <b-row v-else>
      <h3>Start typing to search.</h3>
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      filterOpen: false,
    };
  },
  props: {
    searchString: String,
  },
  methods: {
  }
}
</script>