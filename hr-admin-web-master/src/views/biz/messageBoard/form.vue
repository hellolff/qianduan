<template>
	<xn-form-container
		:title="formData.id ? '编辑留言表' : '增加留言表'"
		:width="700"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-form-item label="姓名：" name="name">
				<a-input v-model:value="formData.name" placeholder="请输入姓名" disabled />
			</a-form-item>
			<a-form-item label="电话：" name="phone">
				<a-input v-model:value="formData.phone" placeholder="请输入电话" disabled />
			</a-form-item>
			<a-form-item label="邮箱：" name="content">
				<a-input v-model:value="formData.content" placeholder="请输入留言内容" disabled />
			</a-form-item>
			<a-form-item label="IP地址：" name="ipAddress">
				<a-input v-model:value="formData.ipAddress" placeholder="请输入IP地址" disabled />
			</a-form-item>
			<a-form-item label="处理状态：" name="processStatus">
				<a-select v-model:value="formData.processStatus" placeholder="请选择处理状态" :options="processStatusOptions" disabled/>
			</a-form-item>
		</a-form>
		<template #footer>
			<a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
			<a-button v-if="formData.processStatus === 'NO'" type="primary" @click="onSubmit" :loading="submitLoading">处理成功</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizMessageBoardForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import { required } from '@/utils/formRules'
	import bizMessageBoardApi from '@/api/biz/bizMessageBoardApi'
	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()
	// 表单数据
	const formData = ref({})
	const submitLoading = ref(false)
	const processStatusOptions = ref([])

	// 打开抽屉
	const onOpen = (record) => {
		open.value = true
		if (record) {
			let recordData = cloneDeep(record)
			formData.value = Object.assign({}, recordData)
		}
		processStatusOptions.value = tool.dictList('HANDLE_STATUS')
	}
	// 关闭抽屉
	const onClose = () => {
		formRef.value.resetFields()
		formData.value = {}
		open.value = false
	}
	// 默认要校验的
	const formRules = {
	}
	// 验证并提交数据
	const onSubmit = () => {
		formData.value.processStatus = 'YES'
		formRef.value
			.validate()
			.then(() => {
				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)
				bizMessageBoardApi
					.bizMessageBoardSubmitForm(formDataParam, formDataParam.id)
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
