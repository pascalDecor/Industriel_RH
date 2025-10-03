import { Province, TaxBracket } from '../types';

// Federal tax brackets for recent years
export const federalBrackets: Record<string, TaxBracket[]> = {
  '2024': [
    { min: 0, max: 55867, rate: 0.15 },
    { min: 55867, max: 111733, rate: 0.205 },
    { min: 111733, max: 173205, rate: 0.26 },
    { min: 173205, max: 246752, rate: 0.29 },
    { min: 246752, max: Infinity, rate: 0.33 }
  ],
  '2023': [
    { min: 0, max: 53359, rate: 0.15 },
    { min: 53359, max: 106717, rate: 0.205 },
    { min: 106717, max: 165430, rate: 0.26 },
    { min: 165430, max: 235675, rate: 0.29 },
    { min: 235675, max: Infinity, rate: 0.33 }
  ],
  '2022': [
    { min: 0, max: 50197, rate: 0.15 },
    { min: 50197, max: 100392, rate: 0.205 },
    { min: 100392, max: 155625, rate: 0.26 },
    { min: 155625, max: 221708, rate: 0.29 },
    { min: 221708, max: Infinity, rate: 0.33 }
  ],
  '2021': [
    { min: 0, max: 49020, rate: 0.15 },
    { min: 49020, max: 98040, rate: 0.205 },
    { min: 98040, max: 151978, rate: 0.26 },
    { min: 151978, max: 216511, rate: 0.29 },
    { min: 216511, max: Infinity, rate: 0.33 }
  ]
};

// CPP and EI rates by year
export const cppEiRates: Record<string, { cppRate: number; cppMax: number; eiRate: number; eiMax: number }> = {
  '2024': { cppRate: 0.0595, cppMax: 3867.50, eiRate: 0.0163, eiMax: 1049.12 },
  '2023': { cppRate: 0.0595, cppMax: 3754.45, eiRate: 0.0163, eiMax: 1002.45 },
  '2022': { cppRate: 0.057, cppMax: 3499.80, eiRate: 0.0158, eiMax: 952.74 },
  '2021': { cppRate: 0.0545, cppMax: 3166.45, eiRate: 0.0158, eiMax: 889.54 }
};

