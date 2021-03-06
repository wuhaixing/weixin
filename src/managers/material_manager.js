/**
* MaterialManager
* https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738729&token=&lang=zh_CN
* 永久素材管理
* 除了3天就会失效的临时素材外，开发者有时需要永久保存一些素材，届时就可以通过本接口新增永久素材。
*
* 请注意：
* 1、新增的永久素材也可以在公众平台官网素材管理模块中看到
* 2、永久素材的数量是有上限的，请谨慎新增。图文消息素材和图片素材的上限为5000，其他类型为1000
* 3、素材的格式大小等要求与公众平台官网一致。具体是，图片大小不超过2M，支持bmp/png/jpeg/jpg/gif格式，
*   语音大小不超过5M，长度不超过60秒，支持mp3/wma/wav/amr格式
*/
import Immutable,{List} from 'immutable'

const materialUrlPrefix = "https://api.weixin.qq.com/cgi-bin/material/"

/**
* 获取永久素材的总数
* 官方文档：
* http://mp.weixin.qq.com/wiki/16/8cc64f8c189674b421bee3ed403993b8.html
*
* 返回说明
{
  "voice_count":COUNT,
  "video_count":COUNT,
  "image_count":COUNT,
  "news_count":COUNT
}
*/
function getCount() {
	return {
		"url":`${materialUrlPrefix}get_materialcount`,
		"method" : "get"
	}
}

/**
* 获取永久素材的列表
* 官方文档：
* http://mp.weixin.qq.com/wiki/12/2108cd7aafff7f388f41f37efa710204.html
*
* 返回说明
* 发送该消息后，永久图文消息素材列表的响应如下：
*   {
		   "total_count": TOTAL_COUNT,
		   "item_count": ITEM_COUNT,
		   "item": [{
		       "media_id": MEDIA_ID,
		       "content": {
		           "news_item": [{
		               "title": TITLE,
		               "thumb_media_id": THUMB_MEDIA_ID,
		               "show_cover_pic": SHOW_COVER_PIC(0 / 1),
		               "author": AUTHOR,
		               "digest": DIGEST,
		               "content": CONTENT,
		               "url": URL,
		               "content_source_url": CONTETN_SOURCE_URL
		           },
		           //多图文消息会在此处有多篇文章
		           ]
		        },
		        "update_time": UPDATE_TIME
		    },
		    //可能有多个图文消息item结构
		  ]
		}
* 其他类型（图片、语音、视频）的返回如下：

		{
		   "total_count": TOTAL_COUNT,
		   "item_count": ITEM_COUNT,
		   "item": [{
		       "media_id": MEDIA_ID,
		       "name": NAME,
		       "update_time": UPDATE_TIME,
		       "url":URL
		   },
		   //可能会有多个素材
		   ]
		}
* @param type 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news），默认为news
* @param offset 从全部素材的该偏移位置开始返回，0表示从第一个素材返回，默认为0
* @param count 返回素材的数量，取值在1到20之间，默认为20
*
*/
function batchGet(type = 'news',offset = 0,count = 20) {
	return {
		"url":`${materialUrlPrefix}batchget_material`,
		"method" : "post",
		"body" : {
			 "type":type,
			 "offset":offset,
			 "count":count
		}
	}
}
/**
* 新增永久素材
* 官方文档：
* http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html
* 公众号经常有需要用到一些临时性的多媒体素材的场景，例如在使用接口特别是发送消息时，对多媒体文件、
* 多媒体消息的获取和调用等操作，是通过media_id来进行的。素材管理接口对所有认证的订阅号和服务号
* 开放。通过本接口，公众号可以新增临时素材（即上传临时多媒体文件）。
* 请注意：
* 1、对于临时素材，每个素材（media_id）会在开发者上传或粉丝发送到微信服务器3天后自动删除
*（所以用户发送给开发者的素材，若开发者需要，应尽快下载到本地），以节省服务器资源。
* 2、media_id是可复用的。
* 3、素材的格式大小等要求与公众平台官网一致。
* 上传的临时多媒体文件有格式和大小限制，如下：
*     图片（image）: 1M，支持JPG格式
*     语音（voice）：2M，播放长度不超过60s，支持AMR\MP3格式
*     视频（video）：10MB，支持MP4格式
*     缩略图（thumb）：64KB，支持JPG格式
* 4、媒体文件在后台保存时间为3天，即3天后media_id失效。
* 返回说明
* 发送该消息后，正确情况下微信服务器返回的JSON数据包结果如下：
*   {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
* @param type 媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
* @param media form-data中媒体文件标识，有filename、filelength、content-type等信息
*
*/
function material(type,media) {
	return {
		"url":`${materialUrlPrefix}add_material`,
		"method" : "upload",
		"parameters": {	"type": type },
		"body" : {"media":media}
	}
}

