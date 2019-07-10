<template>
  <div id="app">
    <b-container>
      <b-navbar toggleable="md">
        <b-navbar-brand href="#"><img src="/img/logo_transparent.png" style="height: 100px;" alt="Linn's TV Search"/></b-navbar-brand>
        <b-navbar-toggle target="mainNav">
          test?
        </b-navbar-toggle>
        <b-collapse is-nav id="mainNav">
          <b-navbar-nav>
            <b-nav-item href="">About Us</b-nav-item>
            <b-nav-item href="https://github.com/SimplyLinn/tvmaze-api-frontend" class="nav-github-link"><img class="icon" src="/img/GitHub-Mark.png"> Github</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-row>
        <b-form-input placeholder="Search for series"></b-form-input>
      </b-row>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
</style>
