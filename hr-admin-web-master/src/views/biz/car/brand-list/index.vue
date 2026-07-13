<template>
	<a-card title="品牌" class="role-container" style="padding: 0">
		<template #extra>
			<a-button type="primary" size="small" @click="categoryFormRef.onOpen()">添加</a-button>
		</template>
		<a-menu mode="vertical" v-model:selectedKeys="selectedKeys" class="brand-menu">
			<a-menu-item
				v-for="item in categoryList"
				:key="item.id"
				class="brand-menu-item"
				@click="handleMenuClick(item)"
			>
				<div style="display: flex; justify-content: space-between; align-items: center">
					<div style="display: flex; align-items: center">
						<a-image
							v-if="item.brandImage"
							:src="item.brandImage"
							style="width: 100px; height: 100px; margin-right: 10px; object-fit: contain"
						/>
						<span>{{ item.categoryName }}</span>
					</div>
					<div style="display: flex; gap: 8px">
						<a-button type="link" size="small" @click="categoryFormRef.onOpen(item)">
							<template #icon>
								<EditOutlined />
							</template>
						</a-button>
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizBrand(item)">
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
	import CategoryFormModal from '@/views/biz/car/brand-form/index.vue'
	import bizBrandApi from '@/api/biz/bizBrandApi'
	import * as _ from 'lodash-es'
	const categoryList = ref([])
	onMounted(() => {
		loadData()
	})

	// 查询列表
	const loadData = () => {
		bizBrandApi.bizBrandList({}).then((data) => {
			categoryList.value = data.map((item) => {
				const nameJson = JSON.parse(item.nameJson)
				const zhName = nameJson.find((lang) => lang.locale === 'zh-CN')?.value || ''
				return {
					...item,
					categoryName: zhName
				}
			})
		})
	}

	let selectedKeys = ref([])

	// 处理菜单点击事件
	const handleMenuClick = (item) => {
		if (selectedKeys.value.includes(item.id)) {
			// 如果当前项已被选中，则取消选中
			selectedKeys.value = []
		} else {
			// 否则选中当前项
			selectedKeys.value = [item.id]
		}
	}

	const selectBrandId = computed(() => {
		if (!selectedKeys.value && _.isEmpty(selectedKeys.value)) {
			return null
		}
		return selectedKeys.value[0]
	})

	// ----------------------- 添加、修改、删除 ---------------------------------
	const categoryFormRef = ref()

	// 删除
	const deleteBizBrand = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizBrandApi.bizBrandDelete(params).then(() => {
			loadData()
		})
	}

	// ----------------------- 以下是暴露的方法内容 ----------------------------
	defineExpose({
		selectBrandId
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
	// 自定义品牌菜单样式
	:deep(.brand-menu) {
		.brand-menu-item {
			height: auto !important;
			line-height: normal !important;
			padding: 10px 16px !important;

			&:hover {
				background-color: #f5f5f5;
			}

			// 选中状态的样式
			&.ant-menu-item-selected {
				background-color: #e6f7ff !important; // 加深选中背景色
			}
		}
	}
</style>
