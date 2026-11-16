/**
 * Sprite pixel-art del murciélago (datos puros, sin lógica).
 * 6 poses aerodinámicas del ciclo de aleteo, idénticas al original.
 * '.' = píxel transparente; cada letra mapea a un color de la paleta.
 */

export const BAT_PALETTE = {
    'K': '#090d16',
    'P': '#7c3aed',
    'H': '#a855f7',
    'V': '#581c87',
    'L': '#c084fc',
    'E': '#f472b6',
    'R': '#ef4444',
    'W': '#ffffff',
    'F': '#3b0764'
};

export const BAT_PIXEL_FRAMES = [
    [
        ".......KK...............",
        "......KEK.........KKKK..",
        "......KEEK......KKLLLLK.",
        ".....KPEEEK...KKLLVVVVK.",
        "....KHPPEEKKKLLVVVVVVVK.",
        "...KHPPPPPPLLVVVVVVVVVK.",
        "..KHPPPPPPPLLVVVVVVVVVK.",
        ".KHPPPPPPPPPLLVVVVVVVVK.",
        "KHPPPPPPPPPPPPRWVVVVVK..",
        "KHPPPPPPPPPPPPPPRRKKK...",
        ".KHPPPPPPPPPPPPPKA......",
        "..KPPPPPPPPPPPPK........",
        "...KKFKK...KKFKK........"
    ],
    [
        ".......KK...............",
        "......KEK...............",
        "......KEEK......KKKKKK..",
        ".....KPEEEK...KKLLLLLLK.",
        "....KHPPEEKKKLLVVVVVVVK.",
        "...KHPPPPPPLLVVVVVVVVVK.",
        "..KHPPPPPPPLLVVVVVVVVVK.",
        ".KHPPPPPPPPPLLVVVVVVVVK.",
        "KHPPPPPPPPPPPPRWVVVVVK..",
        "KHPPPPPPPPPPPPPPRRKKK...",
        ".KHPPPPPPPPPPPPPKA......",
        "..KPPPPPPPPPPPPK........",
        "...KKFKK...KKFKK........"
    ],
    [
        "........................",
        "......KEK...............",
        "......KEEK......KKKKKK..",
        ".....KPEEEK...KKLLLLLLK.",
        "....KHPPEEKKKLLVVVVVVVK.",
        "...KHPPPPPPPLLVVVVVVVVK.",
        "..KHPPPPPPPPPLLVVVVVVVK.",
        ".KHPPPPPPPPPPLLVVVVVVVK.",
        "KHPPPPPPPPPPPPRWVVVVVK..",
        "KHPPPPPPPPPPPPPPRRKKK...",
        ".KHPPPPPPPPPPPPPK.......",
        "..KPPPPPPPPPPPPK........",
        "...KKFKK...KKFKK........"
    ],
    [
        "........................",
        "......KEK...............",
        "......KEEK..............",
        ".....KPEEEK.............",
        "....KHPPEEKK............",
        "...KHPPPPPPPKKKKK.......",
        "..KHPPPPPPPPPLLLLKKKK...",
        ".KHPPPPPPPPPPLLLLVVVVKK.",
        "KHPPPPPPPPPPPPRWVVVVVVK.",
        "KHPPPPPPPPPPPPPPRRKKKLLK",
        ".KHPPPPPPPPPPPPPK...KKK.",
        "..KPPPPPPPPPPPPK........",
        "...KKFKK...KKFKK........"
    ],
    [
        "........................",
        "......KEK...............",
        "......KEEK..............",
        ".....KPEEEK.............",
        "....KHPPEEKK............",
        "...KHPPPPPPPKKKK........",
        "..KHPPPPPPPPPLLLLKKKK...",
        ".KHPPPPPPPPPPLLLLVVVVKK.",
        "KHPPPPPPPPPPPPRWVVVVVVK.",
        "KHPPPPPPPPPPPPPPRRKKK...",
        ".KHPPPPPPPPPPPPPKA......",
        "..KPPPPPPPPPPPPK........",
        "...KKFKK...KKFKK........"
    ],
    [
        "........................",
        "......KEK...............",
        "......KEEK......KKKK....",
        ".....KPEEEK...KKLLLLK...",
        "....KHPPEEKKKLLVVVVVK...",
        "...KHPPPPPPPLLVVVVVVVK..",
        "..KHPPPPPPPPPLLVVVVVVVK.",
        ".KHPPPPPPPPPPLLVVVVVVVK.",
        "KHPPPPPPPPPPPPRWVVVVVK..",
        "KHPPPPPPPPPPPPPPRRKKK...",
        ".KHPPPPPPPPPPPPPK.......",
        "..KPPPPPPPPPPPPK........",
        "...KKFKK...KKFKK........"
    ]
];
