<template>
  <div style="display:inline-block;">
    <label class="radio-label">Cell Auto-Width: </label>
    <el-radio-group 
      :model-value="modelValue" 
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <el-radio :label="true" border>
        True
      </el-radio>
      <el-radio :label="false" border>
        False
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script setup>
// Vue3 Composition API with script setup
defineProps({
  modelValue: {
    type: Boolean,
    default: true
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