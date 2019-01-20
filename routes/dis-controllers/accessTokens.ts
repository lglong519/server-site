import * as rp from 'request-promise';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Debug from '../../modules/Debug';
const debug = Debug('ws:accessTokens');

export const create = async ctx => {
	try {
		const schema = Joi.object().keys({
			login: Joi.string().min(3).required(),
			password: Joi.string().min(6).required(),
			client: Joi.string().valid('BOOK').required(),
		}).required();
		const validate = Joi.validate(ctx.request.body, schema);
		if (validate.error) {
			debug('validate.error', validate.error);
			throw validate.error;
		}
		const params = validate.value;

		ctx.body = await rp.post('http://127.0.0.1:50901/dis/access-tokens', {
			headers: {
				'x-serve': 'service'
			},
			body: params,
			json: true
		});
	} catch (e) {
		let err = _.get(e, 'message') || e;
		ctx.throw(400, err);
	}
};
