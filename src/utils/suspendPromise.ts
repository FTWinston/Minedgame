/** Wrap a promise up in a function that throws a promise while it's still resolving.
 * This lets react suspend until it has resolved.
 * Use this function in the root of a file, and then call its result inside a component
 * that you want to suspend.
 */
export function suspendPromise<T>(promise: Promise<T>) {
    let success: boolean | undefined;
    let result: T;
    let errorMessage: string;

    const fetching = promise
        .then((json) => {
            success = true;
            result = json;
        })
        .catch((error: string) => {
            success = false;
            errorMessage = error;
        });
  
    return () => {
        if (success === true) {
            return result; // Result is a fulfilled promise
        } else if (success === false) {
            throw errorMessage; // Result is an error
        } else {
            throw fetching; // Suspend(A way to tell React data is still fetching)
        }
    };
}
