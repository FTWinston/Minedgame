import { Handler, schedule } from '@netlify/functions';
import { generate } from './generate';

const generateHandler: Handler = async (
//    event: HandlerEvent,
//    context: HandlerContext
) => {
    generate();

    return { statusCode: 200 };
};

// Run every day at midnight UTC.
export const handler = schedule('0 0 * * *', generateHandler);
