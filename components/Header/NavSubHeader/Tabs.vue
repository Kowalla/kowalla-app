<template>
  <b-tabs :value="activeTab" :destroy-on-hide="false" position="is-right" @change="changeTab">
    <b-tab-item v-for="(tab, idx) in tabs" :key="idx" :label="tab"></b-tab-item>
  </b-tabs>
</template>

<script>
import LoginHandler from '~/components/Onboarding/LoginHandler';

export default {
  name: 'Tabs',
  props: {
    type: { type: String, default: 'NewsFeedActiveTab' },
  },
  data() {
    return {
      feedOptions: ['All', 'Subscribed'],
      settingsOptions: ['General', 'Integrations'],
    };
  },
  computed: {
    tabs() {
      if (this.type === 'NewsFeedActiveTab') {
        return this.feedOptions;
      } else if (this.type === 'SettingsActiveTab') {
        return this.settingsOptions;
      } else {
        return [];
      }
    },
    activeTab() {
      return this.$store.state.activeTabs[this.type] || 0;
    },
  },
  methods: {
    changeTab(idx) {
      if (!this.$store.state.user.loggedIn) {
        return this.$buefy.modal.open({
          parent: this,
          component: LoginHandler,
          width: 900,
          hasModalCard: true,
        });
      }
      if (this.type !== 'sortOnly') {
        this.$store.commit(`activeTabs/update${this.type}`, idx);
      }
    },
  },
};
</script>

<style scoped></style>
