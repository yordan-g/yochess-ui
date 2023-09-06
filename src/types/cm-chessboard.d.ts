declare module 'cm-chessboard/src/Chessboard.js' {
	import { VisualMoveInput } from 'cm-chessboard/src/view/VisualMoveInput';

	export class Chessboard {
		constructor(context: HTMLElement | null, props?: Record<string, any>);

		getPiece(square: string): string;

		async setOrientation(color: string, animated?: boolean): Promise<void>;

		async movePiece(squareFrom: string, squareTo: string, animated?: boolean): Promise<void>;

		removeMarkers(type?: any, square?: any): void;

		enableMoveInput(eventHandler: (event: VisualMoveInput) => Boolean, color?: any): void;

		getPosition(): string;

		async setPosition(fen: string, animated?: boolean): Promise<void>;
	}

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
}

declare module 'cm-chessboard/src/view/VisualMoveInput' {
	import { Chessboard, INPUT_EVENT_TYPE } from 'cm-chessboard/src/Chessboard.js';

	export class VisualMoveInput {
		chessboard: Chessboard;
		squareFrom: string;
		squareTo: string;
		type: INPUT_EVENT_TYPE;
	}
}

declare module 'cm-chessboard/src/extensions/markers/Markers.js' {
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

	export class Extension {}

	export class Markers extends Extension {}
}
