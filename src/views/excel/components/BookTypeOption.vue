<template>
  <div style="display:inline-block;">
    <label class="radio-label">Book Type: </label>
    <el-select 
      :model-value="modelValue" 
      @update:model-value="$emit('update:modelValue', $event)"
      style="width:120px;"
    >
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Vue3 Composition API with script setup
defineProps({
  modelValue: {
    type: String,
    default: 'xlsx'
  }
})

defineEmits(['update:modelValue'])

const options = ref(['xlsx', 'csv', 'txt'])
</script>

<style scoped>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>