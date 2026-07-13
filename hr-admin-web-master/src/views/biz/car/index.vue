<template>
	<div class="height100">
		<a-row :gutter="10" type="flex" class="height100">
			<a-col flex="300px">
				<BrandList ref="brandList" />
			</a-col>
			<a-col flex="700px" class="role-setting">
				<SeriesList />
			</a-col>
			<a-col flex="1" class="role-setting">
				<ModelList />
			</a-col>
		</a-row>
	</div>
</template>
<script setup>
	import { computed, provide, ref } from 'vue'
	import BrandList from '@/views/biz/car/brand-list/index.vue'
	import SeriesList from '@/views/biz/car/series-list/index.vue'
	import ModelList from '@/views/biz/car/model-list/index.vue'
	defineProps({
		value: Object
	})
	defineEmits(['update:value'])
	let brandList = ref()
	const selectBrandId = computed(() => {
		if (!brandList.value) {
			return null
		}
		return brandList.value.selectBrandId
	})
	provide('selectBrandId', selectBrandId)
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
