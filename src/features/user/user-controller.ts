require("dotenv").config();
import { Context } from "hono";
import { streamSSE } from "hono/streaming";
import OpenAI from 'openai';

const client = new OpenAI({
	apiKey: process.env.OPEN_AI_KEY || '',
});

namespace UserController {

  export const chat = async (ctx: Context) => {
		const payload = await ctx.req.json();
		const prompt = payload['prompt'] as string;
    const context = payload['context'] as string || '';
		if (!prompt) {
			return ctx.json({
				status: 400,
				message: 'Prompt is required',
			});
		}

		return streamSSE(ctx, async (stream) => {
			try {
				let id = 0;
				let text = '';
				const response: any = await client.chat.completions.create({
						model: 'gpt-3.5-turbo',
						messages: [
							{ role: 'system', content: `${context}` },
							{ role: 'user', content: prompt },
						],
						stream: true,
					});

					for await (const chunk of response) {
						if (chunk.choices[0]?.delta?.content) {
							text += chunk.choices[0]?.delta?.content;
							await stream.writeSSE({
								id: String(id++),
								event: 'message',
								data: JSON.stringify({
									content: chunk?.choices[0]?.delta?.content,
								}),
							});
						}
					}
					return;
				
			} catch (error: any) {
				console.log(error);
				await stream.writeSSE({
					event: 'message',
					data: JSON.stringify({
						content: 'Something went wrong try again later',
					}),
				});
			} finally {
				await stream.close();
			}
		});
	};
}

export default UserController;
