(function(angular){
	angular.module('hex-ascii-service', [])
	.service('hexAsciiService', hexAsciiService);

	hexAsciiService.$inject = [];
	function hexAsciiService() {
		var PRINTABLE_ASCII_MIN = 0x20; // ' '
		var PRINTABLE_ASCII_MAX = 0x7E; // '~'

		var service = {
			isPrintableAscii : function(c) {
				return isPrintableAscii(c);
			},
			bytesToHex : function(data) {
				return bytesToHex(data);
			},
			bytesToHexOffset : function(data, offset, length) {
				return bytesToHexOffset(data, offset, length);
			}
		};

		return service;
		
		function isPrintableAscii(c) {
			return c >= PRINTABLE_ASCII_MIN && c <= PRINTABLE_ASCII_MAX;
		}
		
		function bytesToHex(data) {
	        return bytesToHexOffset(data, 0, data.length);
	    }

	    function bytesToHexOffset(data, offset, length) {
	        if (length <= 0) {
	            return "";
	        }

	        var hex = "";
	        for (var i = offset; i < offset + length; i++) {
	            hex = hex + String.format(" %02X", data[i] % 0xFF));
	        }
	        
	        hex.deleteCharAt(0);
	        
	        return hex.toString();
	    }

	    function bytesToAsciiMaybe(data) {
	        return bytesToAsciiMaybeOffset(data, 0, data.length);
	    }

	    function bytesToAsciiMaybeOffset(data, offset, length) {
	        var ascii = [];
	        var zeros = false;
	        
	        for (var i = offset; i < offset + length; i++) {
	            var c = data[i] & 0xFF;
	            if (isPrintableAscii(c)) {
	                if (zeros) {
	                    return null;
	                }
	                
	                //TODO
	                ascii.push((char) c);
	            } else if (c == 0) {
	                zeros = true;
	            } else {
	                return null;
	            }
	        }
	        
	        return ascii.join("");
	    }

	    //http://stackoverflow.com/questions/140131/convert-a-string-representation-of-a-hex-dump-to-a-byte-array-using-java
	    function hexToBytes(s) {
	        var len = s.length;
	        var data = [];
	        
	        for (var i = 0; i < len; i += 2) {
	            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
	                    + Character.digit(s.charAt(i+1), 16));
	        }
	        
	        return data;
	    }
	};
})(angular);