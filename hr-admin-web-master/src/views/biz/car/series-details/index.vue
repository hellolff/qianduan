<template>
	<a-card :bordered="false">
		<a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" class="ant-advanced-search-form">
			<a-row :gutter="24">
				<a-col :span="6">
					<a-form-item label="快速查询" name="keyword">
						<a-input v-model:value="searchFormState.keyword" placeholder="请输入车系名称" />
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="业务员" name="ywyId">
						<a-select
							v-model:value="searchFormState.ywyId"
							placeholder="请选择业务员"
							:options="ywyOptions"
							allow-clear
						/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="负责区域" name="regionId">
						<a-select
							v-model:value="searchFormState.regionId"
							placeholder="请选择负责区域"
							:options="regionOptions"
							allow-clear
						/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="链接语言" name="ljyy">
						<a-select
							v-model:value="searchFormState.ljyy"
							placeholder="请选择链接语言"
							:options="languageOptions"
							allow-clear
						/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="渠道" name="channelId">
						<a-select
							v-model:value="searchFormState.channelId"
							placeholder="请选择渠道"
							:options="channelOptions"
							allow-clear
						/>
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
					<a-button type="primary" @click="formRef.onOpen()" v-if="hasPerm('bizSeriesDetailsAdd')">
						<template #icon><plus-outlined /></template>
						新增
					</a-button>
					<xn-batch-button
						v-if="hasPerm('bizSeriesDetailsBatchDelete')"
						buttonName="批量删除"
						icon="DeleteOutlined"
						:selectedRowKeys="selectedRowKeys"
						@batchCallBack="deleteBatchBizSeriesDetails"
					/>
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'coverImage'">
					<a-image
						v-if="record.coverImage"
						:width="80"
						:height="60"
						:src="record.coverImage"
						:preview="false"
						style="object-fit: cover"
					/>
					<span v-else>无封面</span>
				</template>
				<template v-if="column.dataIndex === 'state'">
					<a-switch :loading="stateLoading[record.id]" :checked="record.state === 'Y'" @change="editState(record)" />
				</template>
				<template v-if="column.dataIndex === 'action'" >
					<a-space style="width: 150px;">
						<a @click="formRef.onOpen(record)" v-if="hasPerm('bizSeriesDetailsEdit')">编辑</a>
						<a @click="fuzhilianjie(record)" v-if="hasPerm('bizSeriesDetailsCopy')">复制链接</a>
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizSeriesDetails(record)">
							<a-button type="link" danger size="small" v-if="hasPerm('bizSeriesDetailsDelete')">删除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</s-table>
	</a-card>
	<Form ref="formRef" @successful="tableRef.refresh()" />
</template>

