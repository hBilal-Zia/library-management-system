exports.apiSuccessResponse = (message, data, error_msgs = {}) => {
    return {
        response: true,
        message: message,
        error_msgs: error_msgs,
        data: data
    }
}

exports.apiFailedResponse = (message, data, error_msgs) => {
    return {
        response: false,
        message: message,
        error_msgs: error_msgs,
        data: data
    }
}