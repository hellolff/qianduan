<template>
	<a-card :bordered="false">
		<a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" class="ant-advanced-search-form">
			<a-row :gutter="24">
<!--				<a-col :span="6">-->
<!--					<a-form-item label="是否置顶" name="isTop">-->
<!--						<a-select v-model:value="searchFormState.isTop" placeholder="请选择是否置顶" :options="isTopOptions" />-->
<!--					</a-form-item>-->
<!--				</a-col>-->
				<a-col :span="6">
					<a-form-item label="发布状态" name="publishStatus">
						<a-select v-model:value="searchFormState.publishStatus" placeholder="请选择发布状态" :options="publishStatusOptions" />
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
					<a-button type="primary" @click="formRef.onOpen()" v-if="hasPerm('bizRecruitmentAdd')">
						<template #icon><plus-outlined /></template>
						新增
					</a-button>
					<xn-batch-button
						v-if="hasPerm('bizRecruitmentBatchDelete')"
						buttonName="批量删除"
                        icon="DeleteOutlined"
						:selectedRowKeys="selectedRowKeys"
						@batchCallBack="deleteBatchBizRecruitment"
					/>
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'isTop'">
					{{ $TOOL.dictTypeData('TOP_STATUS', record.isTop) }}
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
						<a @click="formRef.onOpen(record)" v-if="hasPerm('bizRecruitmentEdit')">编辑</a>
						<a-divider type="vertical" v-if="hasPerm(['bizRecruitmentEdit', 'bizRecruitmentDelete'], 'and')" />
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizRecruitment(record)">
							<a-button type="link" danger size="small" v-if="hasPerm('bizRecruitmentDelete')">删除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</s-table>
	</a-card>
	<Form ref="formRef" @successful="tableRef.refresh()" />
</template>

<script setup name="recruitment">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import Form from './form.vue'
	import bizRecruitmentApi from '@/api/biz/bizRecruitmentApi'
	import { ref } from "vue";
	const searchFormState = ref({})
	const searchFormRef = ref()
	const tableRef = ref()
	const formRef = ref()
	const loading = ref(false)
	const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
	const columns = [
		{
			title: '招聘岗位',
			dataIndex: 'jobTitle'
		},
		{
			title: '部门',
			dataIndex: 'department'
		},
		{
			title: '工作城市',
			dataIndex: 'workCity'
		},
		{
			title: '招聘人数',
			dataIndex: 'recruitmentNumber'
		},
		{
			title: '接收邮箱',
			dataIndex: 'contactEmail'
		},
		// {
		// 	title: '截止日期',
		// 	dataIndex: 'deadline'
		// },
		{
			title: '发布状态',
			dataIndex: 'publishStatus'
		},
		// {
		// 	title: '是否置顶',
		// 	dataIndex: 'isTop'
		// },
	]
	// 操作栏通过权限判断是否显示
	if (hasPerm(['bizRecruitmentEdit', 'bizRecruitmentDelete'])) {
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
			publishStatus: record.publishStatus === 'YES' ? 'NO' : 'YES'
		}
		bizRecruitmentApi
			.bizRecruitmentSubmitForm(formDataParam, true)
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
		return bizRecruitmentApi.bizRecruitmentPage(Object.assign(parameter, searchFormParam)).then((data) => {
			return data
		})
	}
	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	// 删除
	const deleteBizRecruitment = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizRecruitmentApi.bizRecruitmentDelete(params).then(() => {
			tableRef.value.refresh(true)
		})
	}
	// 批量删除
	const deleteBatchBizRecruitment = (params) => {
		bizRecruitmentApi.bizRecruitmentDelete(params).then(() => {
			tableRef.value.clearRefreshSelected()
		})
	}
	const isTopOptions = tool.dictList('TOP_STATUS')
	const publishStatusOptions = tool.dictList('PUBLISH_STATUS')
</script>
