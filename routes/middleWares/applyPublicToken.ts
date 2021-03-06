import * as rp from 'request-promise';
import Debug from '../../modules/Debug';
const debug = Debug('ws:applyPublicToken');

export default async (ctx, next) => {
	try {
		const { 'x-access-token': accessToken } = ctx.request.headers;
		if (accessToken) {
			ctx.state.me = await rp.get('http://127.0.0.1:50901/dis/me', {
				headers: {
					'x-serve': 'service',
					'x-access-token': accessToken
				},
				json: true
			});
		}
		debug('state', ctx.state);
	} catch (e) {
		//
	}
	await next();
};
