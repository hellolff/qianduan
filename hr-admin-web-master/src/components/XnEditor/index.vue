<template>
	<Editor v-model="contentValue" :init="init" :disabled="disabled" :placeholder="placeholder" @onClick="onClick" />
</template>

<script setup name="Editor">
import fileApi from '@/api/dev/fileApi'
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/models/dom'
// 引入编辑器插件
import 'tinymce/plugins/code' // 编辑源码
import 'tinymce/plugins/image' // 插入编辑图片
// 注意：我们暂时移除 media 插件，使用自定义实现
import 'tinymce/plugins/link' // 超链接
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/table' // 表格
import 'tinymce/plugins/lists' // 列表编号
import 'tinymce/plugins/advlist' //高级列表编号
// 在组件顶部添加常量
const FILE_DOMAIN = import.meta.env.VITE_FILE_DOMAIN || window.location.origin;

const emit = defineEmits(['update:value', 'onClick', 'onChange'])
const props = defineProps({
	value: {
		type: [String, Array],
		default: '',
		required: false
	},
	placeholder: {
		type: String,
		default: ''
	},
	height: {
		type: Number,
		default: 300
	},
	disabled: {
		type: Boolean,
		default: false
	},
	plugins: {
		type: [String, Array],
		default: 'code image link preview table lists advlist' // 移除 media 插件
	},
	toolbar: {
		type: [String, Array],
		default:
			'undo redo | forecolor backcolor bold italic underline strikethrough link | blocks fontfamily fontsize | \
			 alignleft aligncenter alignright alignjustify outdent indent lineheight | bullist numlist | \
			 image table preview customVideoButton | code selectall' // 修改工具栏，使用自定义按钮
	},
	fileUploadFunction: {
		type: Function,
		default: undefined
	}
})
const contentValue = ref()

