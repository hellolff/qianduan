<template>
	<div class="height100">
		<a-row :gutter="10" type="flex" class="height100">
			<a-col flex="300px">
				<CategoryList ref="categoryList" />
			</a-col>
			<a-col flex="1" class="role-setting">
				<AccessoryList />
			</a-col>
		</a-row>
	</div>
</template>
<script setup>
	import { computed, provide, ref } from 'vue'
	import CategoryList from './category-list/index.vue'
	import AccessoryList from './accessory-list/index.vue'
	defineProps({
		value: Object
	})
	defineEmits(['update:value'])
	let categoryList = ref()
	const selectCategoryId = computed(() => {
		if (!categoryList.value) {
			return null
		}
		return categoryList.value.selectCategoryId
	})
	provide('selectCategoryId', selectCategoryId)
</script>
<style scoped lang="less">
	.height100 {
		height: 100%;
		flex-wrap: nowrap;
	}
	.role-setting {
		width: calc(100% - 250px);
	}
</style>
