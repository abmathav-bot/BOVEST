export const mockUserData = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  mobile: "+91 98765 43210",
  bankDetails: {
    bankName: "HDFC Bank",
    accountName: "John Doe",
    accountNumber: "123456789012",
    ifscCode: "HDFC0001234"
  },
  kyc: {
    status: 'Verified',
    documentType: 'PAN Card',
    documentNumber: 'ABCD1234E'
  },
  portfolioValue: 5000,
  growthPercentage: 2.5,
  todayReturn: 77,
  monthReturn: 2310,
  recentActivities: [
    { id: 1, date: "12 Sep 2026", details: "14.7L Milk", health: "Good", profit: 77 },
    { id: 2, date: "11 Sep 2026", details: "14.5L Milk", health: "Good", profit: 76 },
    { id: 3, date: "10 Sep 2026", details: "14.2L Milk", health: "Good", profit: 74 },
  ],
  investments: [
    {
      id: 101,
      scheme: "A",
      amount: 200000,
      startDate: "2024-01-01",
      activeYears: 2.2,
      cows: 2,
      calves: 1
    }
  ]
};

export const mockSchemes = [
  {
    id: "scheme-a",
    name: "Scheme A: Milk-Based Investment",
    description: "Invest in a cow. Daily milk profits shared. 5-year lock-in with animal value return."
  }
];

