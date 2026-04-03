// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			customGameId?: string | null;
			rematchGameId?: string | null;
			isCreator?: string | null;
		}
		// interface Platform {}
	}
}

export {};
