const willExtractOrientation = (file) => new Promise((resolve, reject) => {

	const localURL = window.URL.createObjectURL(file)
	const noOrientation = {
		orientation: -1,
		src: localURL
	}

	var reader = new FileReader();

	reader.readAsArrayBuffer(file.slice(0, 64 * 1024));

	reader.onload = function (event) {
		var view = new DataView(event.target.result);

		if (view.getUint16(0, false) !== 0xFFD8) {
			return resolve(noOrientation);
		}

		var length = view.byteLength;
		var offset = 2;

		while (offset < length) {
			var marker = view.getUint16(offset, false);
			offset += 2;

			if (marker === 0xFFE1) {
				offset += 2;
				if (view.getUint32(offset, false) !== 0x45786966) {
					return resolve(noOrientation);
				}

				var little = view.getUint16(offset += 6, false) === 0x4949;
				offset += view.getUint32(offset + 4, little);
				var tags = view.getUint16(offset, little);
				offset += 2;

				for (var i = 0; i < tags; i++) {
					if (view.getUint16(offset + (i * 12), little) === 0x0112) {
						const orientation = view.getUint16(offset + (i * 12) + 8, little)
						// console.log("Inside RotateImage" + orientation);
						return resolve({orientation: orientation, src: localURL});
					}
				}
			} else if ((marker & 0xFF00) !== 0xFF00) {
				break;
			} else {
				offset += view.getUint16(offset, false);
			}
		}
		return resolve(noOrientation);
	}
})

//function extractOrientation(file, callback) {

export default willExtractOrientation
