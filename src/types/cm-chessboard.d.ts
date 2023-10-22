declare module 'cm-chessboard/*'; // Wildcard declaration

// I'm assuming Extension is being imported from 'cm-chessboard/src/model/Extension'.
// If not, adjust the path.
declare module 'cm-chessboard/src/model/Extension' {
	export class Extension {}
}

declare module 'cm-chessboard/src/Chessboard' {
	export const INPUT_EVENT_TYPE: {
		moveInputStarted: string;
		validateMoveInput: string;
		moveInputCanceled: string;
		moveInputFinished: string;
		// ... any other members of INPUT_EVENT_TYPE
	};

	export const BORDER_TYPE: {
		none: string;
		thin: string;
		frame: string;
	};
	export const FEN: {
		start: string;
		empty: string;
	};

	export class Chessboard {
		constructor(context: HTMLElement | null, props?: Record<string, any>);

		getPiece(square: string): string;

		async setOrientation(color: string, animated?: boolean): Promise<void>;

		async movePiece(squareFrom: string, squareTo: string, animated?: boolean): Promise<void>;

		async setPiece(square: string, piece: string | null, animated?: boolean): Promise<void>;

		// suppressed
    showPromotionDialog(squareTo: string, color: string, callback: Function)

		removeMarkers(type?: any, square?: any): void;

		enableMoveInput(eventHandler: (event: VisualMoveInput) => Boolean, color?: any): void;

		getPosition(): string;

		async setPosition(fen: string, animated?: boolean): Promise<void>;
	}
}

declare module 'cm-chessboard/src/view/VisualMoveInput' {
	import { Chessboard, INPUT_EVENT_TYPE } from 'cm-chessboard/src/Chessboard';

	export class VisualMoveInput {
		chessboard: Chessboard;
		squareFrom: string;
		squareTo: string;
		piece: string;
		type: INPUT_EVENT_TYPE;
	}
}

declare module 'cm-chessboard/src/extensions/markers/Markers' {
	export const MARKER_TYPE: {
		frame: any;
		framePrimary: any;
		frameDanger: any;
		circle: any;
		circlePrimary: any;
		circleDanger: any;
		square: any;
		dot: any;
		bevel: any;
	};

	// Since you have defined Extension in 'cm-chessboard/src/model/Extension',
	// you don't need to redefine it here. Just import and extend.
	import { Extension } from 'cm-chessboard/src/model/Extension';

	export class Markers extends Extension {}
}

declare module 'cm-chessboard/src/extensions/promotion-dialog/PromotionDialog' {
	import { Extension } from 'cm-chessboard/src/model/Extension';

	export class PromotionDialog extends Extension {}
}
