import 'babel-polyfill'
import chai from 'chai'
import chaiAsPromised  from 'chai-as-promised'
import nock from 'nock'
import Weixin from '../lib'
import CustomerServiceManager from '../lib/managers/customer_service_manager'

const weixin = new Weixin({
	appId:'appId',
	appSecret: 'appSecret',
	token:'token'
})

const talker = weixin.getTalker()

chai.use(chaiAsPromised)
const addNock = nock('https://api.weixin.qq.com')
										.defaultReplyHeaders({
											'Content-Type': 'application/json'
										})
										.get('/cgi-bin/token')
										.query({
											'grant_type':'client_credential',
											'appid':'appId',
											'secret':'appSecret'
										})
										.reply(200, {
											'access_token':'accessToken',
											'expires_in':7200
										})
								    .post('/customservice/kfaccount/add')
										.query({"access_token":'accessToken'})
								    .reply(200, {
											errcode:0,
											errmsg:'ok'
										})

const delNock = nock('https://api.weixin.qq.com/')
										.defaultReplyHeaders({
											'Content-Type': 'application/json'
										})
										.get('/cgi-bin/token')
										.query({
											'grant_type':'client_credential',
											'appid':'appId',
											'secret':'appSecret'
										})
										.reply(200, {
											'access_token':'accessToken',
											'expires_in':7200
										})
										.post('/customservice/kfaccount/del')
										.query({"access_token":'accessToken'})
								    .reply(200, {
											errcode:0,
											errmsg:'ok'
										})

const listNock = nock('https://api.weixin.qq.com/')
										.defaultReplyHeaders({
											'Content-Type': 'application/json'
										})
										.get('/cgi-bin/token')
										.query({
											'grant_type':'client_credential',
											'appid':'appId',
											'secret':'appSecret'
										})
										.reply(200, {
											'access_token':'accessToken',
											'expires_in':7200
										})
										.get('/customservice/kfaccount/getkflist')
										.query({"access_token":'accessToken'})
										.reply(200, {
											errcode:0,
											errmsg:'ok'
										})

describe('Weixin Talker:', function (done) {
  describe('customer service manager', function () {
    it('should add account success', function () {
			return talker.send(
					CustomerServiceManager.add('test1@test','test1','passwd')
			).then(response => response.json())
			 .catch(response => {
					console.log(response)
					Promise.resolve(response)
			 })
			 .then(result => {
				 return result.errcode
			 })
			 .should.eventually.equal(0)
	    });

		it('should delete account success', function () {
				return talker.send(
						CustomerServiceManager.delete('test1@test','test1','passwd')
				).then(response => response.json())
				 .catch(response => {
						console.log(response)
						Promise.resolve(response)
				 })
				 .then(result => {
					 return result.errcode
				 })
				 .should.eventually.equal(0)
		    });

		it('should get account list success', function () {
				return talker.send(
						CustomerServiceManager.list()
				).then(response => response.json())
				 .catch(response => {
						console.log(response)
						Promise.resolve(response)
				 })
				 .then(result => {
					 return result.errcode
				 })
				 .should.eventually.equal(0)
				});
  });
});