<script setup name="series-details">
	import { message } from 'ant-design-vue'
	import { cloneDeep } from 'lodash-es'
	import Form from './form.vue'
	import bizSeriesDetailsApi from '@/api/biz/bizSeriesDetailsApi'
	import bizUserApi from '@/api/biz/bizUserApi'
	import bizRegionApi from '@/api/biz/bizRegionApi'
	import bizChannelApi from '@/api/biz/bizChannelApi'
	import bizCarSeriesApi from '@/api/biz/bizCarSeriesApi'
	import { ref, onMounted } from 'vue'
	
	const searchFormState = ref({})
	const searchFormRef = ref()
	const tableRef = ref()
	const formRef = ref()
	
	// 下拉选项数据
	const ywyOptions = ref([])
	const regionOptions = ref([])
	const languageOptions = ref([])
	const channelOptions = ref([])
	
	// 初始化下拉选项
	const initOptions = () => {
		// 这里需要根据实际情况获取下拉选项数据
		// 示例：从字典或API获取
		languageOptions.value = [{ label: '中文', value: '中文' },{ label: '英文', value: '英文' }]
		// 业务员、区域、渠道选项需要从API获取
		hqywy() // 获取业务员列表
		hqregion() // 获取区域列表
		hqchannel() // 获取渠道列表
        hqcx()
	}
	
	// 组件挂载时初始化选项
	onMounted(() => {
		initOptions()
	})
	// 复制链接
	const fuzhilianjie = (record) => {
		// 测试链接 http://localhost:91/biz/car/series-details/index
		console.log(record)
		// 构建链接，根据环境使用不同的域名
        let link = ''
        //判断是否不为生产环境
        if(process.env.NODE_ENV === 'development'){
            link = `http://localhost:91/car-sales/details?id=${record.id}`
        } else {
            link = `https://www.huarongld.com/car-sales/details?id=${record.id}`
        }
		
		
		// 使用Clipboard API复制链接到剪贴板
		navigator.clipboard.writeText(link).then(() => {
			// 显示成功消息
			message.success('链接已复制到剪贴板')
		}).catch(err => {
			console.error('复制失败:', err)
			// 备用方案：使用旧的execCommand方法
			const textArea = document.createElement('textarea')
			textArea.value = link
			document.body.appendChild(textArea)
			textArea.select()
			try {
				document.execCommand('copy')
				message.success('链接已复制到剪贴板')
			} catch (err) {
				console.error('备用复制方法也失败:', err)
				message.error('复制失败，请手动复制链接')
			}
			document.body.removeChild(textArea)
		})
	}
	//获取业务员
    const hqywy =() =>{
        bizUserApi.userPage({ pageSize: 1000 }).then(res => {
          ywyOptions.value = res.records.map(item => ({
            value: item.id,
            label: item.name
          }))
          console.log(ywyOptions.value)
        })
    }
    //获取车系列表
    const hqcx =() =>{
        bizCarSeriesApi.bizCarSeriesPage({size:1000}).then(res => {
		  carSeriesOptions.value = res.records.map(item => ({
		    value: item.id,
		    label: item.seriesName
		  }))
		})
    }
    //获取区域
    const hqregion =() =>{
        // 这里应该调用获取区域列表的API
        bizRegionApi.cxsy().then(res => {
          regionOptions.value = res.map(item => ({
            value: item.id,
            label: item.name
          }))
        })
        
    }
    
    //获取渠道
    const hqchannel =() =>{
        bizChannelApi.bizMessageBoardPage({ pageSize: 1000 }).then(res => {
          channelOptions.value = res.records.map(item => ({
            value: item.id,
            label: item.name
          }))
        })
        
    }
	const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
	const columns = [
		{
			title: '车系封面',
			dataIndex: 'coverImage',
			align: 'center',
			width: 100
		},
		{
			title: '车系名称',
			dataIndex: 'seriesName'
		},
		{
			title: '业务员',
			dataIndex: 'ywyName'
		},
		{
			title: '负责区域',
			dataIndex: 'regionNames'
		},
		{
			title: '链接语言',
			dataIndex: 'ljyys'
		},
		{
			title: '渠道',
			dataIndex: 'channelName'
		},
		{
			title: '状态',
			dataIndex: 'state', //Y-启用 N-停用
			width: '80px',
			align: 'center'
		}
	]
	
	// 操作栏通过权限判断是否显示
	if (hasPerm(['bizSeriesDetailsEdit', 'bizSeriesDetailsDelete'])) {
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
		return bizSeriesDetailsApi.bizSeriesDetailsPage(Object.assign(parameter, searchFormParam)).then((data) => {
			return data
		})
	}
	
	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	
	// 删除
	const deleteBizSeriesDetails = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizSeriesDetailsApi.bizSeriesDetailsDelete(params).then(() => {
			tableRef.value.refresh(true)
		})
	}
	
	// 批量删除
	const deleteBatchBizSeriesDetails = (params) => {
		bizSeriesDetailsApi.bizSeriesDetailsDelete(params).then(() => {
			tableRef.value.clearRefreshSelected()
		})
	}
    
	// 状态加载
	const stateLoading = ref({})
	
	// 修改状态
	const editState = (record) => {
		stateLoading.value[record.id] = true
		const newState = record.state === 'Y' ? 'N' : 'Y'
		const params = {
			id: record.id,
			state: newState
		}
		
		// 调用更新状态的API
		bizSeriesDetailsApi.bizSeriesDetailsEditState(params).then(() => {
			tableRef.value.refresh()
		}).finally(() => {
			stateLoading.value[record.id] = false
		})
	}
   
</script>