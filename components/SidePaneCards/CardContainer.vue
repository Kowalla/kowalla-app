<template>
  <div class="card card-container">
    <div v-if="headerString.length" class="header">
      <div class="header-content">
        <b>{{ headerString }}</b>
      </div>
    </div>

    <div>
      <slot />
    </div>

    <div v-if="subheaderString.length" class="subheader">
      <nuxt-link v-if="!subheaderIsButton" :to="subheaderUrl" class="subheader-content">
        <b>{{ subheaderString }}</b>
      </nuxt-link>

      <span v-if="subheaderIsButton" class="subheader-content" @click="$emit('subheader-clicked')">
        <b>{{ subheaderString }}</b>
      </span>
    </div>
    <div v-else class="extra-space" />
  </div>
</template>

<script>
export default {
  name: 'CardContainer',
  props: {
    headerString: { type: String, default: '' },
    subheaderString: { type: String, default: '' },
    subheaderUrl: { type: String, default: '' },
    subheaderIsButton: { type: Boolean, default: false },
  },
};
</script>

<style lang="css" scoped>
.card-container {
  width: 100%;
  background-color: white;
  border-radius: 6px;
  margin-bottom: 10px;
}

.header {
  border-bottom: 1px solid #E0DDDD;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
}

.header-content {

  font-size: 1em;
  color: black;
}

.subheader {
  border-top: 1px solid #E0DDDD;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
}

.subheader-content {
  cursor: pointer;
  font-size: 0.75em;
  color: #39C9A0;
}

.subheader-content:hover {
  text-decoration: underline;
}
.extra-space {
  padding-bottom: 5px;
}
</style>
