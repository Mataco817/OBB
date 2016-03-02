(function(angular){
	angular.module('rfduino-service', [])
	.service('rfduinoService', rfduinoService);

	rfduinoService.$inject = ['bluetoothHelperService'];
	function rfduinoService(bluetoothHelperService) {
		// private final static String TAG = RFduinoService.class.getSimpleName();
		var TAG = this.toString();
		var ACTION_CONNECTED = "com.rfduino.ACTION_CONNECTED";
		var ACTION_DISCONNECTED = "com.rfduino.ACTION_DISCONNECTED";
		var ACTION_DATA_AVAILABLE = "com.rfduino.ACTION_DATA_AVAILABLE";
		var EXTRA_DATA = "com.rfduino.EXTRA_DATA";
		
		var UUID_SERVICE = bluetoothHelperService.sixteenBitUuid(0x2220);
		var UUID_RECEIVE = bluetoothHelperService.sixteenBitUuid(0x2221);
		var UUID_SEND = bluetoothHelperService.sixteenBitUuid(0x2222);
		var UUID_DISCONNECT = bluetoothHelperService.sixteenBitUuid(0x2223);
		var UUID_CLIENT_CONFIGURATION = bluetoothHelperService.sixteenBitUuid(0x2902);
		
		var GattCallbacks = {
			onConnectionStateChange : function(gatt, status, newState) {
				if (newState == BluetoothProfile.STATE_CONNECTED) {
	                Log.i(TAG, "Connected to RFduino.");
	                Log.i(TAG, "Attempting to start service discovery:" + mBluetoothGatt.discoverServices());
	            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
	                Log.i(TAG, "Disconnected from RFduino.");
	                broadcastUpdate(ACTION_DISCONNECTED);
	            }
			},
			onServicesDiscovered : function(gatt, status) {
				if (status == BluetoothGatt.GATT_SUCCESS) {
	                mBluetoothGattService = gatt.getService(UUID_SERVICE);
	                
	                if (mBluetoothGattService == null) {
	                    Log.e(TAG, "RFduino GATT service not found!");
	                    return;
	                }

	                BluetoothGattCharacteristic receiveCharacteristic = mBluetoothGattService.getCharacteristic(UUID_RECEIVE);
	                if (receiveCharacteristic != null) {
	                    BluetoothGattDescriptor receiveConfigDescriptor = receiveCharacteristic.getDescriptor(UUID_CLIENT_CONFIGURATION);
	                    
	                    if (receiveConfigDescriptor != null) {
	                        gatt.setCharacteristicNotification(receiveCharacteristic, true);

	                        receiveConfigDescriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
	                        gatt.writeDescriptor(receiveConfigDescriptor);
	                    }
	                    else {
	                        Log.e(TAG, "RFduino receive config descriptor not found!");
	                    }

	                }
	                else {
	                    Log.e(TAG, "RFduino receive characteristic not found!");
	                }

	                broadcastUpdate(ACTION_CONNECTED);
	            }
				else {
	                Log.w(TAG, "onServicesDiscovered received: " + status);
	            }
			},
			onCharacteristicRead : function(gatt, characteristic, status) {
				if (status == BluetoothGatt.GATT_SUCCESS) {
	                broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
	            }
			},
			onCharacteristicChanged : function(gatt, characteristic) {
				broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
			}
		};
		
		function broadcastUpdate(action) {
			final Intent intent = new Intent(action);
	        sendBroadcast(intent, Manifest.permission.BLUETOOTH);
		}
		
		function broadcastUpdate(action, characteristic) {
			if (UUID_RECEIVE.equals(characteristic.getUuid())) {
				final Intent intent = new Intent(action);
				intent.putExtra(EXTRA_DATA, characteristic.getValue());
				sendBroadcast(intent, Manifest.permission.BLUETOOTH);
			}
		}
	};
})(angular);