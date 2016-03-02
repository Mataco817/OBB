(function(angular){
	angular.module('bluetooth-helper-service', [])
		.service('bluetoothHelperService', bluetoothHelperService);
	
	bluetoothHelperService.$inject = ['hexAsciiService'];
	function bluetoothHelperService(hexAsciiService) {		
		var shortUuidFormat = "0000%04X-0000-1000-8000-00805F9B34FB";
		
		/*
		 * Public methods
		 */
		var service = {
			sixteenBitUuid : function (shortUuid) {
				return sixteenBitUuid(shortUuid);
			},
			getDeviceInfoText : function(deivce, rssi, scanRecord) {
				return getDeviceInfoText(device, rssi, scanRecord);
			}
		};

		return service;
		
		function sixteenBitUuid(shortUuid) {
			var output;
	        console.assert(shortUuid >= 0 && shortUuid <= 0xFFFF, output);
	        return UUID.fromString(String.format(shortUuidFormat, shortUuid & 0xFFFF));
	    }
		
		function getDeviceInfoText(device, rssi, scanRecord) {
			var output = [];
			
			output.push(
				"Name: " + device.getName(),
				"\nMAC: " + device.getAddress(),
				"\nRSSI: " + rssi,
				"\nScan Record:" + parseScanRecord(scanRecord)
			);
			
	        return output.join("");
	    }
		
		// Bluetooth Spec V4.0 - Vol 3, Part C, section 8
	    function parseScanRecord(scanRecord) {
	        var output = [];
	        var i = 0;
	        
	        while (i < scanRecord.length) {
	            var len = scanRecord[i++] & 0xFF;
	            
	            if (len == 0) {
	            	break;
	            }
	            
	            switch (scanRecord[i] & 0xFF) {
	                // https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
	                case 0x0A: // Tx Power
	                    output.push("\n  Tx Power: " + scanRecord[i+1]);
	                    break;
	                case 0xFF: // Manufacturer Specific data (RFduinoBLE.advertisementData)
	                    output.push("\n  Advertisement Data: " + hexAsciiService.bytesToHexOffset(scanRecord, i + 3, len));

	                    var ascii = hexAsciiService.bytesToAsciiMaybe(scanRecord, i + 3, len);
	                    if (ascii != null) {
	                        output.push(" (\"" + ascii + "\")");
	                    }
	                    
	                    break;
	            }
	            
	            i += len;
	        }
	        
	        return output.join("");
	    }
	};
})(angular);