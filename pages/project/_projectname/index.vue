<template lang="html">
  <div class="screen background-tint">
    <div class="container is-fullhd is-hidden-touch">
      <!--
          we'll want to dial in the container fullhd breakpoint
          right now it isn't contained to just ultra-wides, and effects
          normal laptop resolution
      -->

      <!-- two columns, navpane and banner -->
      <div :class="{ firstVisit: this.$store.state.firstVisit.firstVisit }" class="columns is-marginless  main-margin">
        <!-- nav pane -->
        <div :class="{ firstVisit: this.$store.state.firstVisit.firstVisit }" class="column is-one-quarter">
          <Creations />
          <Subscriptions v-if="this.$store.state.user.loggedIn" />
          <Discover />
        </div>

        <div class="column is-three-quarters">
          <Banner
            :id="projectId"
            :banner-url="bannerPictureUrl"
            :banner-title="name"
            :is-subscribed="isSubscribed"
            :is-owner="isOwner"
            banner-title-prefix="@"
            @subscription-button-clicked="updateSubscriptions"
          />

          <!-- new columns for description, profile and project cards -->
          <div class="columns is-marginless newsfeed-padding">
            <div class="column is-half">
              <DescriptionCard header-string="Description">
                {{ projectDescription }}
              </DescriptionCard>

              <EditButton v-if="this.$store.state.user.username === adminUsername" @edit-button-clicked="editProject">
                <b>Edit Settings</b>
              </EditButton>
            </div>

            <div class="column is-one-quarter info">
              <ProfileCard
                :name="projectName"
                :username="name"
                :profile-picture-url="projectProfilePictureUrl"
                :subheader-string="`View ${name}'s stats`"
                :stats="projectStats"
                type="project"
              />
            </div>
            <div class="column is-one-quarter info">
              <ProfileCard
                :name="`${adminFirstName} ${adminLastName}`"
                :username="adminUsername"
                :profile-picture-url="adminProfilePictureUrl"
                :subheader-string="`View ${adminFirstName}'s profile`"
                :subheader-url="`/user/${adminUsername}`"
                :stats="profileStats"
                type="user"
              />
            </div>
          </div>

          <!-- new columns for content and info pane -->
          <div id="postFeed" class="columns is-marginless">
            <!-- post feed -->
            <div class="column is-two-thirds">
              <PostFeed v-if="projectId" :page-id="projectId" type="project" />
            </div>

            <!-- info pane -->
            <div class="column is-one-third">
              <InfoPane>
                <SignupCard v-if="!this.$store.state.user.loggedIn" class="fullWidth" />
              </InfoPane>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div :class="{ firstVisit: this.$store.state.firstVisit.firstVisit }" class="is-marginless is-hidden-desktop mobile-main-margin">
      <Banner
        :id="projectId"
        :banner-url="bannerPictureUrl"
        :banner-title="name"
        :is-subscribed="isSubscribed"
        :is-owner="isOwner"
        banner-title-prefix="@"
        is-mobile
        @subscription-button-clicked="updateSubscriptions"
      />

      <DescriptionCard class="newsfeed-margin" header-string="Description">
        {{ projectDescription }}
      </DescriptionCard>

      <div class="columns is-marginless is-mobile is-centered is-centered is-multiline">
        <div class="column isMobile is-narrow">
          <ProfileCard
            :name="projectName"
            :username="name"
            :profile-picture-url="projectProfilePictureUrl"
            :subheader-string="`View ${name}'s stats`"
            :stats="projectStats"
            type="project"
            is-mobile
          />
        </div>

        <div class="column isMobile is-narrow">
          <ProfileCard
            :name="`${adminFirstName} ${adminLastName}`"
            :username="adminUsername"
            :profile-picture-url="adminProfilePictureUrl"
            :subheader-string="`View ${adminFirstName}'s profile`"
            :subheader-url="`/user/${adminUsername}`"
            :stats="profileStats"
            type="user"
            is-mobile
          />
        </div>
      </div>

      <div>
        <EditButton v-if="this.$store.state.user.username === adminUsername" @edit-button-clicked="editProject">
          <b>Edit Settings</b>
        </EditButton>
      </div>
      <PostFeed v-if="projectId" :page-id="projectId" :is-mobile="true" type="project" />
    </div>
  </div>
</template>

