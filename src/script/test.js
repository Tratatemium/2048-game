/**
 * DEBUG/TESTING ARRAY - Uncomment to test with all tile values
 * This pre-filled array is useful for testing animations and styling
 */
// state.gameArray = [
//     [
//         { id: 1, value: 2, x: 0, y: 0 },
//         { id: 2, value: 4, x: 1, y: 0 },
//         { id: 3, value: 8, x: 2, y: 0 },
//         { id: 4, value: 16, x: 3, y: 0 }
//     ],
//     [
//         { id: 5, value: 32, x: 0, y: 1 },
//         { id: 6, value: 64, x: 1, y: 1 },
//         { id: 7, value: 128, x: 2, y: 1 },
//         { id: 8, value: 256, x: 3, y: 1 }
//     ],
//     [
//         { id: 9, value: 512, x: 0, y: 2 },
//         { id: 10, value: 1024, x: 1, y: 2 },
//         { id: 11, value: 2048, x: 2, y: 2 },
//         { id: null, value: 0, x: 3, y: 2 }
//     ],
//     [
//         { id: null, value: 0, x: 0, y: 3 },
//         { id: null, value: 0, x: 1, y: 3 },
//         { id: null, value: 0, x: 2, y: 3 },
//         { id: null, value: 0, x: 3, y: 3 }
//     ]
// ];
// updateGameField();

/**
 * WIN / DEFEAT TESTING ARRAY - Uncomment to test win condition
 * Board is one move away from win (two 1024 tiles that can merge to 2048) or defeat (only one tile is empty)
 */
// state.gameArray = [
//         [
//             { id: 1, value: 2, x: 0, y: 0 },
//             { id: 2, value: 4, x: 1, y: 0 },
//             { id: 3, value: 8, x: 2, y: 0 },
//             { id: 4, value: 16, x: 3, y: 0 }
//         ],
//         [
//             { id: 5, value: 32, x: 0, y: 1 },
//             { id: 6, value: 64, x: 1, y: 1 },
//             { id: 7, value: 1024, x: 2, y: 1 },
//             { id: 8, value: 1024, x: 3, y: 1 }
//         ],
//         [
//             { id: 9, value: 8, x: 0, y: 2 },
//             { id: 10, value: 16, x: 1, y: 2 },
//             { id: 11, value: 32, x: 2, y: 2 },
//             { id: 12, value: 64, x: 3, y: 2 }
//         ],
//         [
//             { id: 13, value: 2, x: 0, y: 3 },
//             { id: 14, value: 4, x: 1, y: 3 },
//             { id: 15, value: 8, x: 2, y: 3 },
//             { id: null, value: 0, x: 3, y: 3 }  // Only one empty space
//         ]
//     ];
// updateGameField();