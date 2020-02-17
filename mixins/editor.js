import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlockHighlight,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Image,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  TrailingNode,
  Placeholder,
} from 'tiptap-extensions';
import Iframe from '~/components/Modals/Creation/Iframe';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/htmlbars';
import { mapGetters } from 'vuex';

const editor = {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: {
    postType: { type: String, default: 'discussion' },
  },
  data() {
    return {
      activeType: this.postType,
      postingAs: { name: this.$store.state.user.username, type: 'user' },
      postingIn: { name: 'Select' },
      editor: null,
      file: '',
      s3Loading: false,
      clearPhoto: false,
      photoUrl: '',
      defaultContent: '<p></p>',
    };
  },
  computed: {
    ...mapGetters('coworkers', ['hasActivePost']),
    postAsList() {
      let list = [];
      if (this.isLivePost) {
        this.$store.state.user.owned.forEach(function(owned) {
          if (owned.isProject) {
            list.push({ name: owned.name, id: owned.projectId, type: 'project' });
          }
        });
      }
      return list;
    },
    postInList() {
      let list = [];
      if (!this.isLivePost) {
        list.push({
          name: 'Select',
        });
        this.$store.state.user.subscriptions.forEach(function(sub) {
          if (!sub.isProject) {
            list.push({ name: sub.name, id: sub.spaceId });
          }
        });
        this.$store.state.user.owned.forEach(function(own) {
          if (!own.isProject) {
            list.push({ name: own.name, id: own.spaceId });
          }
        });
      }
      return list;
    },
    isLivePost() {
      return this.activeType === 'cowork';
    },
  },
  async beforeDestroy() {
    if (this.editor !== null) {
      if (this.clearPhoto === true) {
        const fileName = await this.photoUrl.split('post-pics/')[1];
        const type = this.postingAs.id ? 'project' : 'space';
        await this.$axios.$post('/api/v1/imageDelete', {
          bucket: `kowalla-dev/${type}/post-pics`,
          fileName,
        });
      }
      await this.editor.destroy();
    }
  },
  methods: {
    mixMount() {
      this.editor = new Editor({
        autoFocus: true,
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlockHighlight({
            languages: {
              javascript,
              html,
              css,
            },
          }),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new Image(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
          new TrailingNode(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'What are you working on?',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
          }),
          // Custom Extensions
          new Iframe(),
        ],
        content: this.defaultContent,
        onUpdate: ({ getHTML }) => {
          this.html = getHTML();
        },
      });
    },
    getDefaultSpace() {
      let defaultPostIn;
      const subscribed = this.$store.state.user.subscriptions.find(s => s.name === this.$route.params.spacename);
      const owned = this.$store.state.user.owned.find(s => s.name === this.$route.params.spacename);
      console.log(subscribed);
      console.log(owned);
      if (subscribed !== undefined) {
        defaultPostIn = subscribed;
      } else if (owned !== undefined) {
        defaultPostIn = owned;
      }
      if (defaultPostIn !== undefined) {
        this.postingIn = { name: defaultPostIn.name, spaceId: defaultPostIn.spaceId };
      }
    },
    toggleLivePost(type) {
      this.activeType = type;
      if (type === 'cowork') {
        if (this.postAsList.some(x => x.type === 'project')) {
          this.postingAs = this.postAsList[0];
        } else {
          this.$buefy.toast.open({
            duration: 6000,
            message: 'Working on something? You must create a project in order to make a live post!',
            position: 'is-top',
            type: 'is-danger',
          });
        }
      } else {
        this.postingAs = this.postAsList[0];
      }
    },
    async createPost() {
      this.s3Loading = true;

      if (this.html) {
        let StrippedString = this.html.replace(/(<([^>]+)>)/gi, '');
        if (StrippedString.length === 0) {
          this.$buefy.toast.open({
            duration: 5000,
            message: "You can't make a blank post!",
            position: 'is-top',
            type: 'is-danger',
          });
          this.s3Loading = false;
          return null;
        }
      } else if (this.html === undefined) {
        this.$buefy.toast.open({
          duration: 5000,
          message: "You can't make a blank post!",
          position: 'is-top',
          type: 'is-danger',
        });
        this.s3Loading = false;
        return null;
      }
      // force the user to post it to a space
      if (this.postingAs.type === 'user' && this.postingIn.spaceId === undefined) {
        this.$buefy.toast.open({
          duration: 5000,
          message: 'You must select a space to post in',
          position: 'is-top',
          type: 'is-danger',
        });
        this.s3Loading = false;
        return null;
      }

      let postObj = await this.$axios.$post('/api/v1/posts', {
        profileId: this.$store.state.user._id,
        projectId: this.postingAs.id !== this.$store.state.user._id ? this.postingAs.id : undefined,
        spaceId: this.postingIn.spaceId || undefined,
        content: this.html,
        duration: null,
        start: new Date(),
        end: null,
        isActive: this.isLivePost,
        username: this.$store.state.user.username,
      });
      this.$store.commit('user/incrementPostCount');
      this.$emit('post-created', postObj);

      this.clearPhoto = false;
      this.s3Loading = false;
      this.$parent.close();
      if (this.isLivePost) {
        this.$socket.client.emit('join', {
          username: this.$store.state.user.username,
          profilePicture: this.$store.state.user.profilePicture,
        });
        this.$router.push({ path: `/live/${this.$store.state.user.username}` });
        if (this.$route.name.includes('live')) {
          this.$router.go();
        }
      }
    },
    async selectFile(command) {
      this.file = this.$refs.file.files[0];

      this.sendFile(command);
    },
    async sendFile(command) {
      this.clearPhoto = true;
      const formData = new FormData();
      formData.append('file', this.file);
      const type = this.postingAs.id ? 'project' : 'space';
      formData.append('type', type);
      try {
        const image = await this.$axios.$post('/api/v1/posts/imageUpload', formData);
        this.photoUrl = image.file;
        command({ src: image.file });
      } catch (err) {
        console.log(err);
        this.$buefy.toast.open({
          duration: 5000,
          message: "There was an error with your file. Please confirm it's less than 10MB and a png, jpeg, or gif.",
          position: 'is-top',
          type: 'is-danger',
        });
      }
    },
  },
};
export default editor;
