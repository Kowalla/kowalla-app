<template>
  <div class="modal-content">
    <div class="box">
      <article class="media">
        <div class="media-content">
          <client>
            <editor-menu-bar :editor="editor">
              <div slot-scope="{ commands, isActive }" class="field has-addons">
                <a :class="{ 'is-active': isActive.bold() }" class="button is-white" @click="commands.bold">
                  <font-awesome-icon icon="bold" />
                </a>

                <a :class="{ 'is-active': isActive.italic() }" class="button is-white" @click="commands.italic">
                  <font-awesome-icon icon="italic" />
                </a>

                <a :class="{ 'is-active': isActive.strike() }" class="button is-white" @click="commands.strike">
                  <font-awesome-icon icon="strikethrough" />
                </a>

                <a :class="{ 'is-active': isActive.underline() }" class="button is-white" @click="commands.underline">
                  <font-awesome-icon icon="underline" />
                </a>

                <a :class="{ 'is-active': isActive.code() }" class="button is-white" @click="commands.code">
                  <font-awesome-icon icon="code" />
                </a>

                <!--<a-->
                <!--class="button is-white"-->
                <!--:class="{ 'is-active': isActive.paragraph() }"-->
                <!--@click="commands.paragraph"-->
                <!--&gt;-->
                <!--<font-awesome-icon icon="paragraph" />-->
                <!--</a>-->

                <a :class="{ 'is-active': isActive.heading({ level: 1 }) }" class="button is-white" @click="commands.heading({ level: 1 })">
                  H1
                </a>

                <a :class="{ 'is-active': isActive.heading({ level: 2 }) }" class="button is-white" @click="commands.heading({ level: 2 })">
                  H2
                </a>
                <a :class="{ 'is-active': isActive.heading({ level: 3 }) }" class="button is-white" @click="commands.heading({ level: 3 })">
                  H3
                </a>
                <a :class="{ 'is-active': isActive.todo_list() }" class="button is-white" @click="commands.todo_list">
                  <font-awesome-icon icon="tasks" />
                </a>
                <a :class="{ 'is-active': isActive.bullet_list() }" class="button is-white" @click="commands.bullet_list">
                  <font-awesome-icon icon="list-ul" />
                </a>
                <a :class="{ 'is-active': isActive.ordered_list() }" class="button is-white" @click="commands.ordered_list">
                  <font-awesome-icon icon="list-ol" />
                </a>
                <a :class="{ 'is-active': isActive.blockquote() }" class="button is-white" @click="commands.blockquote">
                  <font-awesome-icon icon="quote-right" />
                </a>
                <a class="button is-white" @click="commands.horizontal_rule">
                  <font-awesome-icon icon="minus" />
                </a>
                <a class="button is-white">
                  <input ref="file" class="file-input" type="file" @change="selectFile(commands.image)" />
                  <font-awesome-icon icon="camera" />
                </a>
                <div class="toggle">
                  <BTooltip
                    label="Coworking on Kowalla shows others you're working in real time, and creates a post that lets you update it as you work"
                    type="is-light"
                    position="is-right"
                    multilined
                  >
                    <BButton :class="activeType === 'cowork' ? 'selected' : ''" :disabled="hasActivePost" @click="toggleLivePost('cowork')">
                      <font-awesome-icon icon="users" />&nbsp; Cowork
                    </BButton>
                  </BTooltip>
                  <BTooltip label="You can post a discussion in any space you're subscribed to" type="is-light" position="is-top" multilined>
                    <BButton :class="activeType === 'discussion' ? 'selected' : ''" @click="toggleLivePost('discussion')">
                      <font-awesome-icon icon="comment-dots" />&nbsp; Discussion
                    </BButton>
                  </BTooltip>
                </div>
              </div>
            </editor-menu-bar>
            <div class="editor content">
              <editor-content :editor="editor" class="editor__content" />
            </div>
          </client>
          <div class="level is-paddingless">
            <a :class="{ 'is-loading': s3Loading }" class="level-item button action post" @click="createPost()">
              <b v-if="isLivePost">Start Coworking</b>
              <b v-else>Post</b>
            </a>
            <div class="level-item postDetails">
              <b v-if="isLivePost" class="has-text-grey">on</b>
              <b-dropdown v-if="isLivePost" class="level-item dropdown-container" position="is-bottom-left" aria-role="list" required>
                <div slot="trigger" class="dropdown-selector">
                  <b class="font theme-color">@{{ postingAs.name }}</b>
                  <font-awesome-icon icon="angle-down" class="theme-color selector-child" />
                </div>
                <b-dropdown-item v-for="item in postAsList" :key="item._id" aria-role="listitem" @click="postingAs = item"> @{{ item.name }} </b-dropdown-item>
              </b-dropdown>
              <b v-if="!isLivePost && postInList.length" class="has-text-grey">in</b>
              <b-dropdown v-if="!isLivePost && postInList.length" class="level-item dropdown-container" position="is-bottom-left" aria-role="list">
                <div slot="trigger" class="dropdown-selector">
                  <b class="font theme-color">{{ postingIn.name === 'Select' ? postingIn.name : `#${postingIn.name}` }}</b>
                  <font-awesome-icon icon="angle-down" class="theme-color selector-child" />
                </div>
                <b-dropdown-item v-for="item in postInList" :key="item._id" aria-role="listitem" @click="postingIn = item">
                  {{ item.name === 'Select' ? item.name : `#${item.name}` }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
  <!--</div>-->
</template>

<script>
import editor from '~/mixins/editor';
export default {
  name: 'CreatePostMobile',
  mixins: [editor],
  mounted() {
    this.mixMount();
    this.getDefaultSpace();
  },
};
</script>

<style lang="scss" scoped>
span {
  color: #39c9a0;
}
.box {
  max-width: 100%;
  max-height: 90vh;
  padding: 1em;
}
.modal-content {
  border-radius: 6px;
  margin: 0;
  color: #39c9a0;
  width: 100vw;
  left: 0;
  max-width: 100%;
  position: absolute;
  top: 10vh;
  overflow: visible;
}
.level {
  padding: 1rem;
}
.modal-card-body {
  overflow: visible;
}
.field {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.button {
  padding-left: 0.5em;
  padding-right: 0.5em;
}
.button.action {
  color: white;
  background-color: #39c9a0;
  border-color: #39c9a0;
}
.is-white:hover {
  background-color: #e9ebee;
}
.dropdown-content {
  overflow: visible;
}
div.animation-content {
  margin: 0;
}
.block {
  color: #39c9a0;
}
.editor__content {
  height: 50vh;
  overflow-y: scroll;
  word-break: break-word;
}
.dropdown-container {
  border-radius: 6px;
  cursor: pointer;
}
.dropdown-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 5px;
  margin-left: 5px;
}
.selector-child {
  margin-top: 1px;
  margin-left: 5px;
  margin-right: 5px;
}
.theme-color {
  color: #39c9a0;
}
img {
  border-radius: 6px;
}
.dot {
  height: 13px;
  width: 13px;
  background-color: limegreen;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5em;
}
.isLive {
  background-color: limegreen;
  color: white;
}
.isLive:hover,
.isLive:focus {
  background-color: limegreen;
  color: white;
}
.checkmark {
  margin-right: 0.5em;
}
.optional {
  /*position: fixed;*/
  font-size: 10px;
  color: #7f828b;
}
.postDetails {
  font-size: 12px;
}
.toggle {
  display: flex;
  border: 1px solid lightgrey;
  border-radius: 50px;

  & .b-tooltip:last-child button {
    margin-left: 3px;
  }
}
.toggle button {
  border-radius: 50px !important;
  border: none;
  font-weight: 600;

  &.selected {
    background: #39c9a0;
    color: white;
  }
}
@media screen and (max-width: 768px) {
  .media-content {
    overflow-x: hidden;
  }
}
</style>
