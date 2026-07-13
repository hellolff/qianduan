<template>
	<a-modal
		:open="visible"
		:visible="visible"
		:title="formData.id ? '编辑人员' : '新增人员'"
		:width="860"
		:destroy-on-close="true"
		:footer="null"
		@cancel="onClose"
		centered
		class="custom-biz-modal"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical" class="modern-form">
			<!-- 🌟 第一行：单独的头像区域 与 账号 -->
			<a-row :gutter="16">
				<a-col :span="8">
					<a-form-item name="avatar" label="头像" :rules="[{ required: true, message: '请上传头像' }]">
						<a-upload
							name="file"
							list-type="picture-card"
							class="avatar-uploader"
							:show-upload-list="false"
							action="/dev/file/uploadDynamicReturnUrl"
							:headers="uploadHeaders"
							@change="handleAvatarChange"
						>
							<img v-if="formData.avatar" :src="formData.avatar" alt="avatar" class="uploaded-avatar" />
							<div v-else>
								<plus-outlined />
								<div style="margin-top: 8px">上传</div>
							</div>
						</a-upload>
					</a-form-item>
				</a-col>
			</a-row>

			<!-- 🌟 第二行：姓名、WhatsApp、密码 -->
			<a-row :gutter="16">
				<a-col :span="8">
					<a-form-item label="姓名" name="name">
						<a-input v-model:value="formData.name" placeholder="请输入姓名" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="WhatsApp" name="whatsapp">
						<a-input v-model:value="formData.whatsapp" placeholder="请输入WhatsApp" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item
						label="密码"
						name="password"
						:rules="formData.id ? [] : [{ required: true, message: '请输入密码' }]"
					>
						<a-input-password
							v-model:value="formData.password"
							:placeholder="formData.id ? '不修改请留空' : '请输入密码'"
							allow-clear
						/>
					</a-form-item>
				</a-col>
			</a-row>

			<!-- 🌟 第三行：邮箱、负责区域、性别 -->
			<a-row :gutter="16">
				<a-col :span="8">
					<a-form-item label="邮箱" name="email">
						<a-input v-model:value="formData.email" placeholder="请输入邮箱" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="负责区域" name="regionIds">
						<a-tree-select
							v-model:value="selectedRegionKeys"
							class="xn-wd"
							:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
							placeholder="请选择区域"
							allow-clear
							tree-default-expand-all
							:tree-data="regionTreeData"
							:field-names="{ children: 'children', label: 'name', value: 'id' }"
							tree-checkable
							:multiple="true"
							show-checked-strategy="SHOW_CHILD"
							@change="handleRegionChange"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="性别" name="gender">
						<a-radio-group v-model:value="formData.gender" :options="genderOptions" />
					</a-form-item>
				</a-col>
			</a-row>

			<!-- 🌟 第四行：出生日期、选择组织、选择职位 -->
			<a-row :gutter="16">
				<a-col :span="8">
					<a-form-item label="出生日期" name="birthday">
						<a-date-picker
							v-model:value="formData.birthday"
							value-format="YYYY-MM-DD"
							class="xn-wd"
							placeholder="请选择日期"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="选择组织" name="orgId">
						<a-tree-select
							v-model:value="formData.orgId"
							class="xn-wd"
							:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
							placeholder="请选择组织"
							allow-clear
							tree-default-expand-all
							:tree-data="treeData"
							:tree-default-expanded-keys="treeDefaultExpandedKeys"
							:field-names="{ children: 'children', label: 'name', value: 'id' }"
							@change="selePositionData(formData.orgId, 0)"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="选择职位" name="positionId">
						<xn-page-select
							ref="xnPositionPageSelectRef"
							v-model:value="formData.positionId"
							placeholder="请选择职位"
							allow-clear
							:page-function="selectApiFunction.positionSelector"
							:echo-function="selectApiFunction.echoPosition"
						/>
					</a-form-item>
				</a-col>
			</a-row>

			<!-- 🌟 第五行：擅长语言 -->
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="擅长语言" name="language">
						<a-select
							v-model:value="formData.language"
							mode="multiple"
							placeholder="请选择擅长的语言"
							allow-clear
							show-arrow
							class="xn-wd"
						>
							<a-select-option value="zh">中文</a-select-option>
							<a-select-option value="en">English</a-select-option>
							<a-select-option value="ar">العربية (阿拉伯语)</a-select-option>
							<a-select-option value="ja">日本語</a-select-option>
							<a-select-option value="ko">한국어</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>

			<!-- 底部动作按钮 -->
			<div class="modal-custom-footer">
				<a-button class="xn-mr8" @click="onClose">关闭</a-button>
				<a-button type="primary" :loading="formLoading" @click="onSubmit">保存</a-button>
			</div>
		</a-form>
	</a-modal>
</template>

