<template>
  <div class="card profile-card-container">
    <nuxt-link :to="getRoute">
      <img :src="profilePictureUrl" :class="{ 'is-mobile': isMobile }" class="image" />
    </nuxt-link>

    <nuxt-link :to="getRoute" class="name font-family">
      <b>{{ name }}</b>
    </nuxt-link>

    <div class="username font-family">
      <nuxt-link :to="getRoute" class="username-link">
        <b>{{ type === 'space' ? `#${name}` : `@${username}` }}</b>
      </nuxt-link>
    </div>

    <div :class="{ 'is-mobile': isMobile }" class="level is-marginless">
      <!-- need to convert to mobile columns -->
      <div v-for="item in stats" :key="item.name" class="level-item stat-container is-paddingless">
        <div class="stat-title">
          <b>{{ item.name }}</b>
        </div>

        <div class="stat-info">
          <b>{{ item.stat }}</b>
        </div>
      </div>
    </div>
    <!--<div class="subheader">-->
    <!--<nuxt-link :to="subheaderUrl" class="subheader-content">-->
    <!--<b>{{ subheaderString }}</b>-->
    <!--</nuxt-link>-->
    <!--</div>-->
  </div>
</template>
<script>
export default {
  name: 'ProfileCard',
  props: {
    name: { type: String, default: '' },
    username: { type: String, default: '' },
    profilePictureUrl: { type: String, default: '' },
    subheaderString: { type: String, default: 'test' },
    subheaderUrl: { type: String, default: '/about' },
    stats: { type: Array, default: () => [] },
    type: { type: String, default: '' },
    isMobile: { type: Boolean, default: false },
  },
  computed: {
    getStatInfoByIndex(i) {
      return this.stats[i].name;
    },
    getRoute() {
      return `/${this.type}/${this.username}`;
    },
  },
};
</script>

<style lang="css" scoped>
.profile-card-container {
  display: flex;
  width: 100%;
  text-align: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  border-radius: 6px;
  height: auto;
}

.image {
  border-radius: 6px;
  margin-top: 16px;
  margin-bottom: 8px;
  height: 86px;
  width: 86px;
  border: 1px solid #E0DDDD;
}

.image.is-mobile {
  height: 48px;
  width: 48px;
}

.font-family {
  text-decoration: none;
}

.name {
  font-size: 1em;
  color: black;
  text-decoration: none;
  text-align: center;
}

.username {
  margin-top: -4px;
  font-size: 0.75em;
  color: #999
}

.username:hover {
  color: #39C9A0;
  cursor: pointer;
}

.stat-container {
  display: flex;
  flex-direction: column;
  width: 48px;
}

.stat-title {
  font-size: 0.75em;
  color: black;
}

.stat-info {
  margin-top: -2px;
  font-size: 1em;
  color: #39C9A0;
}

.subheader {
  border-top: 1px solid #E0DDDD;
  padding-top: 4px;
  padding-bottom: 4px;
  width: 100%;
  text-align: center;
  vertical-align: middle;
}

.subheader-content {
  font-size: 0.75em;
  color: #39C9A0;
}

.subheader-content:hover {
  text-decoration: underline;
}

.username-link {
  font-size: 1em;
  color: #999;
  text-decoration: none;
  cursor: pointer;
}

.username-link:hover {
  text-decoration: underline;
  color: #39C9A0;
}
</style>
