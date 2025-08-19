<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="padding-left:0;">Filename: </label>
    <el-input
      :model-value="modelValue"
      placeholder="Please enter the file name (default excel-list)"
      style="width:345px;"
      prefix-icon="Document"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
// Vue3 Composition API with script setup
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>