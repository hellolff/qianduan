<template>
	<a-card :bordered="false">
	  <a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" class="ant-advanced-search-form">
		<a-row :gutter="24">
		  <a-col :span="12">
			<a-form-item label="车型名称" name="modelName">
			  <a-input v-model:value="searchFormState.modelName" placeholder="请输入车型名称" />
			</a-form-item>
		  </a-col>
		  <a-col :span="12">
			<a-button type="primary" @click="tableRef.refresh()">查询</a-button>
			<a-button style="margin: 0 8px" @click="reset">重置</a-button>
		  </a-col>
		</a-row>
	  </a-form>
		<s-table
			ref="tableRef"
			:columns="columns"
			:data="loadData"
			:row-key="(record) => record.id"
			:tool-config="toolConfig"
		>
			<template #operator class="table-operator">
				<a-space>
					<a-button type="primary" @click="formRef.onOpen(undefined, brandId)" v-if="hasPerm('bizCarSeriesAdd')">
						<template #icon><plus-outlined /></template>
						新增
					</a-button>
<!--					<xn-batch-button-->
<!--						v-if="hasPerm('bizCarModelBatchDelete')"-->
<!--						buttonName="批量删除"-->
<!--						icon="DeleteOutlined"-->
<!--						:selectedRowKeys="selectedRowKeys"-->
<!--						@batchCallBack="deleteBatchBizCarModel"-->
<!--					/>-->
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'carSeriesImage'">
					<a-image :src="record.carSeriesImage" style="width: 100px; height: 100px; object-fit: contain" />
				</template>
				<template v-if="column.dataIndex === 'newStatus'">
					<a-switch :loading="loading" :checked="record.newStatus === 'YES'" @change="editStatus(record)" />
				</template>
				<template v-if="column.dataIndex === 'hotStatus'">
					<a-switch :loading="loading1" :checked="record.hotStatus === 'YES'" @change="editHotStatus(record)" />
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a-button
							type="link"
							size="small"
							@click="formRef.onOpen(record, brandId)"
							v-if="hasPerm('bizCarSeriesEdit')"
						>
							<template #icon>
								<EditOutlined />
							</template>
						</a-button>
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizCarModel(record)">
							<a-button type="text" danger size="small" v-if="hasPerm('bizCarSeriesDelete')">
								<template #icon>
									<DeleteOutlined />
								</template>
							</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</s-table>
	</a-card>
	<Form ref="formRef" @successful="tableRef.refresh()" />
</template>

<script setup name="series">
	import { cloneDeep } from 'lodash-es'
	import Form from '../model-form/index.vue'
	import bizCarModelApi from '@/api/biz/bizCarModelApi'
	import { inject, ref, watch } from 'vue'
	const searchFormState = ref({})
	const searchFormRef = ref()
	const tableRef = ref()
	const formRef = ref()
	const loading = ref(false)
  const loading1 = ref(false)
	const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
	const columns = [
    {
      title: '品牌',
      dataIndex: 'brandName',
      width: 120
    },
		{
			title: '车型名称',
			dataIndex: 'modelName',
			width: 300
		},
		{
			title: '最新推荐',
			dataIndex: 'newStatus',
			width: 80
		},
		{
			title: '最热推荐',
			dataIndex: 'hotStatus',
			width: 80
		}
	]
	// 操作栏通过权限判断是否显示
	if (hasPerm(['bizCarSeriesEdit', 'bizCarSeriesDelete'])) {
		columns.push({
			title: '操作',
			dataIndex: 'action',
			align: 'center',
			width: 80
		})
	}
	let selectBrandId = inject('selectBrandId')
	const brandId = ref('')
	watch(
		selectBrandId,
		(newVal) => {
			if (tableRef.value) {
				tableRef.value.refresh(true)
			}
			brandId.value = newVal
		},
		{ immediate: true }
	)
	// 修改状态
	const editStatus = (record) => {
		loading.value = true
		const formDataParam = {
			id: record.id,
			newStatus: record.newStatus === 'YES' ? 'NO' : 'YES'
		}
		bizCarModelApi
			.bizCarModelSubmitForm(formDataParam, true)
			.then(() => {
				tableRef.value.refresh()
			})
			.finally(() => {
				loading.value = false
			})
	}
	const editHotStatus = (record) => {
		loading1.value = true
		const formDataParam = {
			id: record.id,
			hotStatus: record.hotStatus === 'YES' ? 'NO' : 'YES'
		}
		bizCarModelApi
			.bizCarModelSubmitForm(formDataParam, true)
			.then(() => {
				tableRef.value.refresh()
			})
			.finally(() => {
				loading1.value = false
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
    searchFormParam.brandId = selectBrandId.value
		return bizCarModelApi.bizCarModelPage(Object.assign(parameter, searchFormParam)).then((data) => {
			return data
		})
	}
	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	// 删除
	const deleteBizCarModel = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizCarModelApi.bizCarModelDelete(params).then(() => {
			tableRef.value.refresh(true)
		})
	}
	// 批量删除
	const deleteBatchBizCarModel = (params) => {
		bizCarModelApi.bizCarModelDelete(params).then(() => {
			tableRef.value.clearRefreshSelected()
		})
	}
</script>