// Provincial tax brackets
export const provincialBrackets: Record<string, Record<string, TaxBracket[]>> = {
  // 2024 provincial rates
  '2024': {
    'AB': [
      { min: 0, max: 148269, rate: 0.10 },
      { min: 148269, max: 177981, rate: 0.12 },
      { min: 177981, max: 237775, rate: 0.13 },
      { min: 237775, max: 355962, rate: 0.14 },
      { min: 355962, max: Infinity, rate: 0.15 }
    ],
    'BC': [
      { min: 0, max: 47937, rate: 0.0506 },
      { min: 47937, max: 95875, rate: 0.077 },
      { min: 95875, max: 110076, rate: 0.105 },
      { min: 110076, max: 133664, rate: 0.1229 },
      { min: 133664, max: 181232, rate: 0.147 },
      { min: 181232, max: 252752, rate: 0.168 },
      { min: 252752, max: Infinity, rate: 0.205 }
    ],
    'MB': [
      { min: 0, max: 37375, rate: 0.108 },
      { min: 37375, max: 80820, rate: 0.1275 },
      { min: 80820, max: Infinity, rate: 0.174 }
    ],
    'NB': [
      { min: 0, max: 49958, rate: 0.094 },
      { min: 49958, max: 99916, rate: 0.1482 },
      { min: 99916, max: 185064, rate: 0.1652 },
      { min: 185064, max: Infinity, rate: 0.1784 }
    ],
    'NL': [
      { min: 0, max: 43198, rate: 0.087 },
      { min: 43198, max: 86395, rate: 0.145 },
      { min: 86395, max: 154244, rate: 0.158 },
      { min: 154244, max: 215943, rate: 0.178 },
      { min: 215943, max: 275990, rate: 0.198 },
      { min: 275990, max: Infinity, rate: 0.208 }
    ],
    'NT': [
      { min: 0, max: 50597, rate: 0.059 },
      { min: 50597, max: 101198, rate: 0.086 },
      { min: 101198, max: 164525, rate: 0.122 },
      { min: 164525, max: Infinity, rate: 0.1405 }
    ],
    'NS': [
      { min: 0, max: 29590, rate: 0.0879 },
      { min: 29590, max: 59180, rate: 0.1495 },
      { min: 59180, max: 93000, rate: 0.1667 },
      { min: 93000, max: 150000, rate: 0.175 },
      { min: 150000, max: Infinity, rate: 0.21 }
    ],
    'NU': [
      { min: 0, max: 53268, rate: 0.04 },
      { min: 53268, max: 106537, rate: 0.07 },
      { min: 106537, max: 173205, rate: 0.09 },
      { min: 173205, max: Infinity, rate: 0.115 }
    ],
    'ON': [
      { min: 0, max: 51446, rate: 0.0505 },
      { min: 51446, max: 102894, rate: 0.0915 },
      { min: 102894, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: Infinity, rate: 0.1316 }
    ],
    'PE': [
      { min: 0, max: 31984, rate: 0.098 },
      { min: 31984, max: 63969, rate: 0.138 },
      { min: 63969, max: Infinity, rate: 0.167 }
    ],
    'QC': [
      { min: 0, max: 49275, rate: 0.15 },
      { min: 49275, max: 98540, rate: 0.20 },
      { min: 98540, max: 119910, rate: 0.24 },
      { min: 119910, max: Infinity, rate: 0.2575 }
    ],
    'SK': [
      { min: 0, max: 51557, rate: 0.105 },
      { min: 51557, max: 147623, rate: 0.125 },
      { min: 147623, max: Infinity, rate: 0.145 }
    ],
    'YT': [
      { min: 0, max: 55867, rate: 0.064 },
      { min: 55867, max: 111733, rate: 0.09 },
      { min: 111733, max: 173205, rate: 0.109 },
      { min: 173205, max: 500000, rate: 0.128 },
      { min: 500000, max: Infinity, rate: 0.15 }
    ]
  },
  '2023': {
    // Existing 2023 data...
    'AB': [
      { min: 0, max: 142292, rate: 0.10 },
      { min: 142292, max: 170751, rate: 0.12 },
      { min: 170751, max: 227668, rate: 0.13 },
      { min: 227668, max: 341502, rate: 0.14 },
      { min: 341502, max: Infinity, rate: 0.15 }
    ],
    'BC': [
      { min: 0, max: 45654, rate: 0.0506 },
      { min: 45654, max: 91310, rate: 0.077 },
      { min: 91310, max: 104835, rate: 0.105 },
      { min: 104835, max: 127299, rate: 0.1229 },
      { min: 127299, max: 172602, rate: 0.147 },
      { min: 172602, max: 240716, rate: 0.168 },
      { min: 240716, max: Infinity, rate: 0.205 }
    ],
    'MB': [
      { min: 0, max: 36842, rate: 0.108 },
      { min: 36842, max: 79625, rate: 0.1275 },
      { min: 79625, max: Infinity, rate: 0.174 }
    ],
    'NB': [
      { min: 0, max: 47715, rate: 0.094 },
      { min: 47715, max: 95431, rate: 0.1482 },
      { min: 95431, max: 176756, rate: 0.1652 },
      { min: 176756, max: Infinity, rate: 0.1784 }
    ],
    'NL': [
      { min: 0, max: 41457, rate: 0.087 },
      { min: 41457, max: 82913, rate: 0.145 },
      { min: 82913, max: 148027, rate: 0.158 },
      { min: 148027, max: 207239, rate: 0.178 },
      { min: 207239, max: 264750, rate: 0.198 },
      { min: 264750, max: Infinity, rate: 0.208 }
    ],
    'NT': [
      { min: 0, max: 48326, rate: 0.059 },
      { min: 48326, max: 96655, rate: 0.086 },
      { min: 96655, max: 157139, rate: 0.122 },
      { min: 157139, max: Infinity, rate: 0.1405 }
    ],
    'NS': [
      { min: 0, max: 29590, rate: 0.0879 },
      { min: 29590, max: 59180, rate: 0.1495 },
      { min: 59180, max: 93000, rate: 0.1667 },
      { min: 93000, max: 150000, rate: 0.175 },
      { min: 150000, max: Infinity, rate: 0.21 }
    ],
    'NU': [
      { min: 0, max: 50877, rate: 0.04 },
      { min: 50877, max: 101754, rate: 0.07 },
      { min: 101754, max: 165429, rate: 0.09 },
      { min: 165429, max: Infinity, rate: 0.115 }
    ],
    'ON': [
      { min: 0, max: 49231, rate: 0.0505 },
      { min: 49231, max: 98463, rate: 0.0915 },
      { min: 98463, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: Infinity, rate: 0.1316 }
    ],
    'PE': [
      { min: 0, max: 31984, rate: 0.098 },
      { min: 31984, max: 63969, rate: 0.138 },
      { min: 63969, max: Infinity, rate: 0.167 }
    ],
    'QC': [
      { min: 0, max: 49275, rate: 0.15 },
      { min: 49275, max: 98540, rate: 0.20 },
      { min: 98540, max: 119910, rate: 0.24 },
      { min: 119910, max: Infinity, rate: 0.2575 }
    ],
    'SK': [
      { min: 0, max: 49720, rate: 0.105 },
      { min: 49720, max: 142058, rate: 0.125 },
      { min: 142058, max: Infinity, rate: 0.145 }
    ],
    'YT': [
      { min: 0, max: 53359, rate: 0.064 },
      { min: 53359, max: 106717, rate: 0.09 },
      { min: 106717, max: 165430, rate: 0.109 },
      { min: 165430, max: 500000, rate: 0.128 },
      { min: 500000, max: Infinity, rate: 0.15 }
    ]
  },
  '2022': {
    'AB': [
      { min: 0, max: 131220, rate: 0.10 },
      { min: 131220, max: 157464, rate: 0.12 },
      { min: 157464, max: 209952, rate: 0.13 },
      { min: 209952, max: 314928, rate: 0.14 },
      { min: 314928, max: Infinity, rate: 0.15 }
    ],
    'BC': [
      { min: 0, max: 43070, rate: 0.0506 },
      { min: 43070, max: 86141, rate: 0.077 },
      { min: 86141, max: 98901, rate: 0.105 },
      { min: 98901, max: 120094, rate: 0.1229 },
      { min: 120094, max: 162832, rate: 0.147 },
      { min: 162832, max: 227091, rate: 0.168 },
      { min: 227091, max: Infinity, rate: 0.205 }
    ],
    'ON': [
      { min: 0, max: 46226, rate: 0.0505 },
      { min: 46226, max: 92454, rate: 0.0915 },
      { min: 92454, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: Infinity, rate: 0.1316 }
    ]
  },
  '2021': {
    'AB': [
      { min: 0, max: 131220, rate: 0.10 },
      { min: 131220, max: 157464, rate: 0.12 },
      { min: 157464, max: 209952, rate: 0.13 },
      { min: 209952, max: 314928, rate: 0.14 },
      { min: 314928, max: Infinity, rate: 0.15 }
    ],
    'ON': [
      { min: 0, max: 45142, rate: 0.0505 },
      { min: 45142, max: 90287, rate: 0.0915 },
      { min: 90287, max: 150000, rate: 0.1116 },
      { min: 150000, max: 220000, rate: 0.1216 },
      { min: 220000, max: Infinity, rate: 0.1316 }
    ]
  }
};

// List of Canadian provinces
export const provinces: Province[] = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' }
];

// Tax years available
export const taxYears: string[] = ['2025','2024', '2023', '2022', '2021'];