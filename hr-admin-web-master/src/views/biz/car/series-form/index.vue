<template>
	<xn-form-container title="车系管理" :width="1000" v-model:open="open" :destroy-on-close="true" @close="onClose">
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-row :gutter="24">
				<a-col :span="24">
					<a-form-item label="车系封面" name="carSeriesImage" :rules="{ required: true, message: '请上传封面图' }">
						<xn-upload v-model:value="formData.carSeriesImage" uploadMode="image" :maxCount="1" />
					</a-form-item>
				</a-col>
			</a-row>

			<a-row :gutter="24">
				<a-col :span="24">
					<a-form-item
						label="车系图片 (建议尺寸 920*690，多张展示)"
						name="carSeriesBanner"
						:rules="{ required: true, message: '请上传车系图片' }"
					>
						<xn-upload v-model:value="formData.carSeriesBanner" uploadMode="image" :multiple="true" :maxCount="20" />
					</a-form-item>
				</a-col>
			</a-row>

			<a-row :gutter="24">
				<a-col :span="12">
					<a-form-item label="车系评分" name="score" :rules="{ required: true, message: '请输入车系评分' }">
						<a-input v-model:value="formData.score" placeholder="请输入车系评分 (例如: 4.5)" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="销售量" name="saleNum" :rules="{ required: true, message: '请输入销售量' }">
						<a-input-number v-model:value="formData.saleNum" placeholder="请输入销售量" :min="0" style="width: 100%" />
					</a-form-item>
				</a-col>
			</a-row>

			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="车系品牌" name="brandId" :rules="{ required: true, message: '请选择品牌' }">
						<a-select
							v-model:value="formData.brandId"
							placeholder="请选择车系品牌"
							:options="brandOptions"
							allow-clear
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="最新车系" name="newStatus" :rules="{ required: true, message: '请选择' }">
						<a-select
							v-model:value="formData.newStatus"
							placeholder="请选择是否最新"
							:options="publishStatusOptions"
							allow-clear
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="车系推荐" name="recStatus" :rules="{ required: true, message: '请选择' }">
						<a-select
							v-model:value="formData.recStatus"
							placeholder="请选择是否推荐"
							:options="publishStatusOptions"
							allow-clear
						/>
					</a-form-item>
				</a-col>
			</a-row>

			<a-tabs v-model:activeKey="currentLocale" type="card" style="margin-top: 10px">
				<a-tab-pane v-for="opt in supportLanguageOptions" :key="opt.value" :tab="opt.label" />
			</a-tabs>

			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item
						:label="`指导价范围 (${currentLocale})`"
						:name="['i18n', currentLocale, 'priceRange']"
						:rules="{ required: true, message: '必填' }"
					>
						<a-input v-model:value="formI18n.priceRange" placeholder="请输入指导价范围" @input="markEdited" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item
						:label="`车系名称 (${currentLocale})`"
						:name="['i18n', currentLocale, 'value']"
						:rules="{ required: true, message: '必填' }"
					>
						<a-input v-model:value="formI18n.value" placeholder="请输入车系名称" @input="markEdited" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item
						:label="`车系卖点 (${currentLocale})`"
						:name="['i18n', currentLocale, 'features']"
						:rules="{ required: true, message: '必填' }"
					>
						<a-input v-model:value="formI18n.features" placeholder="请输入车系卖点" @input="markEdited" />
					</a-form-item>
				</a-col>
			</a-row>

			<a-form-item label="车系详情" :name="['i18n', currentLocale, 'description']">
				<xn-editor v-model:value="formI18n.description" :height="300" @update:value="markEdited" />
			</a-form-item>
		</a-form>
		<template #footer>
			<a-button @click="onClose">关闭</a-button>
			<a-button type="primary" @click="onSubmit" :loading="submitLoading">保存</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizCarSeriesForm">
import tool from '@/utils/tool'
import { cloneDeep } from 'lodash-es'
import bizCarSeriesApi from '@/api/biz/bizCarSeriesApi'
import bizBrandApi from '@/api/biz/bizBrandApi'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'

const open = ref(false)
const emit = defineEmits({ successful: null })
const formRef = ref()
const formData = ref({})
const submitLoading = ref(false)
const publishStatusOptions = ref([])
const brandOptions = ref([])
const supportLanguageOptions = ref([])
const currentLocale = ref('')

const onOpen = (record, brandId) => {
	open.value = true
	publishStatusOptions.value = tool.dictList('REC_STATUS')
	supportLanguageOptions.value = tool.dictList('LANGUAGE_TYPE')
	if (supportLanguageOptions.value?.length > 0) currentLocale.value = supportLanguageOptions.value[0].value

	if (record) {
		const data = cloneDeep(record)
		if (!data.i18n) data.i18n = {}
		try {
			const parsed =
				typeof data.translationsJson === 'string' ? JSON.parse(data.translationsJson) : data.translationsJson
			if (Array.isArray(parsed)) {
				parsed.forEach((it) => {
					if (it.locale) data.i18n[it.locale] = it
				})
			}
		} catch (e) {
			console.warn(e)
		}
		formData.value = data
	} else {
		formData.value = {
			brandId: brandId || '',
			carSeriesImage: '',
			carSeriesBanner: '',
			saleNum: 500,
			recStatus: 'NO',
			newStatus: 'NO',
			score: '4.5',
			i18n: {}
		}
	}
	getBrandList()
}

const onClose = () => {
	if (formRef.value) formRef.value.resetFields()
	formData.value = {}
	open.value = false
}

const getBrandList = () =>
	bizBrandApi
		.bizBrandList({})
		.then((res) => (brandOptions.value = res.map((i) => ({ value: i.id, label: i.brandName }))))

const formRules = {
	carSeriesImage: [{ required: true, message: '封面图不能为空' }],
	carSeriesBanner: [{ required: true, message: 'banner图不能为空' }],
	brandId: [{ required: true, message: '车系品牌不能为空' }],
	newStatus: [{ required: true, message: '最新车系不能为空' }],
	recStatus: [{ required: true, message: '车系推荐不能为空' }],
	score: [{ required: true, message: '车系评分不能为空' }],
	saleNum: [{ required: true, message: '销售量不能为空' }]
}

const getI18nForLocale = (locale) => {
	if (!formData.value.i18n[locale])
		formData.value.i18n[locale] = { value: '', priceRange: '', features: '', description: '', _edited: false }
	return formData.value.i18n[locale]
}

const formI18n = computed({
	get() {
		return getI18nForLocale(currentLocale.value)
	},
	set(val) {
		formData.value.i18n[currentLocale.value] = val
	}
})

const markEdited = () => {
	getI18nForLocale(currentLocale.value)._edited = true
}

const onSubmit = () => {
	formRef.value.validate().then(async () => {
		submitLoading.value = true
		const formDataParam = cloneDeep(formData.value)
		const translationsArr = Object.entries(formDataParam.i18n).map(([locale, val]) => ({ locale, ...val }))
		formDataParam.translationsJson = JSON.stringify(translationsArr)
		try {
			await bizCarSeriesApi.bizCarSeriesSubmitForm(formDataParam, formDataParam.id)
			onClose()
			emit('successful')
		} finally {
			submitLoading.value = false
		}
	})
}
defineExpose({ onOpen })
</script>