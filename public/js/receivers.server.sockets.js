var socketIO;
exports.receivers = (io) => {
socketIO = io;
io.emit(‘generated notification’,’hello’);
}