<script>
import Banner from '~/components/SpacesAndProjectsShared/Banner';
import DescriptionCard from '~/components/InfoCards/DescriptionCard';
import ProfileCard from '~/components/InfoCards/ProfileCard';
import InfoPane from '~/components/InfoCards/InfoPane';
import EditButton from '~/components/InfoCards/EditButton';
import SignupCard from '~/components/InfoCards/SignupCard';
import PostFeed from '~/components/PostCards/PostFeed';
import Subscriptions from '~/components/SidePaneCards/Subscriptions';
import Discover from '../../../components/SidePaneCards/Discover';
import Creations from '../../../components/SidePaneCards/Creations';

export default {
  name: 'ProjectPage',
  components: {
    Creations,
    Subscriptions,
    PostFeed,
    SignupCard,
    Banner,
    DescriptionCard,
    ProfileCard,
    InfoPane,
    EditButton,
    Discover,
  },

  data() {
    return {
      name: null,
      bannerPictureUrl: '',
      projectProfilePictureUrl: '',
      projectDescription: '',
      admins: null,
      numSubs: 0,
      projectId: '',
      adminFirstName: '',
      adminLastName: '',
      adminUsername: '',
      projectName: '',
      adminProfilePictureUrl: '',
      projectStats: [],
      profileStats: [],
    };
  },
  computed: {
    isOwner() {
      let isOwner = false;
      if (typeof this.$store.state.user.owned !== 'undefined') {
        for (let i = 0; i < this.$store.state.user.owned.length; i++) {
          if (this.$store.state.user.owned[i].name === this.name) {
            isOwner = true;
          }
        }
      }
      return isOwner;
    },
    isSubscribed() {
      const subscribed = this.$store.state.user.subscriptions ? this.$store.state.user.subscriptions.some(x => x.projectId === this.projectId) : undefined;
      const owned = this.$store.state.user.owned ? this.$store.state.user.owned.some(x => x.projectId === this.projectId) : undefined;
      return !!(subscribed || owned);
    },
  },
  created() {
    this.name = this.$route.params.projectname;
  },
  async mounted() {
    // #############
    // Can probably add all these to a util function to save space in each feed.vue
    // #############

    // get project details
    let infoRes = await this.$axios.$get(`/api/v1/projects/project/${this.name}`);
    this.bannerPictureUrl = infoRes.headerPicture;
    this.projectProfilePictureUrl = infoRes.profilePicture;
    this.projectId = infoRes._id;
    this.projectName = infoRes.projectName;
    this.numSubs = infoRes.subscribers;
    this.projectDescription = infoRes.description;
    this.admins = infoRes.admins;

    // fill project stats
    this.projectStats.push({ name: 'Subs', stat: infoRes.subscribers });
    this.projectStats.push({ name: 'Karma', stat: infoRes.reputation });
    this.projectStats.push({ name: 'Posts', stat: infoRes.postCount });

    // get admin details
    let adminRes = await this.$axios.$get(`/api/v1/profiles/${this.admins[0]}`);
    this.adminFirstName = adminRes.firstName;
    this.adminLastName = adminRes.lastName;
    this.adminUsername = adminRes.username;
    this.adminProfilePictureUrl = adminRes.profilePicture;

    // fill profil estats
    this.profileStats.push({ name: 'Karma', stat: adminRes.reputation });
    this.profileStats.push({ name: 'Posts', stat: adminRes.postCount });
    this.profileStats.push({
      name: 'Replies',
      stat: adminRes.commentCount,
    });
    document.title = `Kowalla - @${this.name}`;
  },
  methods: {
    updateSubscriptions(subBool) {
      let subInfo = {
        name: this.name,
        pictureUrl: this.projectProfilePictureUrl,
        numSubs: subBool ? this.projectStats[0].stat + 1 : this.projectStats[0].stat - 1,
        projectId: this.projectId,
      };

      this.projectStats[0].stat = subBool ? this.projectStats[0].stat + 1 : this.projectStats[0].stat - 1;

      let subObj = { subBool, ...subInfo };

      this.$store.dispatch('user/updateSubscriptions', subObj);
    },
    editProject() {
      this.$router.push({
        path: `/project/${this.name}/edit`,
      });
    },
  },
};
</script>

<style lang="css" scoped>
.column.isMobile {
  width: 50%;
}
div.level {
  top: 0;
}
div.column.is-one-quarter.info {
  height: auto;
}
</style>
