<template>
	<xn-form-container
		:title="formData.id ? '编辑区域' : '增加区域'"
		:width="550"
		:visible="visible"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-form-item label="上级区域：" name="parentId">
				<a-tree-select
					v-model:value="formData.parentId"
					class="xn-wd"
					:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
					placeholder="请选择上级区域"
					allow-clear
					tree-default-expand-all
					:tree-data="treeData"
					:field-names="{
						children: 'children',
						label: 'name',
						value: 'id'
					}"
					:tree-node-filter-prop="'name'"
					tree-line
					:tree-node-selectable="treeNodeSelectable"
				/>
			</a-form-item>
			<a-form-item label="区域名称：" name="name">
				<a-input v-model:value="formData.name" placeholder="请输入区域名称" allow-clear />
			</a-form-item>
			<a-form-item label="ISO代码：" name="isoCode">
				<a-input v-model:value="formData.isoCode" placeholder="请输入ISO代码" allow-clear />
			</a-form-item>
			<a-form-item label="中文简称：" name="chineseShortName">
				<a-input v-model:value="formData.chineseShortName" placeholder="请输入中文简称" allow-clear />
			</a-form-item>
			<a-form-item label="英文简称：" name="englishShortName">
				<a-input v-model:value="formData.englishShortName" placeholder="请输入英文简称" allow-clear />
			</a-form-item>
			<a-form-item label="排序：" name="sortCode">
				<a-input-number class="xn-wd" v-model:value="formData.sortCode" :max="100" />
			</a-form-item>
		</a-form>
		<template #footer>
			<a-button class="xn-mr8" @click="onClose">关闭</a-button>
			<a-button type="primary" :loading="submitLoading" @click="onSubmit">保存</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizRegionForm">
	import { required } from '@/utils/formRules'
	import bizRegionApi from '@/api/biz/bizRegionApi'
	import { message } from 'ant-design-vue'

	// 定义emit事件
	const emit = defineEmits({ successful: null })
	// 默认是关闭状态
	const visible = ref(false)
	const formRef = ref()
	// 表单数据，也就是默认给一些数据
	const formData = ref({})
	// 定义区域元素
	const treeData = ref([])
	const submitLoading = ref(false)

	// 判断树节点是否可选：只能选择顶级节点(id=0)或第一级节点(parentId=0)
	const treeNodeSelectable = (node) => {
		// 顶级节点（id=0）可选
		if (node.id === '0' || node.id === 0) {
			return true
		}
		// 第一级节点（parentId=0）可选
		if (node.parentId === '0' || node.parentId === 0) {
			return true
		}
		// 其他节点不可选
		return false
	}

	// 表单验证规则
	const formRules = {
		parentId: [required('请选择上级区域')],
		name: [required('请输入区域名称')],
		isoCode: [required('请输入ISO代码')],
		chineseShortName: [required('请输入中文简称')],
		englishShortName: [required('请输入英文简称')],
		sortCode: [required('请输入排序')]
	}

	// 打开抽屉
	const onOpen = (record, parentId) => {
		visible.value = true
		formData.value = {
			sortCode: 99
		}
		if (parentId) {
			formData.value.parentId = parentId
		}
		if (record) {
			const param = {
				id: record.id
			}
			bizRegionApi.regionDetail(param).then((data) => {
				formData.value = Object.assign({}, data)
			})
		}
		// 获取区域树并加入顶级
		bizRegionApi.regionTreeSelector().then((res) => {
            const aa=[]
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                element.children=[]
                aa.push(element)
            }
			treeData.value = [
				{
					id: 0,
					parentId: '-1',
					name: '顶级',
					children: res
				}
			]
		})
	}

	// 关闭抽屉
	const onClose = () => {
		formRef.value.resetFields()
		visible.value = false
	}

	// 提交
	const onSubmit = () => {
		formRef.value.validate().then(() => {
			submitLoading.value = true
			const data = JSON.parse(JSON.stringify(formData.value))
			// 处理parentId为0的情况
			if (data.parentId === '0') {
				data.parentId = '0'
			}
			bizRegionApi.submitForm(data, formData.value.id).then(() => {
				message.success('操作成功')
				onClose()
				emit('successful')
			}).finally(() => {
				submitLoading.value = false
			})
		})
	}

	// 暴露变量
	defineExpose({
		onOpen
	})
</script>