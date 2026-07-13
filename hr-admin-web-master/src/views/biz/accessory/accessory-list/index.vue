<template>
	<a-card :bordered="false">
		<s-table
			ref="tableRef"
			:columns="columns"
			:data="loadData"
			:alert="options.alert.show"
			bordered
			:row-key="(record) => record.id"
			:tool-config="toolConfig"
			:row-selection="options.rowSelection"
		>
			<template #operator class="table-operator">
				<a-space>
					<a-button
						type="primary"
						@click="formRef.onOpen(undefined, categoryId)"
						v-if="hasPerm('bizAccessoryAdd') && categoryId && categoryId !== ''"
					>
						<template #icon><plus-outlined /></template>
						新增
					</a-button>
					<xn-batch-button
						v-if="hasPerm('bizAccessoryBatchDelete')"
						buttonName="批量删除"
						icon="DeleteOutlined"
						:selectedRowKeys="selectedRowKeys"
						@batchCallBack="deleteBatchBizAccessory"
					/>
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'coverImage'">
					<a-image
						v-if="getFirstCoverImage(record.coverImage)"
						:src="getFirstCoverImage(record.coverImage)"
						style="width: 100px; height: 100px"
					/>
				</template>
				<template v-if="column.dataIndex === 'nameJson'">
					<div style="white-space: pre-line">{{ getLocalizedNames(record.nameJson) }}</div>
				</template>
				<template v-if="column.dataIndex === 'publishStatus'">
					<a-switch
						:loading="loading"
						:checked="record.publishStatus === 'YES'"
						@change="editStatus(record)"
					/>
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a @click="formRef.onOpen(record, selectCategoryId.value)" v-if="hasPerm('bizAccessoryEdit')">编辑</a>
						<a-divider type="vertical" v-if="hasPerm(['bizAccessoryEdit', 'bizAccessoryDelete'], 'and')" />
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizAccessory(record)">
							<a-button type="link" danger size="small" v-if="hasPerm('bizAccessoryDelete')">删除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</s-table>
	</a-card>
	<Form ref="formRef" @successful="tableRef.refresh()" />
</template>

<script setup name="accessory">
	import { cloneDeep } from 'lodash-es'
	import { inject, ref, watch } from 'vue'
	import Form from '../accessory-form/index.vue'
	import bizAccessoryApi from '@/api/biz/bizAccessoryApi'
	import tool from '@/utils/tool'
	const searchFormState = ref({})
	const searchFormRef = ref()
	const tableRef = ref()
	const formRef = ref()
	const loading = ref(false)
	const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
	let selectCategoryId = inject('selectCategoryId')
	const categoryId = ref('')
	watch(
		selectCategoryId,
		(newVal) => {
			if (tableRef.value) {
				tableRef.value.refresh(true)
			}
			categoryId.value = newVal
		},
		{ immediate: true }
	)
	const columns = [
		{
			title: '封面图',
			dataIndex: 'coverImage',
			width: 300
		},
		{
			title: '配件名称',
			dataIndex: 'name'
		},
		{
			title: '发布状态',
			dataIndex: 'publishStatus',
			width: 150
		}
	]
	// 操作栏通过权限判断是否显示
	if (hasPerm(['bizAccessoryEdit', 'bizAccessoryDelete'])) {
		columns.push({
			title: '操作',
			dataIndex: 'action',
			align: 'center',
			width: 150
		})
	}
	const selectedRowKeys = ref([])
	// 列表选择配置
	const options = {
		// columns数字类型字段加入 needTotal: true 可以勾选自动算账
		alert: {
			show: true,
			clear: () => {
				selectedRowKeys.value = ref([])
			}
		},
		rowSelection: {
			onChange: (selectedRowKey, selectedRows) => {
				selectedRowKeys.value = selectedRowKey
			}
		}
	}
	const loadData = (parameter) => {
		const searchFormParam = cloneDeep(searchFormState.value)
		searchFormParam.categoryId = selectCategoryId.value
		return bizAccessoryApi.bizAccessoryPage(Object.assign(parameter, searchFormParam)).then((data) => {
			return data
		})
	}
	const editStatus = (record) => {
		loading.value = true
		const formDataParam = {
			id: record.id,
			publishStatus: record.publishStatus === 'YES' ? 'NO' : 'YES'
		}
		bizAccessoryApi
			.bizAccessorySubmitForm(formDataParam, true)
			.then(() => {
				tableRef.value.refresh()
			})
			.finally(() => {
				loading.value = false
			})
	}
	// 从封面图URL中提取第一张图片
	const getFirstCoverImage = (coverImages) => {
		if (!coverImages) return ''

		// 如果是字符串，尝试解析为数组
		if (typeof coverImages === 'string') {
			try {
				const images = JSON.parse(coverImages)
				if (Array.isArray(images) && images.length > 0) {
					return images[0]
				}
			} catch (e) {
				// 如果解析失败，可能就是一个单独的URL
				return coverImages
			}
		} else if (Array.isArray(coverImages) && coverImages.length > 0) {
			return coverImages[0]
		}
		return ''
	}

	// 解析并展示本地化名称
	// 解析并展示本地化名称
	const getLocalizedNames = (nameJson) => {
		if (!nameJson) return ''
		let names = []
		try {
			// 尝试解析JSON字符串
			if (typeof nameJson === 'string') {
				names = JSON.parse(nameJson)
			} else if (Array.isArray(nameJson)) {
				names = nameJson
			}
		} catch (e) {
			console.error('Failed to parse nameJson:', e)
			return ''
		}
		// 将语言代码映射为标签，使用换行符分隔
		return names
			.map((item) => {
				const langLabel = supportLanguageOptions.find((lang) => lang.value === item.locale)?.label || item.locale
				return `${langLabel}: ${item.value}`
			})
			.join('\n')
	}

	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	// 删除
	const deleteBizAccessory = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizAccessoryApi.bizAccessoryDelete(params).then(() => {
			tableRef.value.refresh(true)
		})
	}
	// 批量删除
	const deleteBatchBizAccessory = (params) => {
		bizAccessoryApi.bizAccessoryDelete(params).then(() => {
			tableRef.value.clearRefreshSelected()
		})
	}
	// 获取支持的语言类型
	const supportLanguageOptions = tool.dictList('LANGUAGE_TYPE')
</script>
