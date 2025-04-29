//inserts a string at a location in a string, returns the new string
function str_insert_at(str: string, index: number, insert: string) {
	return str.substring(0, index) + insert + str.substring(index + 1);
}

// format to store colours
class Colour {
	private packed: number;

	public constructor(packed: number) {
		this.packed = packed;
	}

	public get r() { return (this.packed & 0xFF000000) >>> 24 }
	public get g() { return (this.packed & 0x00FF0000) >>> 16 }
	public get b() { return (this.packed & 0x0000FF00) >>> 8 }
	public get a() { return (this.packed & 0x000000FF) }
	public get packedvalue() { return this.packed; }

	public static fromRGBA(r: number, g: number, b: number, a: number = 0xFF) {
		return new Colour(((r << 24) | (g << 16) | (b << 8) | a) >>> 0);
	}

	public static fromCSS(value: string) {
		if (value.startsWith("var")) {

			// get the variable name
			const varname = value.replace(/[()]|(var)/g, "");

			// get the style root
			const root = document.querySelector(':root');
			if (root === null) return new Colour(0);
			const style = getComputedStyle(root);

			// get the value from the varname in root
			value = style.getPropertyValue(varname);
		}

		// convert the hexadecimal noted value to a colour instance
		let str = value.replace("#", "");
		if (str.length === 6) str += "FF";
		const packed = parseInt(str, 16) >>> 0;
		return new Colour(packed);
	}

	public static lerp(a: Colour, b: Colour, t: number) {
		return Colour.fromRGBA(
			Math.floor(a.r + (b.r - a.r) * t),
			Math.floor(a.g + (b.g - a.g) * t),
			Math.floor(a.b + (b.b - a.b) * t),
			Math.floor(a.a + (b.a - a.a) * t),
		);
	}

	public toString() {
		return "#" + this.packed.toString(16).padStart(8, '0');
	}
}
