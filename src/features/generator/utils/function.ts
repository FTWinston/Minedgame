import { Handler, HandlerContext, HandlerEvent, schedule } from '@netlify/functions';
import { generate } from './generate';

const generateHandler: Handler = async (
    _event: HandlerEvent,
    _context: HandlerContext
) => {
    generate();

    return { statusCode: 200 };
};

// Run every day at midnight UTC.
const handler = schedule('0 0 * * *', generateHandler);

export { handler }
