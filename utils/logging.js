const colors_ = require('./enums/logColors.js');

exports.LogSuccess = (msg) => {
    console.log(colors_.GREEN_LOG, msg);
}
exports.LogInfo = (msg) => {
    console.log(colors_.CYAN_LOG, msg);
}
exports.LogWarning = (msg) => {
    console.log(colors_.YELLOW_LOG, msg);
}
exports.LogDanger = (msg) => {
    console.log(colors_.RED_LOG, msg);
}