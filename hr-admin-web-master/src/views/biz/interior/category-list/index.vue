<template>
	<a-card title="分类列表" class="role-container" style="padding: 0">
		<template #extra>
			<a-button type="primary" size="small" @click="categoryFormRef.onOpen()">添加</a-button>
		</template>
		<a-menu mode="vertical" v-model:selectedKeys="selectedKeys">
			<a-menu-item v-for="item in categoryList" :key="item.id">
				<div style="display: flex; justify-content: space-between; align-items: center">
					<span>{{ item.categoryName }}</span>
					<div style="display: flex; gap: 8px">
						<a-button type="link" size="small" @click="categoryFormRef.onOpen(item)">
							<template #icon>
								<EditOutlined />
							</template>
						</a-button>
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizCategory(item)">
							<a-button type="text" danger size="small">
								<template #icon>
									<DeleteOutlined />
								</template>
							</a-button>
						</a-popconfirm>
					</div>
				</div>
			</a-menu-item>
		</a-menu>
	</a-card>
	<CategoryFormModal ref="categoryFormRef" @successful="loadData" />
</template>
<script setup>
	import { computed, onMounted, ref } from 'vue'
	import CategoryFormModal from '../category-form/index.vue'
	import bizCategoryApi from '@/api/biz/bizCategoryApi'
	import * as _ from 'lodash-es'
	const categoryList = ref([])
	onMounted(() => {
		loadData()
	})
	// 查询列表
	const loadData = () => {
		bizCategoryApi
			.bizCategoryList({
				categoryType: 'INTERIOR'
			})
			.then((data) => {
				// 预处理数据，提取中文名称
				// categoryList.value = data.map((item) => {
				// 	const nameJson = JSON.parse(item.categoryNameJson)
				// 	const zhName = nameJson.find((lang) => lang.locale === 'zh-CN')?.value || ''
				// 	return {
				// 		...item,
				// 		categoryName: zhName
				// 	}
				// })
				categoryList.value = data
				// 默认选择第一个分类
				if (categoryList.value.length > 0 && (!selectedKeys.value || selectedKeys.value.length === 0)) {
					selectedKeys.value = [categoryList.value[0].id]
				} else {
					selectedKeys.value = []
				}
			})
	}
	let selectedKeys = ref([])
	const selectCategoryId = computed(() => {
		if (!selectedKeys.value && _.isEmpty(selectedKeys.value)) {
			return null
		}
		return selectedKeys.value[0]
	})
	// ----------------------- 添加、修改、删除 ---------------------------------
	const categoryFormRef = ref()
	// 删除
	const deleteBizCategory = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizCategoryApi.bizCategoryDelete(params).then(() => {
			loadData()
		})
	}
	// ----------------------- 以下是暴露的方法内容 ----------------------------
	defineExpose({
		selectCategoryId
	})
</script>
<style scoped lang="less">
	.role-container {
		height: 100%;
		overflow-y: auto;
		:deep(.ant-card-body) {
			padding: 5px;
		}
	}
	.ant-menu-inline,
	.ant-menu-vertical,
	.ant-menu-vertical-left {
		border-right: none;
	}
</style>