<script setup name="bizUserForm">
import { ref, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import bizUserApi from '@/api/biz/bizUserApi'
import bizRegionApi from '@/api/biz/bizRegionApi'
import { required } from '@/utils/formRules'
import tool from '@/utils/tool'
import userCenterApi from '@/api/sys/userCenterApi'

const visible = ref(false)
const formRef = ref()
const formLoading = ref(false)
const emit = defineEmits({ successful: null })

const treeData = ref([])
const treeDefaultExpandedKeys = ref([])
const xnPositionPageSelectRef = ref()
const formData = ref({})

const regionTreeData = ref([])
const selectedRegionKeys = ref([])

// 携带系统 Token，保证上传鉴权通过（已修复获取 Token 报错）
const uploadHeaders = ref({
	Authorization: 'Bearer ' + tool.data.get('TOKEN')
})

// 监听头像上传回调
const handleAvatarChange = (info) => {
	if (info.file.status === 'uploading') {
		return
	}
	if (info.file.status === 'done') {
		if (info.file.response && info.file.response.code === 200) {
			formData.value.avatar = info.file.response.data
			message.success('头像上传成功')
		} else {
			message.error(info.file.response.msg || '上传失败')
		}
	} else if (info.file.status === 'error') {
		message.error('网络错误，上传失败')
	}
}

const onOpen = (record, orgId) => {
	visible.value = true
	formData.value = {
		gender: '男', // 默认性别
		language: []
	}
	if (orgId) {
		formData.value.orgId = orgId
		nextTick(() => {
			selePositionData(orgId)
		})
	}
	if (record) {
		convertFormData(record)
	}
	nextTick(() => {
		bizUserApi.userOrgTreeSelector().then((res) => {
			if (res !== null) {
				treeData.value = res
				treeData.value.forEach((item) => {
					if (item.parentId === '0') {
						treeDefaultExpandedKeys.value.push(item.id)
						if (item.children) {
							item.children.forEach((items) => {
								treeDefaultExpandedKeys.value.push(items.id)
							})
						}
					}
				})
			}
		})
		loadRegionData()
	})
}

const onClose = () => {
	treeData.value = []
	treeDefaultExpandedKeys.value = []
	regionTreeData.value = []
	selectedRegionKeys.value = []
	visible.value = false
}

const convertFormData = (record) => {
	bizUserApi.userDetail({ id: record.id }).then((data) => {
		formData.value = Object.assign({}, data)
		// 如果后端存的 language 是逗号分隔字符串，转为多选数组，便于回显
		if (data.language && typeof data.language === 'string') {
			formData.value.language = data.language.split(',')
		} else if (!data.language) {
			formData.value.language = []
		}

		selePositionData(formData.value.orgId)
		if (data.id) {
			loadUserRegions(data.id)
		}
	})
}

const formRules = {
	name: [required('请输入姓名')],
	whatsapp: [required('请输入WhatsApp')],
	email: [required('请输入邮箱')],
	regionIds: [required('请选择负责区域')],
	gender: [required('请选择性别')]
}

const selePositionData = (orgId, type) => {
	if (orgId) {
		nextTick(() => {
			if (xnPositionPageSelectRef.value) {
				xnPositionPageSelectRef.value.onPage({ orgId: orgId })
			}
		})
		if (type === 0) {
			formData.value.positionId = undefined
		}
	} else {
		formData.value.positionId = undefined
	}
}

const selectApiFunction = {
	positionSelector: (param) => bizUserApi.userPositionSelector(param).then((data) => Promise.resolve(data)),
	echoPosition: (param) => userCenterApi.userCenterGetPositionListByIdList(param).then((data) => Promise.resolve(data))
}

const onSubmit = () => {
	formRef.value.validate().then(() => {
		let formDatas = JSON.parse(JSON.stringify(formData.value))

		// 擅长语言多选数组，转回逗号分隔的字符串存入数据库
		if (Array.isArray(formDatas.language)) {
			formDatas.language = formDatas.language.join(',')
		}

		formLoading.value = true
		bizUserApi
			.submitForm(formDatas, !!formDatas.id)
			.then((res) => {
				const savedUserId = formDatas.id || res
				if (savedUserId) {
					saveUserRegions(savedUserId)
				}
				onClose()
				emit('successful')
			})
			.finally(() => {
				formLoading.value = false
			})
	})
}

const genderOptions = tool.dictList('GENDER')

const loadRegionData = () => {
	bizRegionApi.regionTreeSelector().then((res) => {
		regionTreeData.value = res || []
	})
}

const loadUserRegions = (userId) => {
	bizUserApi.getUserRegionIds({ id: userId }).then((res) => {
		if (res && res.length > 0) {
			selectedRegionKeys.value = res
		}
	})
}

const saveUserRegions = (userId) => {
	if (selectedRegionKeys.value) {
		bizUserApi.saveUserRegions({
			userId: userId,
			regionIds: selectedRegionKeys.value
		})
	}
}

const handleRegionChange = (checkedKeys) => {
	selectedRegionKeys.value = checkedKeys
}

defineExpose({ onOpen })
</script>

<style scoped lang="less">
/* 去除 label 后面的冒号，贴合现代 UI 设计 */
:deep(.modern-form .ant-form-item-label > label::after) {
	display: none !important;
}

/* 🌟 精准复刻产品原型的虚线框头像样式 */
:deep(.avatar-uploader .ant-upload.ant-upload-select-picture-card) {
	width: 104px !important;
	height: 104px !important;
	border-radius: 4px;
	background-color: #ffffff; /* 背景改为白色 */
	border: 2px dashed #d9d9d9 !important; /* 设置为灰色虚线 */
	margin: 0 !important;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999999; /* 加号和文字颜色设为灰色 */
}

/* 鼠标悬浮时颜色加深一点 */
:deep(.avatar-uploader .ant-upload.ant-upload-select-picture-card:hover) {
	border-color: #999999 !important;
}

/* 调整加号的样式，让它更接近你图片里的样子 */
:deep(.avatar-uploader .anticon-plus) {
	font-size: 24px;
	color: #999999; /* 强制设置加号为灰色 */
}

.uploaded-avatar {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 4px;
}

.xn-wd {
	width: 100% !important;
}

/* 自定义底部按钮对齐 */
.modal-custom-footer {
	text-align: right;
	margin-top: 24px;
	padding-top: 16px;
	border-top: 1px solid #f0f0f0;
}
</style>