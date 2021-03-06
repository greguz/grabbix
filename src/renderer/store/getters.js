export default {
  activePlugins(state) {
    return state.plugins.filter(
      plugin =>
        plugin.disabled !== true && plugin.languages.includes(state.language)
    );
  },

  plugin(state) {
    if (state.comics.active) {
      return state.plugins.find(
        plugin => plugin.id === state.comics.active.plugin
      );
    }
  }
};
