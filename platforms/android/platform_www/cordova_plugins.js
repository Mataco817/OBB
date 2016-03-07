cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-bluetooth-serial/www/bluetoothSerial.js",
        "id": "cordova-plugin-bluetooth-serial.bluetoothSerial",
        "clobbers": [
            "window.bluetoothSerial"
        ]
    },
    {
        "file": "plugins/cordova-plugin-rfduino/www/rfduino.js",
        "id": "cordova-plugin-rfduino.rfduino",
        "clobbers": [
            "rfduino"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-bluetooth-serial": "0.4.5",
    "cordova-plugin-rfduino": "0.1.4"
};
// BOTTOM OF METADATA
});