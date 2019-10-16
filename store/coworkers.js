export const state = () => ({
  list: [],
});

export const mutations = {
  SOCKET_JOIN(state, list) {
    state.list = [...list];
  },
};

export const getters = {
  activePost(state, getters, rootState) {
    return state.list.some(x => x.username === rootState.user.username);
  },
};
//
// export const actions = {
//   async checkActive() {
//     const post = await this.$axios.$get(
//       `/api/v1/posts/active/${this.$store.state.user.username}`
//     );
//     if (post.isActive) {
//       await this.$socket.emit("join", {
//         username: this.$store.state.user.username,
//         profilePicture: this.$store.state.user.profilePicture,
//       });
//     } else {
//       this.$socket.emit("checkUsers", this.$store.state.coworkers.list.length);
//     }
//   }
// };
