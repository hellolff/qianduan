<template>
	<a-card :bordered="false">
		<a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" class="ant-advanced-search-form">
			<a-row :gutter="24">
				<a-col :span="6">
					<a-form-item label="公司名称" name="companyName">
						<a-input v-model:value="searchFormState.companyName" placeholder="请输入公司名称" />
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-button type="primary" @click="tableRef.refresh()">查询</a-button>
					<a-button style="margin: 0 8px" @click="reset">重置</a-button>
				</a-col>
			</a-row>
		</a-form>
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
					<a-button type="primary" @click="formRef.onOpen()" v-if="hasPerm('bizCompanyAdd')">
						<template #icon><plus-outlined /></template>
						新增
					</a-button>
					<xn-batch-button
						v-if="hasPerm('bizCompanyBatchDelete')"
						buttonName="批量删除"
                        icon="DeleteOutlined"
						:selectedRowKeys="selectedRowKeys"
						@batchCallBack="deleteBatchBizCompany"
					/>
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'status'">
					<a-switch
						:loading="loading"
						:checked="record.status === 'ENABLE'"
						@change="editStatus(record)"
					/>
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a @click="formRef.onOpen(record)" v-if="hasPerm('bizCompanyEdit')">编辑</a>
						<a-divider type="vertical" v-if="hasPerm(['bizCompanyEdit', 'bizCompanyDelete'], 'and')" />
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizCompany(record)">
							<a-button type="link" danger size="small" v-if="hasPerm('bizCompanyDelete')">删除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</s-table>
	</a-card>
	<Form ref="formRef" @successful="tableRef.refresh()" />
</template>

<script setup name="company">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import Form from './form.vue'
	import bizCompanyApi from '@/api/biz/bizCompanyApi'
	import { ref } from 'vue'
	const searchFormState = ref({})
	const searchFormRef = ref()
	const tableRef = ref()
	const formRef = ref()
	const loading = ref(false)
	const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
	const columns = [
		{
			title: '公司名称',
			dataIndex: 'companyName'
		},
		{
			title: '公司地址',
			dataIndex: 'address'
		},
		{
			title: '联系人',
			dataIndex: 'contact'
		},
		{
			title: '联系电话',
			dataIndex: 'contactPhone'
		},
		{
			title: '联系邮箱',
			dataIndex: 'contactEmail'
		},
		{
			title: '状态',
			dataIndex: 'status'
		},
		{
			title: '排序码',
			dataIndex: 'sortCode'
		},
	]
	// 操作栏通过权限判断是否显示
	if (hasPerm(['bizCompanyEdit', 'bizCompanyDelete'])) {
		columns.push({
			title: '操作',
			dataIndex: 'action',
			align: 'center',
			width: 150
		})
	}
	const editStatus = (record) => {
		loading.value = true
		const formDataParam = {
			id: record.id,
			status: record.status === 'ENABLE' ? 'DISABLED' : 'ENABLE'
		}
		bizCompanyApi
			.bizCompanySubmitForm(formDataParam, true)
			.then(() => {
				tableRef.value.refresh()
			})
			.finally(() => {
				loading.value = false
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
		return bizCompanyApi.bizCompanyPage(Object.assign(parameter, searchFormParam)).then((data) => {
			return data
		})
	}
	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	// 删除
	const deleteBizCompany = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizCompanyApi.bizCompanyDelete(params).then(() => {
			tableRef.value.refresh(true)
		})
	}
	// 批量删除
	const deleteBatchBizCompany = (params) => {
		bizCompanyApi.bizCompanyDelete(params).then(() => {
			tableRef.value.clearRefreshSelected()
		})
	}
</script>
