<template>
	<a-card :bordered="false">
		<a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" class="ant-advanced-search-form">
			
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
					<a-button type="primary" @click="formRef.onOpen()" v-if="hasPerm('bizMessageBoardAdd')">
						<template #icon><plus-outlined /></template>
						新增
					</a-button>
					<xn-batch-button
						v-if="hasPerm('bizMessageBoardBatchDelete')"
						buttonName="批量删除"
                        icon="DeleteOutlined"
						:selectedRowKeys="selectedRowKeys"
						@batchCallBack="deleteBatchBizMessageBoard"
					/>
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'processStatus'">
					{{ $TOOL.dictTypeData('HANDLE_STATUS', record.processStatus) }}
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a @click="formRef.onOpen(record)" v-if="hasPerm('bizMessageBoardEdit')">{{ record.processStatus === 'NO' ? '去处理' : '查看'}}</a>
						<a-divider type="vertical" v-if="hasPerm(['bizMessageBoardEdit', 'bizMessageBoardDelete'], 'and')" />
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizMessageBoard(record)">
							<a-button type="link" danger size="small" v-if="hasPerm('bizMessageBoardDelete')">删除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</s-table>
	</a-card>
	<Form ref="formRef" @successful="tableRef.refresh()" />
</template>

<script setup name="messageBoard">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import Form from './form.vue'
	import bizChannelApi from '@/api/biz/bizChannelApi'
	const searchFormState = ref({})
	const searchFormRef = ref()
	const tableRef = ref()
	const formRef = ref()
	const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
	const columns = [
		{
			title: '渠道名称',
			dataIndex: 'name'
		}
	]
	// 操作栏通过权限判断是否显示
	if (hasPerm(['bizMessageBoardEdit', 'bizMessageBoardDelete'])) {
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
		return bizChannelApi.bizMessageBoardPage(Object.assign(parameter, searchFormParam)).then((data) => {
			return data
		})
	}
	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	// 删除
	const deleteBizMessageBoard = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizChannelApi.bizMessageBoardDelete(params).then(() => {
			tableRef.value.refresh(true)
		})
	}
	// 批量删除
	const deleteBatchBizMessageBoard = (params) => {
		bizChannelApi.bizMessageBoardDelete(params).then(() => {
			tableRef.value.clearRefreshSelected()
		})
	}
	const processStatusOptions = tool.dictList('HANDLE_STATUS')
</script>
