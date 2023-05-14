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
const handler = schedule('0 0 * * *', generateHandler);

export { handler }
