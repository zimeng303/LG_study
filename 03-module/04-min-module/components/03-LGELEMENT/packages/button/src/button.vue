<template>
  <div>
    <button :type="type" @click="handleClick">
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  name: "LgButton",
  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
      evt.preventDefault();
    },
  },
};
</script>

<style>
</style>