<template>
	<xn-form-container
		:title="formData.id ? '编辑文章' : '创建文章'"
		:width="1200"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-row :gutter="16">
				<a-col :span="6">
					<a-form-item label="封面图：" name="coverImage">
						<xn-upload v-model:value="formData.coverImage" uploadMode="image" :fileSizeLimit="10" />
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="文章类型" name="articleType">
						<a-select v-model:value="formData.articleType" placeholder="请选择文章类型" :options="articleTypeOptions" />
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="发布日期：" name="publishDate">
						<a-date-picker
							v-model:value="formData.publishDate"
							value-format="YYYY-MM-DD"
							placeholder="请选择发布日期"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="已交付：" name="deliverNum">
						<a-input-number
							v-model:value="formData.deliverNum"
							placeholder="请输入已交付"
							:min="500"
							:max="10000000"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="6">
					<a-form-item label="虚拟点击量：" name="virtualClick">
						<a-input-number
							v-model:value="formData.virtualClick"
							placeholder="请输入虚拟点击量"
							:min="1"
							:max="1000000"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="发布状态：" name="publishStatus">
						<a-select
							v-model:value="formData.publishStatus"
							placeholder="请选择发布状态"
							:options="publishStatusOptions"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="首页推荐：" name="recStatus">
						<a-select v-model:value="formData.recStatus" placeholder="请选择是否首页推荐" :options="recStatusOptions" />
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="分类置顶：" name="isTop">
						<a-select v-model:value="formData.isTop" placeholder="请选择是否分类置顶" :options="isTopOptions" />
					</a-form-item>
				</a-col>
			</a-row>

			<!-- 语言 Tabs -->
			<a-row :gutter="16" style="margin-bottom: 12px">
				<a-col :span="24">
					<a-tabs v-model:activeKey="currentLocale" @change="onTabChange">
						<a-tab-pane
							v-for="opt in supportLanguageOptions"
							:key="opt.value"
							:tab="opt.label"
							:force-render="false"
							:closable="false"
							:tab-key="opt.value"
							:tabslot="opt.label"
						>
						</a-tab-pane>
					</a-tabs>
				</a-col>
			</a-row>
			<!-- 语言相关的字段放在这里：通过 computed formI18n 绑定到当前 locale -->
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item :label="`文章标题（${currentLocale}）`" :name="`i18n_title_${currentLocale}`">
						<a-input v-model:value="formI18n.title" placeholder="请输入文章标题" allow-clear @input="markEdited" />
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item :label="`副标题（${currentLocale}）`" :name="`i18n_subtitle_${currentLocale}`">
						<a-input v-model:value="formI18n.subtitle" placeholder="请输入副标题" allow-clear @input="markEdited" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item :label="`作者（${currentLocale}）`" :name="`i18n_author_${currentLocale}`">
						<a-input v-model:value="formI18n.author" placeholder="请输入作者" allow-clear @input="markEdited" />
					</a-form-item>
				</a-col>
				<a-col :span="12" v-if="formData.articleType === 'success_case'">
					<a-form-item :label="`小标题（${currentLocale}）`" :name="`i18n_orderSource_${currentLocale}`">
						<a-input v-model:value="formI18n.orderSource" placeholder="请输入小标题" allow-clear @input="markEdited" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item :label="`文章内容（${currentLocale}）`" :name="`i18n_content_${currentLocale}`">
						<!-- xn-editor 支持 v-model:value -->
						<xn-editor v-model:value="formI18n.content" placeholder="请输入文章内容" @update:value="markEdited" />
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

