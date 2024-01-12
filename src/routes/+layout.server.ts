import type { LayoutServerLoad } from './$types';
import { v4 as uuidv4 } from "uuid";
export async function load() {
	return {
		userId: uuidv4()
	};
}