<template>
	<xn-form-container
		:title="formData.id ? '编辑车系详情' : '新增车系详情'"
		:width="700"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="车系：" name="carSeriesId" required>
						<a-select
							v-model:value="formData.carSeriesId"
							placeholder="请选择车系"
							:options="carSeriesOptions"
							show-search
							:filter-option="filterOption"
							allow-clear
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="业务员：" name="ywyIds">
						<a-select
							v-model:value="formData.ywyIds"
							placeholder="请选择业务员"
							mode="multiple"
							:options="ywyOptions"
							allow-clear
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="负责区域：" name="regionIds">
						<a-select
							v-model:value="formData.regionIds"
							placeholder="请选择负责区域"
							mode="multiple"
							:options="regionOptions"
							allow-clear
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="链接语言：" name="ljyys">
						<a-select
							v-model:value="formData.ljyys"
							placeholder="请选择链接语言"
							:options="languageOptions"
							allow-clear
							mode="multiple"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="渠道：" name="channelId">
						<a-select
							v-model:value="formData.channelId"
							placeholder="请选择渠道"
							:options="channelOptions"
							show-search
							:filter-option="filterOption"
							allow-clear
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<template #footer>
			<a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
			<a-button type="primary" @click="onSubmit" :loading="submitLoading">保存</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizSeriesDetailsForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import { required } from '@/utils/formRules'
	import bizSeriesDetailsApi from '@/api/biz/bizSeriesDetailsApi'
	import bizUserApi from '@/api/biz/bizUserApi'
	import bizRegionApi from '@/api/biz/bizRegionApi'
	import bizChannelApi from '@/api/biz/bizChannelApi'
	import bizCarSeriesApi from '@/api/biz/bizCarSeriesApi'
	import { ref } from 'vue'
	
	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()
	
	// 表单数据
	const formData = ref({
		ywyIds: [],
		regionIds: []
	})
	const submitLoading = ref(false)
	
	// 下拉选项数据
	const carSeriesOptions = ref([])
	const ywyOptions = ref([])
	const regionOptions = ref([])
	const languageOptions = ref([])
	const channelOptions = ref([])
	
	// 过滤选项
	const filterOption = (input, option) => {
		return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
	}
	
	// 初始化下拉选项
	const initOptions = () => {
		// 链接语言选项
		languageOptions.value = [{ label: '中文', value: '中文' },{ label: '英文', value: '英文' }]
		
		
		
		hqywy() // 获取业务员列表
		hqregion() // 获取区域列表
		hqchannel() // 获取渠道列表
        hqcx()
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
	// 打开抽屉
	const onOpen = (record) => {
		open.value = true
		initOptions()
		
		if (record) {
			let recordData = cloneDeep(record)
			// 处理多选字段
			if (recordData.ywyIds && typeof recordData.ywyIds === 'string') {
				recordData.ywyIds = recordData.ywyIds.split(',')
			}
			if (recordData.regionIds && typeof recordData.regionIds === 'string') {
				recordData.regionIds = recordData.regionIds.split(',')
			}
			if (recordData.ljyys && typeof recordData.ljyys === 'string') {
				recordData.ljyys = recordData.ljyys.split(',')
			}
			formData.value = Object.assign({}, recordData)
		} else {
			formData.value = {
				ywyIds: [],
				regionIds: []
			}
		}
	}
	
	// 关闭抽屉
	const onClose = () => {
		formRef.value.resetFields()
		formData.value = {}
		open.value = false
	}
	
	// 默认要校验的
	const formRules = {
		carSeriesId: [required('请选择车系')],
		channelId: [required('请选择渠道')],
		regionIds: [required('请选择负责区域')],
		ljyys: [required('请选择负责链接语言')]
	}
	
	// 验证并提交数据
	const onSubmit = () => {
		formRef.value
			.validate()
			.then(() => {
				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)
				
				// 处理多选字段，将数组转换为字符串
				if (Array.isArray(formDataParam.ywyIds)) {
					formDataParam.ywyIds = formDataParam.ywyIds.join(',')
					
						const selectedYwyNames = formDataParam.ywyIds
							? formDataParam.ywyIds.split(',').map(id => {
								const option = ywyOptions.value.find(opt => opt.value === id)
								return option ? option.label : ''
							}).filter(name => name).join(',')
							: ''
						formDataParam.ywyName = selectedYwyNames
					
				}
				if (Array.isArray(formDataParam.regionIds)) {
					formDataParam.regionIds = formDataParam.regionIds.join(',')
						const selectedRegionNames = formDataParam.regionIds
							? formDataParam.regionIds.split(',').map(id => {
								const option = regionOptions.value.find(opt => opt.value === id)
								return option ? option.label : ''
							}).filter(name => name).join(',')
							: ''
						formDataParam.regionNames = selectedRegionNames
				}
				if (Array.isArray(formDataParam.ljyys)) {
					formDataParam.ljyys = formDataParam.ljyys.join(',')
				}
				// 如果渠道ID已选择，获取渠道名称（只有新增或名称为空时才重新生成）
					const channelOption = channelOptions.value.find(opt => opt.value === formDataParam.channelId)
					if (channelOption) {
						formDataParam.channelName = channelOption.label
					}
				// 如果车系ID已选择，获取车系名称（只有新增或名称为空时才重新生成）
					const carSeriesOption = carSeriesOptions.value.find(opt => opt.value === formDataParam.carSeriesId)
					if (carSeriesOption) {
						formDataParam.seriesName = carSeriesOption.label
					}
				// 判断是新增还是编辑
				const apiCall = formDataParam.id 
					? bizSeriesDetailsApi.bizSeriesDetailsEdit(formDataParam)
					: bizSeriesDetailsApi.bizSeriesDetailsAdd(formDataParam)
				
				apiCall
					.then(() => {
						onClose()
						emit('successful')
					})
					.finally(() => {
						submitLoading.value = false
					})
			})
			.catch(() => {})
	}
	
	// 抛出函数
	defineExpose({
		onOpen
	})
</script>