<script setup name="bizArticleForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import { required } from '@/utils/formRules'
	import bizArticleApi from '@/api/biz/bizArticleApi'
	import { ref, computed } from 'vue'

	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()
	// 表单数据
	const formData = ref({})
	const submitLoading = ref(false)
	const articleTypeOptions = ref([])
	const recStatusOptions = ref([])
	const isTopOptions = ref([])
	const publishStatusOptions = ref([])
	const supportLanguageOptions = ref([])

	// 语言相关
	const currentLocale = ref('') // 当前 tab 的 locale，例如 'zh-CN'

	// 打开抽屉
	const onOpen = (record) => {
		open.value = true
		// 初始化字典项
		articleTypeOptions.value = tool.dictList('ARTICLE_TYPE')
		isTopOptions.value = tool.dictList('TOP_STATUS')
		recStatusOptions.value = tool.dictList('REC_STATUS')
		publishStatusOptions.value = tool.dictList('PUBLISH_STATUS')
		supportLanguageOptions.value = tool.dictList('LANGUAGE_TYPE')
		// 设置默认当前语言为第一个
		if (supportLanguageOptions.value && supportLanguageOptions.value.length > 0) {
			currentLocale.value = supportLanguageOptions.value[0].value
		}
		// 初始化表单
		if (record) {
			let recordData = cloneDeep(record)
			// 如果后端已经用 translations 存了多语言，这里将其按 locale 填充到 i18n 结构
			if (!recordData.i18n) recordData.i18n = {}
			if (Array.isArray(recordData.langList)) {
				recordData.langList.forEach((t) => {
					recordData.i18n = recordData.i18n || {}
					recordData.i18n[t.locale] = {
						title: t.title || '',
						author: t.author || '',
						subtitle: t.subtitle || '',
						orderSource: t.orderSource || '',
						content: t.content || '',
						_edited: true, // 后端已有内容，标记为已编辑，避免自动覆盖
						_autoFilled: false
					}
				})
			}
			// 保证 i18n 存在
			if (!recordData.i18n) recordData.i18n = {}
			formData.value = Object.assign({}, recordData)
		} else {
			// 新建
			formData.value = {
				coverImage: '',
				publishDate: '',
				virtualClick: 1,
				deliverNum: 500,
				publishStatus: null,
				isTop: false,
				i18n: {}
			}
		}
		// 确保每个支持的语言在 i18n 中至少有占位
		ensureAllLocales()
	}

	// 关闭抽屉
	const onClose = () => {
		if (formRef.value && formRef.value.resetFields) {
			formRef.value.resetFields()
		}
		formData.value = {}
		open.value = false
	}

	// 表单校验规则（非语言字段）
	const formRules = {
		coverImage: [required('请输入封面图')],
		publishDate: [required('请输入发布日期')]
	}

	// helpers: 保证 i18n 中存在每个语言占位对象
	const ensureAllLocales = () => {
		if (!formData.value.i18n)
			formData.value.i18n = {}(supportLanguageOptions.value || []).forEach((opt) => {
				getI18nForLocale(opt.value)
			})
	}

	// 获取/创建某 locale 的 i18n 对象
	const getI18nForLocale = (locale) => {
		if (!formData.value.i18n) formData.value.i18n = {}
		if (!formData.value.i18n[locale]) {
			formData.value.i18n[locale] = {
				title: '',
				author: '',
				content: '',
				subtitle: '',
				orderSource: '',
				_edited: false, // 用户是否手动修改过
				_autoFilled: false // 是否自动从翻译接口填充过
			}
		}
		return formData.value.i18n[locale]
	}

	// 当前 tab 对应的 i18n 对象（用于模板双向绑定）
	const formI18n = computed({
		get() {
			if (!currentLocale.value) return {}
			return getI18nForLocale(currentLocale.value)
		},
		set(val) {
			if (!currentLocale.value) return
			formData.value.i18n = formData.value.i18n || {}
			formData.value.i18n[currentLocale.value] = Object.assign(getI18nForLocale(currentLocale.value), val)
		}
	})

	// 切换 tab（语言）时触发
	const onTabChange = async (targetLocale) => {
		// a-tabs 的 change 回调有时会直接传入 key（就是 locale）
		const target = targetLocale
		if (!target) return
		// 先保存当前 locale（v-model 已双向绑定，不需要额外赋值，但可以保证字段存在）
		getI18nForLocale(currentLocale.value)
		// 切到目标 locale 前，确保目标 locale 对象存在
		getI18nForLocale(target)
		currentLocale.value = target
	}

	// 标记当前语言已被用户编辑（用于阻止后续自动覆盖）
	const markEdited = () => {
		if (!currentLocale.value) return
		const o = getI18nForLocale(currentLocale.value)
		o._edited = true
	}

	// 验证并提交数据（整合 translations）
	const onSubmit = () => {
		// 先手动触发表单校验（非语言字段）
		formRef.value
			.validate()
			.then(async () => {
				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)

				// 将 i18n 转换为 translations 数组提交到后端
				formDataParam.langList = []
				let firstLang = null
				if (formDataParam.i18n) {
					for (const [locale, val] of Object.entries(formDataParam.i18n)) {
						// 跳过空翻译（可根据需要保留）
						if (!val) continue
						// 只提交有内容的语言
						if ((val.title && val.title.trim()) || (val.content && val.content.trim())) {
							const langItem = {
								locale,
								title: val.title || '',
								subtitle: val.subtitle || '',
								author: val.author || '',
								orderSource: val.orderSource || '',
								content: val.content || ''
							}
							formDataParam.langList.push(langItem)
							// 记录第一个语言项作为默认值
							if (
								!firstLang &&
								supportLanguageOptions.value.length > 0 &&
								locale === supportLanguageOptions.value[0].value
							) {
								firstLang = langItem
							}
						}
					}
				}
				// 设置主表字段为第一个语言的值
				if (firstLang) {
					formDataParam.title = firstLang.title
					formDataParam.subtitle = firstLang.subtitle
					formDataParam.author = firstLang.author
					formDataParam.content = firstLang.content
					formDataParam.orderSource = firstLang.orderSource
				}
				try {
					await bizArticleApi.bizArticleSubmitForm(formDataParam, formDataParam.id)
					onClose()
					emit('successful')
				} finally {
					submitLoading.value = false
				}
			})
			.catch(() => {
				// 校验失败
			})
	}
	// 抛出函数
	defineExpose({
		onOpen
	})
</script>
