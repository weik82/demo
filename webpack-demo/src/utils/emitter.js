export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent ? parent.$options.name : null;
      while (parent && name !== componentName) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent && name === componentName) {
        parent.$emit.apply(parent, [eventName, params]);
      }
    },
    broadcast(componentName, eventName, params) {
      function broadcast(componentName, eventName, params) {
        this.$children.forEach(child => {
          let name = child.$options.name;
          if (name === componentName) {
            child.$emit.apply(child, [eventName, params]);
          } else {
            broadcast.apply(child, [componentName, eventName, params]);
          }
        });
      }
      broadcast.apply(this, [componentName, eventName, params]);
    }
  }
};