// URL 处理函数
const processUrl = (url) => {
	if (!url) return '';
	// 已经是完整 URL 直接返回
	if (/^https?:\/\//i.test(url)) return url;
	// 处理相对路径
	const cleanUrl = url.replace(/^\.+\//, '');
	// 确保正确拼接域名
	return `${FILE_DOMAIN}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

// 统一上传处理函数
const handleFileUpload = (blobInfo) => {
	return new Promise((resolve, reject) => {
		const param = new FormData();
		param.append('file', blobInfo.blob(), blobInfo.filename());

		const uploadPromise = props.fileUploadFunction
			? props.fileUploadFunction(param)
			: fileApi.fileUploadDynamicReturnUrl(param);

		uploadPromise
			.then(data => {
				// 确保处理各种返回格式
				const fileUrl = typeof data === 'string' ? data : (data.url || data.path);
				if (!fileUrl) {
					reject('上传成功但未返回有效URL');
					return;
				}
				resolve(processUrl(fileUrl));
			})
			.catch(err => {
				console.error('文件上传失败:', err);
				reject('文件上传失败: ' + (err.message || err));
			});
	});
};

const init = ref({
	language_url: '/tinymce/langs/zh_CN.js',
	language: 'zh_CN',
	skin_url: '/tinymce/skins/ui/oxide',
	content_css: '/tinymce/skins/content/default/content.css',
	menubar: false,
	statusbar: true,
	plugins: props.plugins,
	toolbar: props.toolbar,
	fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px',
	height: props.height,
	placeholder: props.placeholder,
	branding: false,
	resize: true,
	elementpath: true,
	content_style: '',
	selector: '#textarea1',
	skin: 'oxide-dark',

	// 图片上传处理器
	images_upload_handler: handleFileUpload,

	// 禁用所有媒体相关的自动处理
	media_alt_source: false,
	media_poster: false,
	media_dimensions: false,
	media_filter_html: false,
	media_live_embeds: false,

	// 扩展允许的HTML元素，确保video和audio标签不会被过滤
	extended_valid_elements: [
		'video[autoplay|controls|loop|muted|preload|src|width|height|style|class]',
		'audio[autoplay|controls|loop|muted|preload|src|style|class]',
		'source[src|type|media]',
		'div[class|style|data-*]'
	].join(','),

	// 允许的子元素规则
	valid_children: '+body[video|audio],+div[video|audio],+video[source],+audio[source]',

	// 内容CSS，确保视频显示正常
	content_style: `
			video { max-width: 100%; height: auto; }
			.video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 10px 0; }
			.video-wrapper video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
			audio { width: 100%; margin: 10px 0; }
		`,

	setup: function(editor) {
		editor.on('init', function() {
			console.log('TinyMCE 初始化完成');
		});

		// 添加自定义视频按钮
		editor.ui.registry.addButton('customVideoButton', {
			icon: 'embed',
			tooltip: '插入视频或音频',
			onAction: function() {
				// 创建上传对话框
				editor.windowManager.open({
					title: '插入视频/音频',
					body: {
						type: 'panel',
						items: [
							{
								type: 'input',
								name: 'url',
								label: '视频/音频URL',
								placeholder: '输入视频或音频的URL地址'
							},
							{
								type: 'button',
								name: 'upload',
								text: '上传本地文件',
								buttonType: 'primary'
							}
						]
					},
					buttons: [
						{
							type: 'cancel',
							text: '取消'
						},
						{
							type: 'submit',
							text: '插入',
							buttonType: 'primary',
							enabled: false
						}
					],
					initialData: {
						url: ''
					},
					onChange: function(api, details) {
						if (details.name === 'url') {
							const data = api.getData();
							const submitButton = api.getFooter().find('button:contains("插入")')[0];

							if (submitButton) {
								submitButton.disabled(!data.url.trim());
							}
						}
					},
					onSubmit: function(api) {
						const data = api.getData();

						if (data.url) {
							// 处理URL插入
							const url = data.url.trim();
							const isVideo = /\.(mp4|webm|ogv|ogg|mov|avi|wmv|flv|mkv)$/i.test(url);
							const isAudio = /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(url);

							let html = '';

							if (isVideo) {
								const mimeType = getVideoMimeType(url);
								html = `<div class="video-wrapper">
												<video controls style="width: 100%;">
													<source src="${url}" type="${mimeType}">
													您的浏览器不支持视频标签。
												</video>
											</div>`;
							} else if (isAudio) {
								const mimeType = getAudioMimeType(url);
								html = `<audio controls style="width: 100%;">
												<source src="${url}" type="${mimeType}">
												您的浏览器不支持音频标签。
											</audio>`;
							} else {
								// 尝试作为通用URL处理
								html = `<a href="${url}" target="_blank">${url}</a>`;
							}

							editor.insertContent(html);
							api.close();
						}
					},
					onAction: function(api, details) {
						if (details.name === 'upload') {
							// 触发文件选择
							const input = document.createElement('input');
							input.type = 'file';
							input.accept = 'video/*,audio/*';

							input.onchange = function(e) {
								const file = e.target.files[0];
								if (!file) return;

								// 显示上传进度
								api.setEnabled('upload', false);
								api.setEnabled('submit', false);

								// 创建blobInfo对象
								const blobInfo = {
									blob: function() { return file; },
									filename: function() { return file.name; }
								};

								// 上传文件
								handleFileUpload(blobInfo)
									.then(url => {
										// 根据文件类型插入
										const fileType = file.type;
										let html = '';

										if (fileType.startsWith('video/')) {
											const mimeType = fileType || getVideoMimeType(file.name);
											html = `<div class="video-wrapper">
															<video controls style="width: 100%;">
																<source src="${url}" type="${mimeType}">
																您的浏览器不支持视频标签。
															</video>
														</div>`;
										} else if (fileType.startsWith('audio/')) {
											const mimeType = fileType || getAudioMimeType(file.name);
											html = `<audio controls style="width: 100%;">
															<source src="${url}" type="${mimeType}">
															您的浏览器不支持音频标签。
														</audio>`;
										}

										editor.insertContent(html);
										api.close();
									})
									.catch(err => {
										console.error('文件上传失败:', err);
										editor.notificationManager.open({
											text: '上传失败: ' + (err.message || '未知错误'),
											type: 'error',
											timeout: 3000
										});
										api.setEnabled('upload', true);
									});
							};

							input.click();
						}
					}
				});
			}
		});

		// 添加键盘快捷键（可选）
		editor.addShortcut('Ctrl+Shift+V', '插入视频', function() {
			editor.execCommand('customVideoButton');
		});

		// 处理已有的媒体内容，避免被TinyMCE修改
		editor.on('BeforeSetContent', function(e) {
			// 确保已有的视频/音频标签不会被修改
			if (e.content) {
				// 这里可以添加对已有内容的预处理
				e.content = e.content.replace(
					/<video\s+([^>]*)>/g,
					'<div class="video-wrapper"><video $1 style="width: 100%;">'
				).replace(
					/<\/video>/g,
					'</video></div>'
				);
			}
		});

		// 获取内容时也保持格式
		editor.on('GetContent', function(e) {
			// 可以在这里对输出的内容进行后处理
		});
	}
});

// 辅助函数：获取视频MIME类型
function getVideoMimeType(filename) {
	const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
	const mimeTypes = {
		'.mp4': 'video/mp4',
		'.webm': 'video/webm',
		'.ogv': 'video/ogg',
		'.ogg': 'video/ogg',
		'.mov': 'video/quicktime',
		'.avi': 'video/x-msvideo',
		'.wmv': 'video/x-ms-wmv',
		'.flv': 'video/x-flv',
		'.mkv': 'video/x-matroska'
	};
	return mimeTypes[extension] || 'video/mp4';
}

// 辅助函数：获取音频MIME类型
function getAudioMimeType(filename) {
	const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
	const mimeTypes = {
		'.mp3': 'audio/mpeg',
		'.wav': 'audio/wav',
		'.ogg': 'audio/ogg',
		'.m4a': 'audio/mp4',
		'.aac': 'audio/aac',
		'.flac': 'audio/flac'
	};
	return mimeTypes[extension] || 'audio/mpeg';
}

// 监听数据回显
watch(
	() => props.value,
	(newVal) => {
		contentValue.value = newVal
	},
	{ immediate: true, deep: true }
)

// 监听输入
watch(contentValue, (newValue) => {
	emit('update:value', newValue)
})

const onClick = (e) => {
	emit('onClick', e, tinymce)
}

onMounted(() => {
	tinymce.init({})
})
</script>

<style lang="less">
.tox-toolbar__primary {
	border-bottom: 1px solid rgb(5 5 5 / 0%) !important;
}

/* 确保编辑区域内的视频显示正常 */
.tox-edit-area__iframe {
	video {
		max-width: 100% !important;
		height: auto !important;
	}

	.video-wrapper {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		max-width: 100%;
		margin: 10px 0;

		video {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	audio {
		width: 100% !important;
		margin: 10px 0;
	}
}

/* 自定义视频按钮样式 */
.tox .tox-tbtn--customVideoButton svg {
	fill: #1e87f0;
}
</style>
