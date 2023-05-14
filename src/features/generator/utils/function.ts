import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import { generate } from './generate';

export const handler: Handler = async (
    _event: HandlerEvent,
    _context: HandlerContext
) => {
    generate();

    return { statusCode: 200 };
};