/**
* 删除永久素材
* 官方文档：
* http://mp.weixin.qq.com/wiki/5/e66f61c303db51a6c0f90f46b15af5f5.html
* 返回说明
* {
    "errcode":ERRCODE,
    "errmsg":ERRMSG
   }
* 正常情况下调用成功时，errcode将为0。
*
* @param mediaId 可以通过获取素材列表来获知素材的media_id
*
*/
function del(mediaId) {
	return {
		"url":`${materialUrlPrefix}del_material`,
		"method" : "post",
		"body" : {"media_id":mediaId}
	}
}
/**
* 新增单条永久图文素材
* 官方文档：
* https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738729&token=&lang=zh_CN
*
*
* @param title 标题
* @param thumbMediaId 图文消息的封面图片素材id（必须是永久mediaId）
* @param author 作者
* @param digest 图文消息的摘要，仅有单图文消息才有摘要，多图文此处为空
* @param showCoverPic 是否显示封面，false不显示，true即显示
* @param content 图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS
* @param contentSourceUrl 图文消息的原文地址，即点击“阅读原文”后的URL
*
*/
function article(title,thumbMediaId,author,digest,showCoverPic,content,contentSourceUrl) {
	let _showCoverPic = showCoverPic ? 1 : 0
	return {
		"url":`${materialUrlPrefix}add_news`,
		"method" : "post",
		"body": {
					 "articles":[{
						 "title":title,
						 "thumb_media_id":thumbMediaId,
						 "author":author,
						 "digest":digest,
						 "show_cover_pic":_showCoverPic,
						 "content":content,
						 "content_source_url":contentSourceUrl
					 }]
				}
	}
}
/**
* 将单条永久图文素材添加到图文素材列表中
* 官方文档：
* https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738729&token=&lang=zh_CN
*
* @param articles 图文消息列表
* @param article 永久图文素材，结构同 article
*  { title, //标题
*    thumb_media_id, //图文消息的封面图片素材id（必须是永久mediaId）
*    author, //作者
*    digest, //图文消息的摘要，仅有单图文消息才有摘要，多图文此处为空
*    show_cover_pic, //是否显示封面，false不显示，true即显示
*    content, //图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS
*    content_source_url //图文消息的原文地址，即点击“阅读原文”后的URL
* }
*/
function addArticle(article,articles = new List()) {
  if(!article) {
		return articles
	}
  if(!List.isList(articles) ) {
		articles = List.of(articles)
	}
  let _showCoverPic = article.show_cover_pic ? 1 : 0

	return articles.push(Immutable.fromJS({
			title              : article.title,
			thumb_media_id     : article.thumb_media_id,
			author             : article.author,
			digest             : article.digest,
			show_cover_pic     : _showCoverPic,
			content            : article.content,
			content_source_url : article.content_source_url
	}))
}
/**
* 新增多条条永久图文素材
* 官方文档：
* https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738729&token=&lang=zh_CN
*
* @param articles 图文消息列表
* @param article 永久图文素材，结构同 article
*  { title, //标题
*    thumb_media_id, //图文消息的封面图片素材id（必须是永久mediaId）
*    author, //作者
*    digest, //图文消息的摘要，仅有单图文消息才有摘要，多图文此处为空
*    show_cover_pic, //是否显示封面，false不显示，true即显示
*    content, //图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS
*    content_source_url //图文消息的原文地址，即点击“阅读原文”后的URL
* }
*/
function articles(articles) {
	if(List.isList(articles)) {
		return {
			"url":`${materialUrlPrefix}add_news`,
			"method" : "post",
			"body": {
						 "articles":articles.toJS()
			}
		}
	} else {
		throw Error("Articles format should be an Immutable List")
	}

}
/**
* 对永久图文素材进行修改
* 官方文档：
* http://mp.weixin.qq.com/wiki/4/19a59cba020d506e767360ca1be29450.html
*
  "media_id":MEDIA_ID,
  "index":INDEX,
  "articles": {
       "title": TITLE,
       "thumb_media_id": THUMB_MEDIA_ID,
       "author": AUTHOR,
       "digest": DIGEST,
       "show_cover_pic": SHOW_COVER_PIC(0 / 1),
       "content": CONTENT,
       "content_source_url": CONTENT_SOURCE_URL
    }
* 返回说明
* {
    "errcode":ERRCODE,
    "errmsg":ERRMSG
   }
* 正常情况下调用成功时，errcode将为0。
*
* @param mediaId 要修改的图文消息的id
* @param index 要更新的文章在图文消息中的位置（多图文消息时，此字段才有意义），第一篇为0
* @param article 要修改的图文消息,结构为：
					{
							 "title": TITLE,
							 "thumb_media_id": THUMB_MEDIA_ID,
							 "author": AUTHOR,
							 "digest": DIGEST,
							 "show_cover_pic": SHOW_COVER_PIC(0 / 1),
							 "content": CONTENT,
							 "content_source_url": CONTENT_SOURCE_URL
						}
*
*/
function updateArticle(mediaId,index,article) {
	return {
		"url":`${materialUrlPrefix}update_news`,
		"method" : "post",
		"body" : {
			"media_id":mediaId,
			"index":index,
		  "articles": article
		}
	}
}

/**
* 上传图文消息内的图片获取URL
* 官方文档：
* https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1444738726&token=&lang=zh_CN
* 本接口所上传的图片不占用公众号的素材库中图片数量的5000个的限制。图片仅支持jpg/png格式，大小必须在1MB以下。
* @param media form-data中媒体文件标识，有filename、filelength、content-type等信息
*
*/
function image(image) {
	return material("image",image)
}

function video(media,title,introduction) {
	return {
		"url":`${materialUrlPrefix}add_material`,
		"method" : "upload",
		"parameters": {	"type": type },
		"body" : {
			"media":media,
			"description":{
				"title" : title,
				"introduction": introduction
			}
		}
	}
}

export default {
	article,
	addArticle,
	articles,
	updateArticle,
	material,
	video,
	image,
	getCount,
	batchGet,
	del
}
